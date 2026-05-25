# Security Review — 2026-05-25

Scope: commits `2bd8a97..3f2d965` on `main` (replaced Formspree + Cloudflare
Turnstile with a Google Forms backend, added client-side field validation,
wired the honeypot, added `public/CNAME` for `ghbraves.bensbar.com`, and
repositioned the brand row).

Reviewer: GitHub Copilot CLI (security-review agent).

## Result

**No high-confidence security vulnerabilities found.**

## Verification notes

| Area | Why it is not a finding |
|------|------------------------|
| Google Form URL and `entry.*` IDs hardcoded in `src/App.jsx` | Public by design for any web-embedded Google Form. Not a secret; no `HardcodedCredentials`. |
| `fetch(GOOGLE_FORM_RESPONSE_URL, { mode: 'no-cors' })` | Fire-and-forget POST to a first-party-trusted HTTPS endpoint. Response is opaque and never read, so there is no injection sink. |
| Client-side honeypot only (`_gotcha` field) | Documented and accepted. Bots can POST directly to the Google Form endpoint; this is a spam / abuse concern, not an exploitable vulnerability. |
| Regex validation of email and phone | Used only for HTML5 `checkValidity()` UX gating. Values flow into multipart `FormData` to Google — no SQL, HTML, shell, or `eval` sink. |
| External `<img src="https://upload.wikimedia.org/...">` | Image element, not a script. No XSS vector; SRI is not applicable to images. |
| `.github/workflows/deploy.yml` exposes `VITE_GOOGLE_FORM_RESPONSE_URL` from `secrets.*` to the build | The value is baked into the public bundle at build time, but the value itself is a public form URL, so no real secret is exposed. |
| `.gitignore` | Correctly excludes `.apps-script-form/`, `.clasp.json`, and `.clasprc.json` (the local clasp OAuth tokens). Verified that none of those paths are tracked. |
| `.env.example` | Contains only the public form URL template. No live secrets. |
| `public/CNAME` | Static domain string. No security implication. |

## Out-of-scope reminders for operators

- **Form spam**: Google Forms does not provide a configurable CAPTCHA. The
  honeypot only protects submissions that go through the React form on
  `ghbraves.bensbar.com`. Direct POSTs to the Google Form `formResponse` URL
  bypass it. Mitigate with manual triage in the linked Sheet or by switching
  to a backend with first-class bot protection if abuse appears.
- **Subdomain takeover**: The CNAME points at `bensbar.github.io`. Keep the
  GitHub Pages site live for as long as the DNS record exists; remove the
  Cloudflare CNAME if Pages is ever decommissioned.
- **Cloudflare proxy**: The `ghbraves` CNAME is currently set to *DNS only*
  (grey cloud) so GitHub can verify the domain and issue Let’s Encrypt
  certificates. If you switch it back to *Proxied* (orange cloud), set the
  Cloudflare SSL/TLS mode to *Full* to avoid redirect loops.
