# ULTIM8 — Interactive Brand Guidelines

Open `index.html` through any static web server (or publish to GitHub Pages: everything is plain HTML/CSS/JS, no build step).

- `index.html` — the guideline, Aisle 01 → 05, same sections, copy and page numbers as *Ultim8_BrandGuideline_3*.
- `kiosk/index.html` — the working AI kiosk (1920 × 1080 iPad, landscape). Also embedded in Aisle 04 › Digital Shopping.
- `assets/brand/vector-assets.svg` — the supplied master artwork. `svg/marks.js` and `svg/pattern-*.svg` are 1:1 extracts of it (no redrawing).
- Font: Pacaembu via Adobe Fonts (`https://use.typekit.net/bsr5idk.css`). Add your live domain to the Adobe Fonts web project before publishing.
- `GITHUB_PROMPT.md` — the prompt for rebuilding/publishing this on GitHub.

Quick local preview (macOS Terminal, from this folder):

    ruby -run -e httpd . -p 8000

then open http://localhost:8000
