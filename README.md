# GitHub Braves Event Microsite

Static React/Vite microsite designed for GitHub Pages with secure external registration handling.

## What this site includes

- Graphically intense landing page with Braves + GitHub branding
- Dynamic countdown, seat-tier cards, and timeline cards
- Registration flow that posts directly to a Google Form
- Legal trademark and privacy copy for launch readiness

## Secure architecture

This repository only serves static content on GitHub Pages.

- Form posts go to a Google Form `formResponse` endpoint via `VITE_GOOGLE_FORM_RESPONSE_URL`
- Submissions land in Google Forms / linked Google Sheet owned by the event team
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

1. Confirm `VITE_GOOGLE_FORM_RESPONSE_URL` (and the entry IDs in `src/App.jsx`) match the live Google Form
2. Ensure the Google Form is set to "Accepting responses" and not restricted to a single Google Workspace domain
3. Verify logo licensing approval for Atlanta Braves assets before public release
