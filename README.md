# nullmpeg.xyz (website v1)

Intentionally low-effort **Y2K-style** landing page for **null**.

## Current spec

- Black background
- White text (with some zalgo corruption)
- Classic hyperlink list (no fancy buttons)
- Occasional scrolling zalgo noise overlay
- Email capture is **placeholder** (stored to `localStorage`)
- Optional Twitch embed

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Monitoring (Sentry)

This project now sends runtime errors to Sentry when `VITE_SENTRY_DSN` is set.

1. Copy `.env.example` to `.env.local`
2. Fill in:
   - `VITE_SENTRY_DSN`
   - `VITE_APP_ENV` (e.g. `production`, `preview`, `development`)
   - `VITE_APP_RELEASE` (e.g. Vercel commit SHA)
3. Restart `npm run dev`

Quick local test (after setting DSN):
- Open the site
- In DevTools console run: `setTimeout(() => { throw new Error('sentry smoke test') }, 0)`
- Confirm event appears in Sentry Issues

## Links

- IG: https://www.instagram.com/null.mpeg/
- YouTube: https://www.youtube.com/@Null_mpeg/shorts
- Twitch: https://www.twitch.tv/null_mpeg

(Spotify/SoundCloud/Bandcamp/Discord still TBD.)
