# Cloudflare / Pages deployment notes

## Recommended setup

1. **GitHub Pages** from `/docs` on `main`, **or**
2. **Cloudflare Pages** project pointing at `docs/` (build command: none; output directory: `docs`).

## Domain

Optional custom domain via Cloudflare DNS → Pages/GitHub Pages.

## Headers

`docs/_headers` sets:

- `Content-Security-Policy` (self-only scripts/styles)
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy` (deny sensors / interest-cohort)

Works natively on **Cloudflare Pages**. For GitHub Pages, CSP may need meta tags (already minimal JS).

## Performance checklist

- [x] Static HTML/CSS/JS only (no runtime framework)
- [x] Inline-critical avoided; single small CSS
- [x] SVG favicon
- [x] No third-party analytics by default
- [x] `robots.txt` + `sitemap.xml`
- [x] JSON-LD: SoftwareApplication, FAQPage, HowTo, Organization
- [ ] After go-live: Lighthouse mobile ≥ 95 (expect high; fix any image weight if OG PNG added)
- [ ] Enable Brotli / Auto Minify in Cloudflare dashboard
- [ ] Optional: Polish for future raster assets only

## Privacy

Do **not** add Google Analytics. If metrics are required later, prefer privacy-friendly, cookieless options and document them in SECURITY.md / the landing page.
