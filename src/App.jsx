import { useEffect, useMemo, useState } from 'react'
import './App.css'

const EVENT_DATE = new Date('2026-09-18T23:00:00Z')
const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID'
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

const TIERS = [
  {
    name: 'Dugout Select',
    seats: 'Front Row Club Access',
    details: 'Executive networking lounge, private check-in, and premium game seating.',
  },
  {
    name: 'Bullpen Social',
    seats: 'Terrace Networking Deck',
    details: 'Collaborative stadium tour, team demos, and social deck access through first pitch.',
  },
  {
    name: 'Grandstand Crew',
    seats: 'Classic Braves View',
    details: 'Main event seating with complete pregame programming and giveaway bundle.',
  },
]

const LINEUP = [
  { inning: '1st', time: '4:30 PM', title: 'Arrival + Ballpark Entry' },
  { inning: '2nd', time: '5:00 PM', title: 'GitHub Product Spotlight' },
  { inning: '3rd', time: '5:40 PM', title: 'Customer Networking Session' },
  { inning: '4th', time: '6:30 PM', title: 'Braves First Pitch Experience' },
]

const FAQS = [
  {
    q: 'Where do I park?',
    a: 'Truist Park has multiple lots with prepaid options through MLB Ballpark. The Red Deck offers the closest access from the stadium entrance gates; allow extra time on weeknight games.',
  },
  {
    q: 'Is there a dress code?',
    a: 'Smart casual. The pregame programming is indoors and climate controlled, the game itself is open-air — a light layer for evening innings is a safe call.',
  },
  {
    q: 'Can I transfer my registration?',
    a: 'Yes. Email the event team with the original registrant and the new attendee details at least 48 hours before first pitch so we can update the badge list.',
  },
  {
    q: 'What is the rain policy?',
    a: 'Truist Park follows MLB weather protocol. The GitHub pregame programming runs rain or shine; the game itself follows the Braves announcement. We will email registrants if anything shifts.',
  },
]

function getCountdown(now) {
  const distance = EVENT_DATE.getTime() - now.getTime()

  if (distance <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((distance / (1000 * 60)) % 60)
  const seconds = Math.floor((distance / 1000) % 60)

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

const COUNTDOWN_LABELS = {
  days: 'Days',
  hours: 'Hrs',
  minutes: 'Min',
  seconds: 'Sec',
}

function GitHubMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 98 96" role="img" aria-label="GitHub logo">
      <path
        fill="currentColor"
        d="M49 0C21.9 0 0 22.4 0 50c0 22.1 14.3 40.8 34.1 47.4 2.5.5 3.4-1.1 3.4-2.4 0-1.2-.1-5.2-.1-9.4-13.9 3.1-16.8-6-16.8-6-2.3-5.9-5.6-7.5-5.6-7.5-4.6-3.2.3-3.1.3-3.1 5.1.4 7.8 5.3 7.8 5.3 4.5 7.9 11.8 5.6 14.7 4.3.5-3.3 1.8-5.6 3.2-6.9-11.1-1.3-22.8-5.7-22.8-25.4 0-5.6 2-10.2 5.2-13.8-.5-1.3-2.2-6.5.5-13.5 0 0 4.3-1.4 14 5.3a47.8 47.8 0 0 1 25.4 0c9.7-6.8 14-5.3 14-5.3 2.8 7 1 12.2.5 13.5 3.2 3.6 5.2 8.2 5.2 13.8 0 19.8-11.7 24.1-22.9 25.3 1.8 1.6 3.4 4.6 3.4 9.3 0 6.7-.1 12.1-.1 13.7 0 1.3.9 2.9 3.4 2.4C83.7 90.8 98 72.1 98 50 98 22.4 76.1 0 49 0Z"
      />
    </svg>
  )
}

