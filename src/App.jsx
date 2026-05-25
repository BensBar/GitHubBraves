import './App.css'
import heroImg from './assets/TruistGitHub.png'
import heroImgMobile from './assets/TruistGitHub-mobile.png'

const REQUEST_ACCESS_URL =
  import.meta.env.VITE_GOOGLE_FORM_RESPONSE_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSeyiFqIKWUAkSRUCDdAFNOxhSs8qfuBQEyf7XK-UdsY8aMJsw/formResponse'

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

function App() {
  const requestAccessUrl = REQUEST_ACCESS_URL.replace('/formResponse', '/viewform')

  return (
    <main>
      <div className="brand-row brand-row-top" aria-label="GitHub and Atlanta Braves">
        <GitHubMark className="github-logo" />
        <span className="brand-lockup">GitHub × Braves</span>
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

        <div className="hero-content">
          <div className="hero-card">
            <p className="hero-kicker">June 18, 2026 · Truist Park</p>
            <h1>GitHub at Truist Park</h1>
            <p className="hero-copy">An exclusive Atlanta Braves night for enterprise customers and engineering leaders.</p>
          </div>
        </div>
      </header>

      <section className="event-headline" aria-label="Event focus">
        <h2>AI-Powered Development at Enterprise Scale</h2>
        <p>
          Join GitHub at Truist Park for an exclusive customer experience focused on Copilot, automation, and modern software delivery.
        </p>
      </section>

      <section className="metadata-grid" aria-label="Event details">
        <article className="metadata-card">
          <span className="metadata-label">Hosted By</span>
          <p>GitHub</p>
        </article>
        <article className="metadata-card">
          <span className="metadata-label">Venue</span>
          <p>Truist Park</p>
        </article>
        <article className="metadata-card">
          <span className="metadata-label">Date</span>
          <p>June 18, 2026</p>
        </article>
        <article className="metadata-card">
          <span className="metadata-label">Matchup</span>
          <p>Braves vs Giants</p>
        </article>
      </section>

      <div className="glow-divider" aria-hidden="true" />

      <section id="signup" className="invitation" aria-labelledby="signup-heading">
        <h2 id="signup-heading">Request an Invitation</h2>
        <p>Space is limited for this customer event.</p>
        <a className="cta-button" href={requestAccessUrl} target="_blank" rel="noreferrer">
          Request Access
        </a>
      </section>

      <footer>
        <p>GitHub and the GitHub logo are trademarks of GitHub, Inc.; Atlanta Braves marks are property of Braves Holdings, LLC.</p>
      </footer>
    </main>
  )
}

export default App
