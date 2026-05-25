# GitHub Braves Event Microsite

Static React/Vite microsite designed for GitHub Pages with a premium invitation flow.

## What this site includes

- Graphically intense landing page with Braves + GitHub branding
- Cinematic hero treatment and glassmorphism event cards
- Invitation CTA that routes to a Google Form
- Legal trademark and privacy copy for launch readiness

## Secure architecture

This repository only serves static content on GitHub Pages.

- CTA resolves to a Google Form `viewform` endpoint derived from `VITE_GOOGLE_FORM_RESPONSE_URL`
- Invitation requests land in Google Forms / linked Google Sheet owned by the event team
- Google handles HTTPS, abuse mitigation, and storage
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

1. Confirm `VITE_GOOGLE_FORM_RESPONSE_URL` matches the live Google Form `formResponse` URL
2. Ensure the Google Form is set to "Accepting responses" and not restricted to a single Google Workspace domain
3. Verify logo licensing approval for Atlanta Braves assets before public release
