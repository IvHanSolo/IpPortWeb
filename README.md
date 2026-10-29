# Ivan Philips – portfolio book

## What is in this folder

| File | What it is |
|---|---|
| `index.html` | Cover (this is the site's front door, keep this name) |
| `contents.html` | Index / contents |
| `writing.html` | Writing |
| `photography.html` | Photography: album grid and art wall |
| `video.html` | Video: showreel and folders |
| `other-works.html` | Other works |
| `about.html` | About |
| `special-thanks.html` | Special thanks |
| `content.json` | **All your text, photo names, video links.** This is the file you edit. |
| `assets/styles.css`, `assets/app.js`, `assets/fonts/` | The design and the code. Shared by every page. Leave alone. |
| `images/` | Your photos (one sub-folder per album, for example `images/goa/`) |
| `writing/` | PDFs for writing pieces |
| `optimize-images.py` | Shrinks big PNGs into web-sized images |

Keep every page in the same folder as `content.json`. Do not rename the HTML files.

## Put it online (GitHub Pages)

1. Add everything in this folder to the repo root (so `index.html` sits at the top).
2. Repo > Settings > Pages > Deploy from a branch > `main` / root.
3. Opening the pages by double-click will show placeholders only, because browsers block `content.json` on local files. Test on the live link, or run `python3 -m http.server` in this folder and open `http://localhost:8000`.

## Photos: size matters

5-10 MB PNGs are far too heavy for the web. About 110 of them would be ~700 MB, the site would crawl on phones, and GitHub would complain. Keep your PNGs as your originals, and upload web copies:

- Longest side **2000 px**, **WebP or JPG, quality about 80**. That gives roughly **300-600 KB** per photo and looks the same on screen.
- Use the script: `pip install pillow`, then
  `python optimize-images.py "My Edits/Goa" images/goa`
  It makes the web copies, cleans the names, and prints the list to paste into `content.json`.
- Or export from Photoshop / Lightroom / squoosh.app with the same settings, sRGB colour.
- File names: lowercase, hyphens, no spaces (`goa-sunset-01.webp`).
- Keep PNG only for graphics that need transparency.

## Using Studio (the easy way to add things)

Studio is a small panel that lets you add content and see it live, without touching code.

1. Open any page of your live site with `?edit` on the end, for example `yoursite.com/photography.html?edit`. A **Studio** button appears bottom right. Stay with `?edit` while you work; the links keep it.
2. Choose **What** you are adding:
   - **Photo (into a folder)**: type the album in *Folder or group name*, for example `Goa` or, for a Travel album, `Travel / Goa`. Pick the files. They land in `images/goa/`.
   - **Art wall piece**: pick files, they go to `images/wall/`.
   - **Video (into a video folder)**: type the folder (`Short Films`), a title, and paste the YouTube or Vimeo link into *Link*.
   - **Showreel**: paste the link into *Link*.
   - **Writing**: title, description, paste the text. A PDF file is optional.
   - **Other work**: folder name (`Presentations`), status (Completed or WIP), then the files or a link.
   - **Special thanks**: name in *Title*, what they did in *Description*.
3. Press **Add**. You see it straight away. The list under the buttons shows the exact files to upload and where they go.
4. Press **Download content.json**.
5. In the repo: replace `content.json`, and add the listed files into the folders shown (use the web-sized copies, the same ones you picked in Studio).
6. Commit. The site updates in a minute or two.

Your work is saved as a draft in that browser while you add things. **Discard draft** wipes it. **Import** loads a `content.json` back in.

## Editing `content.json` by hand

Open it in any text editor. The parts you will touch most:

```json
"photography": {
  "leisure": [
    { "group": "Travel", "title": "Goa", "desc": "One line about the album.",
      "folder": "images/goa/",
      "items": ["goa-01.webp", "goa-02.webp"] }
  ],
  "wall": [ { "title": "Piece name", "src": "images/wall/one.webp" } ]
},
"video": {
  "showreel": { "title": "Showreel", "desc": "One line.", "embed": "https://youtu.be/XXXXXXXXXXX" },
  "folders": [
    { "title": "Short Films", "desc": "One line.",
      "items": [ { "title": "Film name", "desc": "One line.", "embed": "https://youtu.be/XXXXXXXXXXX" } ] }
  ]
},
"writing": { "leisure": [ { "title": "Piece", "desc": "One line.", "text": "Full text.\n\nNew paragraph.", "pdf": "writing/piece.pdf" } ], "work": [] }
```

- The order in a list is the order on the page. Pages and layouts are made for you.
- `group` is optional. It only adds the small "Travel" tag.
- A photo can be a plain file name (it uses the album's `folder`), or `{ "title": "Nice title", "src": "goa-01.webp" }` if you want a proper title for search.
- Videos: upload to YouTube or Vimeo (unlisted is fine) and paste the normal link.
- JSON is strict: every item in a list is separated by a comma, no comma after the last one, double quotes only.

## Smooth transitions (v2)

- Each section is its own page. Leaving a page fades the book out, the next page is already prefetched, then the book fades in. Tabs and frame stay put.
- Page-flips inside a section are lighter: no blur filter or brightness animation.
- Fonts are preloaded and content.json is cached normally. With ?edit it is always re-read fresh.
