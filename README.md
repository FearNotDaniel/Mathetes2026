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
js/main.js          mobile menu, photo marquee, FAQ accordion
assets/             images
assets/fonts/       Archivo (variable woff2, self-hosted – no requests to
                    Google; SIL OFL licence alongside)
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

## Still open

- **Videos** in "Erfahrungen" are still static stills with a play icon;
  wire up YouTube/Vimeo embeds or `<video>` once the files exist.
- **Contact** is via `mailto:` links only; no form.
- **Images** aren't compressed or served with `srcset`; the page is
  ~3 MB of images, mostly the team PNGs and carousel JPEGs.
