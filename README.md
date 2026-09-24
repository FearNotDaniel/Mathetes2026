# Mathetes homepage

Static one-page site for the Mathetes course (Home Base Wien / Loretto
Gemeinschaft). Plain HTML, CSS and a little vanilla JS – no build step.

```
index.html          page markup
css/styles.css      all styles (desktop matches the approved 1130px mockup;
                    breakpoints at 960px and 600px)
js/main.js          mobile menu + FAQ accordion
assets/             images
.github/workflows/  GitHub Pages deployment
```

## Local preview

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then http://localhost:8000
```

## Deployment (GitHub Pages)

Every push to `main` deploys via `.github/workflows/pages.yml`.
One-time setup: in the repo on GitHub go to **Settings → Pages** and set
**Source** to **GitHub Actions**. The site will be served at
`https://<user>.github.io/Mathetes2026/` (all paths are relative, so it
also works on a custom domain – add a `CNAME` file and include it in the
workflow's copy step).

## Still open

- **Impressum / Datenschutz** links in the footer are `href="#"` stubs –
  an Austrian site needs real legal pages before going live.
- **Videos** in "Erfahrungen" are still static stills with a play icon;
  wire up YouTube/Vimeo embeds or `<video>` once the files exist.
- **Contact** is via `mailto:` links only; no form.
- **Images** aren't compressed or served with `srcset`; the page is
  ~3 MB of images, mostly the team PNGs and carousel JPEGs.