function DiamondIcon() {
  return (
    <svg
      className="diamond-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3 21 12l-9 9-9-9 9-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  )
}

function HeroIllustration() {
  // Stylized ballpark + baseball-with-Octocat-seam motif. Inline, lightweight, recolorable.
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 320 260"
      role="img"
      aria-label="Stylized ballpark skyline with a baseball"
    >
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#13274F" />
          <stop offset="100%" stopColor="#0d1117" />
        </linearGradient>
        <radialGradient id="moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f6f8fa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f6f8fa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky panel */}
      <rect x="0" y="0" width="320" height="200" rx="14" fill="url(#sky)" />
      {/* stadium light glow */}
      <circle cx="250" cy="60" r="55" fill="url(#moon)" />

      {/* stadium silhouette */}
      <path
        d="M0 200 L0 160 Q30 120 60 150 L80 130 Q110 100 140 130 L160 110 Q190 90 220 115 L240 130 Q270 110 300 140 L320 160 L320 200 Z"
        fill="#161b22"
        stroke="#30363d"
        strokeWidth="1"
      />
      {/* light poles */}
      <g stroke="#8b949e" strokeWidth="1.2">
        <line x1="60" y1="150" x2="60" y2="125" />
        <line x1="160" y1="110" x2="160" y2="80" />
        <line x1="260" y1="120" x2="260" y2="90" />
      </g>
      <g fill="#ffd866">
        <rect x="52" y="118" width="16" height="8" rx="1.5" />
        <rect x="152" y="73" width="16" height="8" rx="1.5" />
        <rect x="252" y="83" width="16" height="8" rx="1.5" />
      </g>

      {/* foreground baseball with Octocat-style seam */}
      <g transform="translate(160 210)">
        <circle r="44" fill="#f6f8fa" stroke="#30363d" strokeWidth="1.5" />
        {/* red stitching seams */}
        <path
          d="M-32 -20 Q0 -4 32 -20"
          fill="none"
          stroke="#CE1141"
          strokeWidth="2"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <path
          d="M-32 20 Q0 4 32 20"
          fill="none"
          stroke="#CE1141"
          strokeWidth="2"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

function StitchDivider() {
  return <div className="stitch-divider" aria-hidden="true" />
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        <span className="faq-toggle" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  )
}

function App() {
  const [now, setNow] = useState(new Date())
  const [formStatus, setFormStatus] = useState('idle')
  const [formMessage, setFormMessage] = useState('')

  const countdown = useMemo(() => getCountdown(now), [now])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      setFormStatus('error')
      setFormMessage('Set the VITE_FORMSPREE_ENDPOINT environment variable with your live Formspree form URL before launch.')
      return
    }

    setFormStatus('submitting')
    setFormMessage('')

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      event.currentTarget.reset()
      setFormStatus('success')
      setFormMessage('You are on the list. Watch for a confirmation email from the event team.')
    } catch {
      setFormStatus('error')
      setFormMessage('We could not submit your registration. Please try again in a minute.')
    }
  }

  return (
    <main>
      <header className="hero" aria-label="GitHub Night at the Braves header">
        <div className="hero-vignette" aria-hidden="true"></div>
        <div className="hero-stitch" aria-hidden="true"></div>

        <div className="hero-grid">
          <div className="hero-content">
            <div className="brand-row" aria-label="GitHub at Atlanta Braves">
              <GitHubMark className="github-logo" />
              <span className="brand-at" aria-hidden="true">at</span>
              <img
                className="braves-logo"
                src="https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg"
                alt="Atlanta Braves logo"
              />
            </div>
            <p className="eyebrow">An evening with GitHub at Truist Park</p>
            <h1>GitHub Night @ The Braves</h1>
            <p className="hero-copy">
              Spend a night with the GitHub team — a live look at Copilot and the GitHub
              platform, a customer community session with peers building on it, and
              Braves baseball under the lights to close it out.
            </p>
            <a href="#signup" className="cta">
              <DiamondIcon />
              <span>Register Now</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <HeroIllustration />
          </div>
        </div>
      </header>

      <section className="stat-strip" aria-label="Event details">
        <span><strong>Hosted by</strong> GitHub</span>
        <span aria-hidden="true" className="stat-dot">·</span>
        <span><strong>Venue</strong> Truist Park</span>
        <span aria-hidden="true" className="stat-dot">·</span>
        <span><strong>Date</strong> Sept 18, 2026</span>
      </section>

      <section className="scoreboard" aria-label="Countdown to first pitch">
        <p className="scoreboard-label">First Pitch In</p>
        <div className="countdown">
          {Object.entries(countdown).map(([unit, value]) => (
            <article key={unit} className="countdown-tile">
              <span className="digits">{value}</span>
              <small>{COUNTDOWN_LABELS[unit]}</small>
            </article>
          ))}
        </div>
      </section>

      <StitchDivider />

      <section className="tiers" aria-labelledby="seat-tiers-heading">
        <h2 id="seat-tiers-heading">Ticket Tiers</h2>
        <div className="tier-grid">
          {TIERS.map((tier) => (
            <article key={tier.name} className="tier-card">
              <p className="ticket-stub-label">Admit One</p>
              <h3>{tier.name}</h3>
              <p className="tier-subtitle">{tier.seats}</p>
              <p className="tier-details">{tier.details}</p>
              <div className="ticket-perf" aria-hidden="true"></div>
            </article>
          ))}
        </div>
      </section>

      <section className="schedule" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Tonight&apos;s Lineup</h2>
        <ol className="lineup-list">
          {LINEUP.map((item) => (
            <li key={item.inning} className="lineup-row">
              <span className="inning" aria-label={`${item.inning} inning`}>{item.inning}</span>
              <span className="lineup-time">{item.time}</span>
              <span className="lineup-title">{item.title}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="signup" className="signup" aria-labelledby="signup-heading">
        <div className="signup-copy">
          <h2 id="signup-heading">Reserve Your Seat</h2>
          <p>Here&apos;s what to expect from the evening.</p>
          <ul className="expect-list">
            <li>A live GitHub product spotlight — Copilot, Actions, and what&apos;s next on the platform.</li>
            <li>A customer community session to connect with peers building on GitHub.</li>
            <li>Premium seating at Truist Park with a curated pregame experience.</li>
            <li>Light fare and drinks during the networking hour.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          <input type="hidden" name="_subject" value="GitHub Night @ The Braves registration" />
          <label className="trap" htmlFor="company-site">
            Company Site
            <input id="company-site" name="_gotcha" type="text" tabIndex="-1" autoComplete="off" />
          </label>

          <label htmlFor="full_name">Full name</label>
          <input id="full_name" name="full_name" type="text" required />

          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" required />

          <label htmlFor="organization">Organization (optional)</label>
          <input id="organization" name="organization" type="text" />

          <label htmlFor="attendees">Attendee count (optional)</label>
          <input id="attendees" name="attendees" type="number" min="1" max="8" placeholder="1" />

          <label htmlFor="dietary">Dietary requests (optional)</label>
          <textarea id="dietary" name="dietary" rows="2"></textarea>

          <label htmlFor="accessibility">Accessibility needs (optional)</label>
          <textarea id="accessibility" name="accessibility" rows="2"></textarea>

          <label className="consent" htmlFor="consent">
            <input id="consent" name="consent" type="checkbox" required />
            I agree to event registration processing and follow-up confirmation email.
          </label>

          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark"></div>

          <button type="submit" disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Submitting...' : 'Complete Registration'}
          </button>

          {formMessage && (
            <p className={formStatus === 'success' ? 'status success' : 'status error'}>{formMessage}</p>
          )}
        </form>
      </section>

      <section className="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Game-Day FAQ</h2>
        <div className="faq-list">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <footer>
        <p>
          GitHub and the GitHub logo are trademarks of GitHub, Inc. Atlanta Braves marks
          are property of Braves Holdings, LLC and require proper licensing permission
          for production use.
        </p>
        <p>
          Registration is processed by an external Formspree backend over HTTPS, with
          Cloudflare Turnstile bot defense. Customer data is stored outside this GitHub
          Pages repository — review your provider privacy terms before launch.
        </p>
      </footer>
    </main>
  )
}

export default App
