# GitHub Braves Event Microsite

Static React/Vite microsite for **GitHub Night @ The Braves** — June 18, 2026 at Truist Park. Published to GitHub Pages, with registrations handled by a secure external backend so no attendee data is ever stored in this public repo.

## What the site includes

- Photo-led hero with the Truist Park "Welcomes GitHub" jumbotron shot, frosted countdown panel, and "Add to Calendar" download
- Sticky top navigation with persistent **Register** CTA
- Ticket tiers, game-day lineup, and FAQ accordion
- Slim registration form (5 required fields + 3 optional) with success state and `.ics` invite
- Cloudflare Turnstile slot + Formspree-compatible honeypot for bot defense
- Open Graph / Twitter card meta + theme color for link previews

## Registration data flow — Lisa-only, public-repo-safe

This repo is public. **No customer data is ever written to it.** The form POSTs over HTTPS to an external endpoint Lisa owns; access to submissions is gated by her login on that provider.

Recommended backend: **Formspree** (already wired in).

### One-time Formspree setup (Lisa)

1. Sign up at <https://formspree.io/> with the email that should receive submissions.
2. Create a new form (any name — e.g. `github-night-braves`).
3. Set the **notification email** to Lisa's address. Add no other recipients — Lisa is the sole owner of the form and the only person who can read submissions or invite others.
4. Enable spam protection and (recommended) Cloudflare Turnstile integration. Paste the Turnstile **secret key** in Formspree — it never appears in this repo.
5. Copy the form's POST URL (looks like `https://formspree.io/f/abcd1234`).
6. In GitHub → **Settings → Secrets and variables → Actions**, add two repository secrets:
   - `VITE_FORMSPREE_ENDPOINT` — the Formspree URL from step 5
   - `VITE_TURNSTILE_SITE_KEY` — the Turnstile **site** key (public; not the secret key)
7. Re-run the Pages deploy workflow. The endpoint is injected at build time only; the repo source never contains it.

### Why this keeps it "Lisa-only"

- Anyone can POST to the Formspree URL (that's how the form works), but only Lisa's login can **read** submissions or export the CSV.
- The Turnstile site key is public by design; the matching secret key lives in Formspree, never in the repo.
- Bot/spam noise is filtered by Turnstile + the hidden `_gotcha` honeypot field.

### Upgrade paths (if volume or compliance grows)

- **Google Forms / Microsoft Forms** backing this same UI — responses land in a Sheet/Excel file in Lisa's own Drive/OneDrive.
- **Cloudflare Worker + Turnstile + Resend/MailChannels + D1** for a fully owned endpoint with email delivery and a private database.

## Registration fields collected

Required: First name · Last name · Company · Work email · Mobile phone
Optional: Job title · Party size (1–4) · "Anything we should know?" (dietary / accessibility / notes)
Plus a required consent checkbox for event communications.

Helper text on the phone field calls out that it's for game-day contact only.

## Local development

```bash
npm install
cp .env.example .env   # fill in your dev Formspree + Turnstile keys
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## GitHub Pages deployment

Vite is configured with `base: '/GitHubBraves/'` for this repository. The workflow in `.github/workflows/deploy.yml` builds with the two `VITE_*` secrets above and publishes `dist/` to Pages.

## Production setup checklist

1. Set `VITE_FORMSPREE_ENDPOINT` and `VITE_TURNSTILE_SITE_KEY` as repo secrets (see above)
2. Confirm the Formspree form notifies only Lisa's address
3. Confirm Turnstile is enabled on the Formspree form and is rejecting bot traffic
4. Verify logo / photo licensing approval for Atlanta Braves and Truist Park assets before public release
5. Smoke-test the end-to-end registration on the deployed Pages URL
