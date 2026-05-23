import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const EVENT_DATE = new Date('2026-06-18T23:00:00Z')
const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID'
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const HERO_IMAGE =
  'https://github.com/user-attachments/assets/f0a131a0-6afb-474b-9b4e-dfa1f0dccec5'

const NAV_LINKS = [
  { href: '#lineup', label: 'Lineup' },
  { href: '#tiers', label: 'Tiers' },
  { href: '#faq', label: 'FAQ' },
]

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

// Build a calendar invite for first pitch so attendees can hold the date.
function buildIcsDataUrl() {
  const dt = (d) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const start = EVENT_DATE
  const end = new Date(EVENT_DATE.getTime() + 4 * 60 * 60 * 1000)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GitHub Night at the Braves//EN',
    'BEGIN:VEVENT',
    `UID:github-night-braves-2026@githubbraves`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    'SUMMARY:GitHub Night @ The Braves',
    'LOCATION:Truist Park, 755 Battery Ave SE, Atlanta, GA 30339',
    'DESCRIPTION:GitHub product spotlight, customer networking, and Braves baseball under the lights.',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      node.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}

function App() {
  const [now, setNow] = useState(new Date())
  const [formStatus, setFormStatus] = useState('idle')
  const [formMessage, setFormMessage] = useState('')
  const [navCondensed, setNavCondensed] = useState(false)
  const icsHref = useMemo(() => buildIcsDataUrl(), [])

  const countdown = useMemo(() => getCountdown(now), [now])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => setNavCondensed(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      setFormStatus('error')
      setFormMessage(
        'Set the VITE_FORMSPREE_ENDPOINT environment variable with your live Formspree form URL before launch.',
      )
      return
    }

    setFormStatus('submitting')
    setFormMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      form.reset()
      setFormStatus('success')
      setFormMessage('')
    } catch {
      setFormStatus('error')
      setFormMessage('We could not submit your registration. Please try again in a minute.')
    }
  }

  return (
    <>
      <a className="skip-link" href="#signup">
        Skip to registration
      </a>

      <nav className={`site-nav${navCondensed ? ' condensed' : ''}`} aria-label="Primary">
        <div className="site-nav-inner">
          <a href="#top" className="site-nav-brand" aria-label="GitHub Night at the Braves home">
            <GitHubMark className="site-nav-mark" />
            <span>
              GitHub <span className="site-nav-at">@</span> Braves
            </span>
          </a>
          <ul className="site-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a href="#signup" className="site-nav-cta">
            Register
          </a>
        </div>
      </nav>

      <main id="top">
        <header className="hero" aria-label="GitHub Night at the Braves header">
          <picture className="hero-photo" aria-hidden="true">
            <img
              src={HERO_IMAGE}
              alt=""
              fetchpriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
          <div className="hero-overlay" aria-hidden="true"></div>

          <div className="hero-inner">
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
              <h1>
                GitHub Night
                <span className="hero-title-accent"> @ The Braves</span>
              </h1>
              <p className="hero-copy">
                Spend a night with the GitHub team — a live look at Copilot and the GitHub
                platform, a customer community session with peers building on it, and
                Braves baseball under the lights to close it out.
              </p>
              <div className="hero-actions">
                <a href="#signup" className="cta">
                  <DiamondIcon />
                  <span>Register Now</span>
                </a>
                <a href={icsHref} download="github-night-braves.ics" className="cta cta-ghost">
                  Add to Calendar
                </a>
              </div>
            </div>

            <aside className="hero-scoreboard" aria-label="Countdown to first pitch">
              <p className="scoreboard-label">First Pitch In</p>
              <div className="countdown">
                {Object.entries(countdown).map(([unit, value]) => (
                  <div key={unit} className="countdown-tile">
                    <span className="digits">{value}</span>
                    <small>{COUNTDOWN_LABELS[unit]}</small>
                  </div>
                ))}
              </div>
              <p className="hero-photo-credit">
                Truist Park, Atlanta · June 18, 2026 · Braves vs. Giants
              </p>
            </aside>
          </div>
        </header>

        <section className="stat-strip" aria-label="Event details">
          <span><strong>Hosted by</strong> GitHub</span>
          <span aria-hidden="true" className="stat-dot">·</span>
          <span><strong>Venue</strong> Truist Park</span>
          <span aria-hidden="true" className="stat-dot">·</span>
          <span><strong>Date</strong> June 18, 2026</span>
          <span aria-hidden="true" className="stat-dot">·</span>
          <span><strong>Game</strong> Braves vs. Giants</span>
        </section>

        <Reveal id="tiers" className="tiers" aria-labelledby="seat-tiers-heading">
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
        </Reveal>

        <Reveal id="lineup" className="schedule" aria-labelledby="schedule-heading">
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
        </Reveal>

        <Reveal id="signup" className="signup" aria-labelledby="signup-heading">
          <div className="signup-copy">
            <h2 id="signup-heading">Reserve Your Seat</h2>
            <p>Here&apos;s what to expect from the evening.</p>
            <ul className="expect-list">
              <li>A live GitHub product spotlight — Copilot, Actions, and what&apos;s next on the platform.</li>
              <li>A customer community session to connect with peers building on GitHub.</li>
              <li>Premium seating at Truist Park with a curated pregame experience.</li>
              <li>Light fare and drinks during the networking hour.</li>
            </ul>
            <p className="signup-privacy">
              We only collect what we need to badge you in and reach you on game day.
              Registrations are processed by a secure external form provider — never stored
              in this repository.
            </p>
          </div>

          {formStatus === 'success' ? (
            <div className="signup-success" role="status" aria-live="polite">
              <div className="signup-success-badge" aria-hidden="true">⚾</div>
              <h3>You&apos;re on the list.</h3>
              <p>
                Watch for a confirmation email from the GitHub event team. We&apos;ll send
                game-day details, parking tips, and your check-in info as June 18 gets closer.
              </p>
              <div className="signup-success-actions">
                <a href={icsHref} download="github-night-braves.ics" className="cta">
                  Add to Calendar
                </a>
                <button
                  type="button"
                  className="cta cta-ghost"
                  onClick={() => {
                    setFormStatus('idle')
                    setFormMessage('')
                  }}
                >
                  Register another guest
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form" noValidate>
              <input
                type="hidden"
                name="_subject"
                value="GitHub Night @ The Braves registration"
              />
              <label className="trap" htmlFor="company-site">
                Company Site
                <input
                  id="company-site"
                  name="_gotcha"
                  type="text"
                  tabIndex="-1"
                  autoComplete="off"
                />
              </label>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="first_name">First name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="last_name">Last name</label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">Work email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Mobile phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
                <p className="field-hint">Game-day contact only — used if plans shift.</p>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="job_title">Job title <span className="optional">(optional)</span></label>
                  <input
                    id="job_title"
                    name="job_title"
                    type="text"
                    autoComplete="organization-title"
                  />
                </div>
                <div className="field">
                  <label htmlFor="party_size">Party size <span className="optional">(optional)</span></label>
                  <input
                    id="party_size"
                    name="party_size"
                    type="number"
                    min="1"
                    max="4"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="notes">
                  Anything we should know? <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  placeholder="Dietary needs, accessibility requests, or a quick hello."
                ></textarea>
              </div>

              <label className="consent" htmlFor="consent">
                <input id="consent" name="consent" type="checkbox" required />
                <span>
                  I agree to GitHub contacting me about this event and processing my
                  registration details.
                </span>
              </label>

              <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark"></div>

              <button type="submit" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Submitting…' : 'Complete Registration'}
              </button>

              {formMessage && (
                <p className={`status ${formStatus === 'error' ? 'error' : ''}`}>{formMessage}</p>
              )}
            </form>
          )}
        </Reveal>

        <Reveal id="faq" className="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Game-Day FAQ</h2>
          <div className="faq-list">
            {FAQS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </Reveal>

        <footer>
          <p>
            GitHub and the GitHub logo are trademarks of GitHub, Inc. Atlanta Braves marks
            are property of Braves Holdings, LLC and require proper licensing permission
            for production use.
          </p>
          <p>
            Registration is processed by an external secure form backend over HTTPS, with
            Cloudflare Turnstile bot defense. Customer data is stored outside this GitHub
            Pages repository — review your provider privacy terms before launch.
          </p>
        </footer>
      </main>
    </>
  )
}

export default App
