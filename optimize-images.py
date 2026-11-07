#!/usr/bin/env python3
"""
Shrink big PNG/JPG/TIFF photos into web-ready WebP images AND read their shooting details (EXIF).

  pip install pillow
  python optimize-images.py "My Edits/Andaman" images/andaman

Add to an album in content.json in the same step (safe to re-run any time):
  python optimize-images.py "My Edits/Andaman" images/andaman --content content.json --album Andaman

Options:
  --max 2000        longest side in pixels (default 2000)
  --quality 82      0-100 (default 82)
  --format webp     webp (default, smallest) or jpg
  --content FILE    content.json to update
  --album NAME      album title inside content.json (must already exist)

What it does with --content / --album:
  * photo already in the album (same file name)  -> only fills in missing "exif" details, never overwrites your title/tags
  * new photo                                    -> appended with a title made from the file name; add tags by hand

Privacy: the web copies carry NO metadata at all (no GPS, no camera serial). The details are
copied into content.json as plain text, only the fields listed below. GPS is never read.
Your originals are never touched. File names are cleaned (lowercase-with-hyphens).
"""
import argparse, json, os, re, sys
from fractions import Fraction
from PIL import Image, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--max", type=int, default=2000)
ap.add_argument("--quality", type=int, default=82)
ap.add_argument("--format", choices=["webp", "jpg"], default="webp")
ap.add_argument("--content"); ap.add_argument("--album")
a = ap.parse_args()
if bool(a.content) != bool(a.album):
    sys.exit("Use --content and --album together.")

def read_exif(im):
    """Return only the shooting details we show on the site. GPS is deliberately ignored."""
    try:
        ex = im.getexif(); sub = ex.get_ifd(0x8769)
    except Exception:
        return {}
    g = lambda *ks: next((v for k in ks for v in (sub.get(k), ex.get(k)) if v not in (None, "")), None)
    out = {}
    make, model = str(ex.get(0x010F) or "").strip(), str(ex.get(0x0110) or "").strip()
    if model:
        out["camera"] = model if make and model.lower().startswith(make.lower().split()[0]) else f"{make} {model}".strip()
    lens = g(0xA434)
    if lens: out["lens"] = str(lens).strip()
    f = g(0x829D)
    if f: out["aperture"] = "f/" + f"{float(f):.1f}".rstrip("0").rstrip(".")
    t = g(0x829A)
    if t:
        t = float(t)
        out["shutter"] = (f"1/{round(1/t)} s" if t < 0.5 else f"{t:g} s")
    iso = g(0x8827, 0x8832)
    if isinstance(iso, (tuple, list)): iso = iso[0]
    if iso: out["iso"] = str(int(iso))
    fl = g(0x920A)
    if fl:
        s = f"{float(fl):g} mm"; eq = g(0xA405)
        if eq and round(float(eq)) != round(float(fl)): s += f" ({int(eq)} mm equiv.)"
        out["focal"] = s
    d = g(0x9003, 0x0132)
    if d:
        m = re.match(r"(\d{4}):(\d{2}):(\d{2})", str(d))
        if m:
            import datetime
            out["date"] = datetime.date(*map(int, m.groups())).strftime("%-d %B %Y") if os.name != "nt" else str(d)[:10]
    return out

os.makedirs(a.out, exist_ok=True)
ok = (".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp")
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "photo"
names, found, before, after = [], {}, 0, 0

for f in sorted(os.listdir(a.src)):
    if not f.lower().endswith(ok):
        continue
    p = os.path.join(a.src, f)
    raw = Image.open(p)
    exif = read_exif(raw)
    im = ImageOps.exif_transpose(raw)
    if im.mode not in ("RGB",):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA"); bg.paste(im, mask=im.split()[3]); im = bg
    im.thumbnail((a.max, a.max), Image.LANCZOS)
    base = slug(os.path.splitext(f)[0]); name = f"{base}.{a.format}"; n = 2
    while name in names:
        name = f"{base}-{n}.{a.format}"; n += 1
    o = os.path.join(a.out, name)
    if a.format == "webp":
        im.save(o, "WEBP", quality=a.quality, method=6)      # no exif= argument: metadata is dropped
    else:
        im.save(o, "JPEG", quality=a.quality, optimize=True, progressive=True)
    names.append(name); found[name] = exif
    b, c = os.path.getsize(p), os.path.getsize(o); before += b; after += c
    print(f"{f}  {b/1e6:.1f} MB  ->  {name}  {c/1e3:.0f} KB   " + (", ".join(f"{k}: {v}" for k, v in exif.items()) or "(no EXIF in this file)"))

if not names:
    sys.exit("No images found in " + a.src)
print(f"\n{len(names)} images: {before/1e6:.1f} MB -> {after/1e6:.1f} MB")

if a.content:
    c = json.load(open(a.content, encoding="utf-8"))
    al = next((x for x in c["photography"]["leisure"] if x["title"].lower() == a.album.lower()), None)
    if not al: sys.exit(f'Album "{a.album}" not found in {a.content}')
    folder = a.out.rstrip("/\\").replace("\\", "/") + "/"
    al.setdefault("folder", folder)
    items = [i for i in al["items"] if i.get("src")]            # drop empty placeholder slots
    al["items"] = [i if isinstance(i, dict) else {"title": "", "src": i} for i in items]
    by = {i["src"].split("/")[-1]: i for i in al["items"]}
    added = filled = 0
    for name in names:
        it = by.get(name)
        if not it:
            it = {"title": name.rsplit(".", 1)[0].replace("-", " ").title(), "src": name, "desc": "", "tags": []}
            al["items"].append(it); added += 1
        if found[name]:
            new = {k: v for k, v in found[name].items() if not it.get("exif", {}).get(k)}
            if new: it.setdefault("exif", {}).update(new); filled += 1
    json.dump(c, open(a.content, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f'\ncontent.json updated: {added} new photo(s) added to "{al["title"]}", details filled for {filled}.')
else:
    print("\nPhoto file names for content.json:\n" + str(names).replace("'", '"'))
