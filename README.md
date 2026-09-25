# Mathetes homepage

Static one-page site for the Mathetes course (Home Base Wien / Loretto
Gemeinschaft). Plain HTML, CSS and a little vanilla JS – no build step.

```
index.html          page markup
impressum.html      legal pages (text copied from loretto.at)
datenschutz.html
css/styles.css      all styles (desktop matches the approved 1130px mockup;
                    breakpoints at 1100px (header only),
                    960px and 600px)
js/main.js          mobile menu, photo marquee, FAQ accordion, video popup
assets/             images
assets/fonts/       Archivo (variable woff2) and Tinos (early-bird badge),
                    self-hosted – no requests to Google; SIL OFL licences
                    alongside
.github/workflows/  GitHub Pages deployment
```

## Local preview

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then http://localhost:8000
```

## Deployment (GitHub Pages)

Preview site: **https://mathetes.tenacity.at**

Every push to `main` deploys via GitHub Actions (**Settings → Pages →
Source: GitHub Actions**). The custom domain is configured under
**Settings → Pages → Custom domain**; with Actions-based deployment no
`CNAME` file is needed in the repo. All asset paths are relative, so the
site also still works from `https://fearnotdaniel.github.io/Mathetes2026/`
(GitHub redirects that to the custom domain).

GitHub Pages lets browsers cache CSS and JS for 4 hours, so the deploy
step appends a content hash to their URLs in every published HTML page
(e.g. `css/styles.css?v=3f9a1c2b7e`). Keep referencing them without the
query string in the source; any new CSS/JS file needs adding to the
fingerprint loop in `.github/workflows/pages.yml`.

The preview shouldn't show up in search results, so the deploy step also
adds `<meta name="robots" content="noindex, nofollow">` to every
published HTML page. It isn't in the source files, so a production
deployment only needs to leave that workflow step out. There's
deliberately no `robots.txt`: a crawler blocked by `Disallow` never reads
the page, so it can't see the noindex and may still list the bare URL.

## Still open

- **Videos** in "Erfahrungen" are self-hosted (`assets/video/`) and play
  in a `<dialog>` popup, full-screen on phones. They're the current 480p
  files; higher-resolution versions are due from the client's media team.
  When swapping, use new filenames (the 4 h browser cache), update
  `data-aspect`, the durations in the `aria-label`s, and `--video-max-h` in
  the CSS. Encoded with:
  `ffmpeg -i in.mov -c:v libx264 -preset slow -crf 24 -profile:v high
  -pix_fmt yuv420p -r 30 -c:a aac -b:a 96k -movflags +faststart out.mp4`
- **Contact** is via `mailto:` links only; no form.
- **Images** are sized to about twice their largest display size (sharp
  on high-density screens) and compressed: photos as progressive JPEG
  (quality ~80), carousel photos pre-cropped to the 4:3 frame they show
  in (640×480). The transparent team portraits and home badge are WebP
  with a PNG fallback via `<picture>`. No `srcset`: each image displays
  at much the same size at every breakpoint, so one file per image is
  enough. About 1 MB of images in total.
