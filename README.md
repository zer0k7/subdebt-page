# SubDebt Manager — Website

Static marketing and legal site for **SubDebt Manager**, a privacy-first,
offline personal finance app for Android by [Zer0k7 Lab](https://zer0k7lab.tech).

Live site: **https://subdebt.zer0k7lab.tech**

## Stack

Plain HTML, CSS and a single deferred JavaScript file. No build step, no
framework, no third-party requests. Fonts are self-hosted WOFF2 and screenshots
are served as WebP with explicit dimensions.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Marketing page: features, privacy model, tools, snapshots, install, FAQ |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Service |
| `support.html` | Support and FAQ |
| `data-deletion.html` | Google Play data deletion guide |

The four legal URLs are stable. Their body copy is intentionally preserved
verbatim; layout and styling may change, wording should not. The policy version
line (`Version 2.14.1`, effective October 2, 2026) is plain text and should only
change when the policy itself changes.

## Local preview

```powershell
python -m http.server 8123 --bind 127.0.0.1
```

Open <http://127.0.0.1:8123/>. A server is required for the manifest and font
preloads; opening `index.html` from disk still renders the page.

## Deployment

The site is published with GitHub Pages from the repository root.

1. Push to the default branch.
2. In **Settings → Pages**, set the source to the branch root.
3. Keep `CNAME` set to `subdebt.zer0k7lab.tech`.
4. Point a `CNAME` DNS record for `subdebt` at `zer0k7.github.io`.
5. Enable **Enforce HTTPS** once the certificate is issued.

## Version updates

The displayed app version comes from one constant in `script.js`:

```js
const APP = Object.freeze({
  version: "2.18.0",
  ...
});
```

It fills every `[data-app-version]` element. When releasing:

1. Update `version` in `script.js`.
2. Update `softwareVersion` in the `SoftwareApplication` JSON-LD block in
   `index.html` (structured data must be static).
3. Update the release link only if it is not already `/releases/latest`.
4. Refresh the screenshots in `assets/screens/` if the UI changed.

## Assets

```
assets/
  fonts/    Inter Tight + JetBrains Mono (Latin subset, WOFF2)
  img/      OG image, app icons, Play badge
  screens/  Dashboard, subscriptions, spending (WebP)
icon.png    Source app icon, also the favicon
```

Required image sizes:

- `assets/img/og.png` — 1200 × 630 social card
- `assets/img/apple-touch-icon.png` — 180 × 180
- `assets/img/icon-192.png` — 192 × 192
- `assets/img/icon-512.png` — 512 × 512
- `icon.png` — 1024 × 1024 source

Screenshots must not show stale version numbers, disabled beta features, or
personal data. The current set is light-theme; the app also ships a dark theme.

## Content rules

- Only state verified product behaviour. No invented testimonials, ratings,
  download counts, awards, or customer logos.
- No emoji, no hype, no "AI-powered" language.
- Keep the primary call to action pointed at Google Play:
  `https://play.google.com/store/apps/details?id=com.subdebt.app`
- Alternate install routes (GitHub Releases APK and Obtainium) are plain links;
  there is no fetch-and-blob download hack.

## SEO and accessibility

- Unique title, description, canonical, Open Graph and Twitter tags per page.
- `SoftwareApplication` and `FAQPage` JSON-LD on the home page.
- `robots.txt`, `sitemap.xml` and `site.webmanifest` at the root.
- Skip link, visible focus rings, `prefers-reduced-motion` support, and
  system-aware dark/light themes with a remembered preference.
- Target: Lighthouse 95+ across categories, LCP under 1.5 s on a warm cache.

## License

Site code is part of the SubDebt Manager project and is MIT licensed. The
SubDebt name, logo and screenshots remain the property of Zer0k7 Lab.
