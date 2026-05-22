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

const SCHEDULE = [
  { time: '4:30 PM', title: 'Arrival + Ballpark Entry' },
  { time: '5:00 PM', title: 'GitHub Product Spotlight' },
  { time: '5:40 PM', title: 'Customer Networking Session' },
  { time: '6:30 PM', title: 'Braves First Pitch Experience' },
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
      <header className="hero" aria-label="GitHub and Atlanta Braves event header">
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="brand-row">
          <img
            className="braves-logo"
            src="https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg"
            alt="Atlanta Braves logo"
          />
          <span className="plus">×</span>
          <svg className="github-logo" viewBox="0 0 98 96" role="img" aria-label="GitHub logo">
            <path
              fill="currentColor"
              d="M49 0C21.9 0 0 22.4 0 50c0 22.1 14.3 40.8 34.1 47.4 2.5.5 3.4-1.1 3.4-2.4 0-1.2-.1-5.2-.1-9.4-13.9 3.1-16.8-6-16.8-6-2.3-5.9-5.6-7.5-5.6-7.5-4.6-3.2.3-3.1.3-3.1 5.1.4 7.8 5.3 7.8 5.3 4.5 7.9 11.8 5.6 14.7 4.3.5-3.3 1.8-5.6 3.2-6.9-11.1-1.3-22.8-5.7-22.8-25.4 0-5.6 2-10.2 5.2-13.8-.5-1.3-2.2-6.5.5-13.5 0 0 4.3-1.4 14 5.3a47.8 47.8 0 0 1 25.4 0c9.7-6.8 14-5.3 14-5.3 2.8 7 1 12.2.5 13.5 3.2 3.6 5.2 8.2 5.2 13.8 0 19.8-11.7 24.1-22.9 25.3 1.8 1.6 3.4 4.6 3.4 9.3 0 6.7-.1 12.1-.1 13.7 0 1.3.9 2.9 3.4 2.4C83.7 90.8 98 72.1 98 50 98 22.4 76.1 0 49 0Z"
            />
          </svg>
        </div>
        <p className="eyebrow">GitHub Customer Event at Truist Park</p>
        <h1>Secure Your Spot for Braves Game Night</h1>
        <p className="hero-copy">
          An immersive pregame session with live product demos, customer networking, and Atlanta Braves baseball under the lights.
        </p>
        <a href="#signup" className="cta">
          Register Now
        </a>
      </header>

      <section className="countdown" aria-label="Countdown to event">
        {Object.entries(countdown).map(([unit, value]) => (
          <article key={unit} className="countdown-tile">
            <span>{value}</span>
            <small>{unit}</small>
          </article>
        ))}
      </section>

      <section className="tiers" aria-labelledby="seat-tiers-heading">
        <h2 id="seat-tiers-heading">Seat Tier Experience</h2>
        <div className="tier-grid">
          {TIERS.map((tier) => (
            <article key={tier.name} className="tier-card">
              <h3>{tier.name}</h3>
              <p className="tier-subtitle">{tier.seats}</p>
              <p>{tier.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="schedule" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Event Timeline</h2>
        <div className="schedule-grid">
          {SCHEDULE.map((item) => (
            <article key={item.time} className="schedule-card">
              <p className="time">{item.time}</p>
              <p>{item.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="signup" className="signup" aria-labelledby="signup-heading">
        <div className="signup-copy">
          <h2 id="signup-heading">Secure Registration</h2>
          <p>
            This form routes submissions to a protected external backend. Validation, bot defense, and rate limiting are enforced server-side.
          </p>
          <ul>
            <li>External Formspree endpoint over HTTPS</li>
            <li>Cloudflare Turnstile challenge support</li>
            <li>Customer data stored outside this GitHub Pages repository</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          <input type="hidden" name="_subject" value="Braves + GitHub registration" />
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

      <footer>
        <p>
          GitHub and the GitHub logo are trademarks of GitHub, Inc. Atlanta Braves marks are property of Braves Holdings, LLC and require proper licensing permission for production use.
        </p>
        <p>
          Registration data is processed through your configured external provider. Review your provider privacy terms before launch.
        </p>
      </footer>
    </main>
  )
}

export default App
