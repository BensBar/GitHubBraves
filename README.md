# GitHub Braves Event Microsite

Static React/Vite microsite designed for GitHub Pages with secure external registration handling.

## What this site includes

- Graphically intense landing page with Braves + GitHub branding
- Dynamic countdown, seat-tier cards, and timeline cards
- External secure registration flow (Formspree endpoint)
- Cloudflare Turnstile challenge integration point
- Legal trademark and privacy copy for launch readiness

## Secure architecture

This repository only serves static content on GitHub Pages.

- Form posts go to `VITE_FORMSPREE_ENDPOINT` (or another secure external endpoint)
- Bot checks are handled with Cloudflare Turnstile (`VITE_TURNSTILE_SITE_KEY`)
- Turnstile is hidden in production builds by default; set `VITE_HIDE_TURNSTILE_IN_PROD=false` to show it
- Server-side validation, rate limiting, and secure storage must be configured in the external backend
- No customer registration data is stored in this repository

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## GitHub Pages deployment

Vite is configured with `base: '/GitHubBraves/'` for this repository.

Build output is generated in `dist/` and can be published with a standard GitHub Pages workflow or Pages deployment action.

## Production setup checklist

1. Replace `VITE_FORMSPREE_ENDPOINT` with a live secure form endpoint
2. Replace `VITE_TURNSTILE_SITE_KEY` with your production Turnstile site key
3. Leave `VITE_HIDE_TURNSTILE_IN_PROD=true` (default) to keep Turnstile hidden in production, or set `VITE_HIDE_TURNSTILE_IN_PROD=false` to show it
4. Confirm external provider handles HTTPS, rate limiting, validation, and private data storage
5. Verify logo licensing approval for Atlanta Braves assets before public release
