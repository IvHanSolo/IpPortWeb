#!/usr/bin/env python3
"""
Shrink big PNG/JPG/TIFF photos into web-ready images.

  pip install pillow
  python optimize-images.py "My Edits/Goa" images/goa

Options:
  --max 2000        longest side in pixels (default 2000)
  --quality 82      0-100 (default 82)
  --format webp     webp (default, smallest) or jpg

A 6 MB PNG becomes roughly 300-600 KB and still looks sharp on screen.
Your originals are never touched. File names are cleaned (lowercase-with-hyphens).
At the end it prints the file names to paste into content.json.
"""
import argparse, os, re, sys
from PIL import Image, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--max", type=int, default=2000)
ap.add_argument("--quality", type=int, default=82)
ap.add_argument("--format", choices=["webp", "jpg"], default="webp")
a = ap.parse_args()

os.makedirs(a.out, exist_ok=True)
ok = (".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp")
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "photo"
names, before, after = [], 0, 0

for f in sorted(os.listdir(a.src)):
    if not f.lower().endswith(ok):
        continue
    p = os.path.join(a.src, f)
    im = ImageOps.exif_transpose(Image.open(p))
    if im.mode not in ("RGB",):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA"); bg.paste(im, mask=im.split()[3]); im = bg
    im.thumbnail((a.max, a.max), Image.LANCZOS)
    base = slug(os.path.splitext(f)[0]); name = f"{base}.{a.format}"; n = 2
    while name in names:
        name = f"{base}-{n}.{a.format}"; n += 1
    o = os.path.join(a.out, name)
    if a.format == "webp":
        im.save(o, "WEBP", quality=a.quality, method=6)
    else:
        im.save(o, "JPEG", quality=a.quality, optimize=True, progressive=True)
    names.append(name); b, c = os.path.getsize(p), os.path.getsize(o); before += b; after += c
    print(f"{f}  {b/1e6:.1f} MB  ->  {name}  {c/1e3:.0f} KB")

if not names:
    sys.exit("No images found in " + a.src)
print(f"\n{len(names)} images: {before/1e6:.1f} MB -> {after/1e6:.1f} MB")
print("\nPaste into content.json (the album's items):\n" + str(names).replace("'", '"'))
