import { useState } from 'react'
import './App.css'
import heroImg from './assets/hero.png'

const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID'
const DEFAULT_TURNSTILE_SITE_KEY = import.meta.env.PROD ? '' : '1x00000000000000000000AA'
const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY || DEFAULT_TURNSTILE_SITE_KEY).trim()
const HIDE_TURNSTILE_IN_PROD = import.meta.env.VITE_HIDE_TURNSTILE_IN_PROD !== 'false'
const SHOW_TURNSTILE = Boolean(TURNSTILE_SITE_KEY) && !(import.meta.env.PROD && HIDE_TURNSTILE_IN_PROD)

const LINEUP = [
  { inning: '1st', time: '5:30 PM', title: 'Park' },
  { inning: '2nd', time: '5:45 PM', title: 'Meet up at The Battery (spot TBD)' },
  { inning: '3rd', time: '6:00 PM', title: 'GitHub Greeting' },
  { inning: '4th', time: '6:15 PM', title: 'Customer Networking' },
  { inning: '5th', time: '7:15 PM', title: 'First Pitch' },
]

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


function StitchDivider() {
  return <div className="stitch-divider" aria-hidden="true" />
}

function App() {
  const [formStatus, setFormStatus] = useState('idle')
  const [formMessage, setFormMessage] = useState('')

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
      <header className="hero" aria-label="GitHub Day at Truist Park header">
        <img
          className="hero-bg-img"
          src={heroImg}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-stitch" aria-hidden="true" />

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
          <h1>GitHub Day at Truist Park</h1>
          <p className="hero-copy">
            An invite-only customer event focused on AI-assisted development, platform engineering, and secure software delivery.
          </p>
          <a href="#signup" className="cta">
            <DiamondIcon />
            <span>Request Invitation</span>
          </a>
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

      <StitchDivider />

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

          <label htmlFor="dietary">Dietary requests (optional)</label>
          <textarea id="dietary" name="dietary" rows="2"></textarea>

          <label htmlFor="accessibility">Accessibility needs (optional)</label>
          <textarea id="accessibility" name="accessibility" rows="2"></textarea>

          <label className="consent" htmlFor="consent">
            <input id="consent" name="consent" type="checkbox" required />
            I agree to event registration processing and follow-up confirmation email.
          </label>

          {SHOW_TURNSTILE && (
            <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark"></div>
          )}

          <button type="submit" disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Submitting...' : 'Complete Registration'}
          </button>

          {formMessage && (
            <p className={formStatus === 'success' ? 'status success' : 'status error'}>{formMessage}</p>
          )}
        </form>
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
