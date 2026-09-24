# Mathetes homepage — static export

This is a plain, portable export of the Design canvas mockup — a single
`index.html` plus an `assets/` folder of the images used in it. It has no
dependency on Claude's Artifact runtime anymore, so it's a normal starting
point for Claude Code.

## What's already working
- Semantic HTML, all styling inline (no external stylesheet dependency
  besides the Google Fonts link for Archivo)
- The FAQ accordion runs on ~15 lines of plain vanilla JS (no framework)
- All images are local files under `assets/`, referenced by relative path

## What Claude Code will likely need to do before this is deployable
- **Not responsive.** Everything is built at a fixed 1130px width for
  desktop review. There's no mobile/tablet layout at all yet.
- **Inline styles everywhere.** Fine for a mockup, but worth extracting
  into a real stylesheet (or component styles, if you set up a
  framework) before this grows further.
- **Placeholder links.** The nav links (`Bist du bereit?`, `Erfahrungen`,
  etc.) are `href="#"` — they need real in-page anchors or routes.
  `Impressum` / `Datenschutz` in the footer are stubs with no actual
  legal text yet.
- **Video placeholders.** The two video bubbles in "Erfahrungen" show a
  static still + play icon, not an actual embedded video — wire those
  up once you have the real video files or a hosting solution (YouTube/
  Vimeo embed, or a native `<video>` tag).
- **Email links are `mailto:`.** Fine for a simple site, but if you want
  a real contact form with validation/spam protection, that's not built.
- **Images aren't optimized.** They're reasonably sized but not run
  through modern compression/responsive `srcset` handling.
- **No build tooling, no framework.** This is one flat HTML file. If you
  want a real project structure (e.g. a static site generator, or a
  framework like Astro/Next), Claude Code will need to scaffold that
  and migrate this markup into it.

## Suggested first prompt for Claude Code
Something like:

> This is a static HTML export of a client-approved design mockup for a
> "Mathetes" course homepage. Set it up as a proper deployable static
> site (I'd like to deploy to [Vercel/Netlify/GitHub Pages]), make it
> responsive down to mobile, extract the inline styles into a
> stylesheet, and wire up the nav links to in-page anchors. Leave the
> visual design as-is unless something is actually broken.

From there you can keep iterating with Claude Code on things like the
video embeds, the contact form, and real Impressum/Datenschutz text.
