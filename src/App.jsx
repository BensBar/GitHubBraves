import { useState } from 'react'
import './App.css'
import heroImg from './assets/TruistGitHub.png'
import heroImgMobile from './assets/TruistGitHub-mobile.png'

const GOOGLE_FORM_RESPONSE_URL =
  import.meta.env.VITE_GOOGLE_FORM_RESPONSE_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSeyiFqIKWUAkSRUCDdAFNOxhSs8qfuBQEyf7XK-UdsY8aMJsw/formResponse'

const GOOGLE_FORM_ENTRY_IDS = {
  first_name: 'entry.878299649',
  last_name: 'entry.1345233437',
  company: 'entry.2100624345',
  email: 'entry.2119109114',
  phone: 'entry.1859374818',
}

const REGISTRATION_OPEN = true

const LINEUP = [
  { inning: '1st', time: '5:30 PM', title: 'Park' },
  { inning: '2nd', time: '5:45 PM', title: 'Meet up at The Battery — details to follow' },
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

function StitchDivider() {
  return <div className="stitch-divider" aria-hidden="true" />
}

function App() {
  const [formOpen, setFormOpen] = useState(false)
  const [formStatus, setFormStatus] = useState('idle')
  const [formMessage, setFormMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const formData = new FormData(form)

    if (formData.has('_gotcha')) {
      // Honeypot tripped — silently pretend success so bots don't retry.
      form.reset()
      setFormStatus('success')
      setFormMessage('')
      return
    }

    setFormStatus('submitting')
    setFormMessage('')

    const payload = new FormData()
    for (const [field, entryId] of Object.entries(GOOGLE_FORM_ENTRY_IDS)) {
      payload.append(entryId, formData.get(field) ?? '')
    }

    try {
      await fetch(GOOGLE_FORM_RESPONSE_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      })

      form.reset()
      setFormStatus('success')
      setFormMessage('')
    } catch {
      setFormStatus('error')
      setFormMessage('We could not submit your registration. Please try again in a minute.')
    }
  }

  return (
    <main>
      <div className="brand-row brand-row-top" aria-label="GitHub at Atlanta Braves">
        <GitHubMark className="github-logo" />
        <span className="brand-at" aria-hidden="true">at</span>
        <img
          className="braves-logo"
          src="/assets/braves-logo.svg"
          alt="Atlanta Braves logo"
        />
      </div>

      <header className="hero" aria-label="GitHub Night at Truist Park header">
        <img
          className="hero-bg-img"
          src={heroImg}
          srcSet={`${heroImgMobile} 640w, ${heroImg} 1536w`}
          sizes="(max-width: 640px) 100vw, 1200px"
          alt=""
          aria-hidden="true"
          width="1536"
          height="1024"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-stitch" aria-hidden="true" />

        <div className="hero-content">
          <h1 className="visually-hidden">GitHub Night at Truist Park</h1>
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
        <h2 id="schedule-heading">What to Expect</h2>
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
        <h2 id="signup-heading">Reserve Your Seat</h2>

        {REGISTRATION_OPEN ? (
          formStatus === 'success' ? (
            <div className="status-card success" role="status" aria-live="polite">
              <h3>Thank you for registering.</h3>
              <p>We'll follow up directly. This form does not send an automatic confirmation email.</p>
            </div>
          ) : (
            <>
              {!formOpen && (
                <button className="request-access-btn" onClick={() => setFormOpen(true)}>
                  Request Access
                </button>
              )}
              {formOpen && (
                <form onSubmit={handleSubmit} className="signup-form" noValidate aria-busy={formStatus === 'submitting'}>
              <div className="trap" aria-hidden="true">
                <input id="bot-check" name="_gotcha" type="checkbox" tabIndex="-1" />
              </div>

              <label htmlFor="first_name">First Name</label>
              <input id="first_name" name="first_name" type="text" autoComplete="given-name" required />

              <label htmlFor="last_name">Last Name</label>
              <input id="last_name" name="last_name" type="text" autoComplete="family-name" required />

              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" autoComplete="organization" required />

              <label htmlFor="email">Work Email</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                title="Enter a valid email address, for example name@example.com"
                required
              />

              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="^[+]?[\s\-().]*([0-9][\s\-().]*){10,15}$"
                title="Enter a phone number with 10–15 digits. Spaces, dashes, parentheses, and a leading + are allowed."
                required
              />

              <button type="submit" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Submitting…' : 'Reserve Seat'}
              </button>

              {formMessage && <p className="status error">{formMessage}</p>}
            </form>
              )}
            </>
          )
        ) : (
          <div className="status-card" role="status" aria-live="polite">
            <p>Registration is currently closed. Contact your GitHub account team for assistance.</p>
          </div>
        )}
      </section>

      <footer>
        <p>GitHub and the GitHub logo are trademarks of GitHub, Inc.; Atlanta Braves marks are property of Braves Holdings, LLC.</p>
      </footer>
    </main>
  )
}

export default App
