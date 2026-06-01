import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/login.css'
import logoMark from '../../assets/icons/logo-mark.svg'
import loginRunning from '../../assets/images/login-running.jpg'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const { username, password } = e.target.elements
    try {
      await signIn(username.value, password.value)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Identifiants incorrects.')
    }
  }

  return (
    <div className="login-layout">
      <section className="login-panel" aria-labelledby="login-title">
        <header className="brand-header">
          <Link className="brand-link" to="/login" aria-label="SportSee - Accueil">
            <svg  className="brand-icon" width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4.00003" y="7.65625" width="3" height="13" rx="1.5" fill="url(#paint0_linear_9_86)"/>
              <rect x="7.00003" y="14" width="3" height="14" rx="1.5" transform="rotate(180 7.00003 14)" fill="url(#paint1_linear_9_86)" class="orange-rect rect-2"/>
              <rect x="16" y="11.3281" width="3" height="6" rx="1.5" fill="url(#paint2_linear_9_86)"/>
              <rect x="19" y="14" width="3" height="14" rx="1.5" transform="rotate(180 19 14)" fill="url(#paint3_linear_9_86)" class="orange-rect rect-5"/>
              <rect x="12" y="11" width="3" height="9" rx="1.5" fill="url(#paint4_linear_9_86)"/>
              <rect x="15" y="14" width="3" height="9" rx="1.5" transform="rotate(180 15 14)" fill="url(#paint5_linear_9_86)" class="orange-rect rect-4"/>
              <rect x="8.00003" y="11.3281" width="3" height="5" rx="1.5" fill="url(#paint6_linear_9_86)"/>
              <rect x="11" y="14" width="3" height="12" rx="1.5" transform="rotate(180 11 14)" fill="url(#paint7_linear_9_86)" class="orange-rect rect-3"/>
              <rect y="11" width="3" height="8" rx="1.5" fill="url(#paint8_linear_9_86)"/>
              <rect x="3" y="14.3281" width="3" height="11" rx="1.5" transform="rotate(180 3 14.3281)" fill="url(#paint9_linear_9_86)" class="orange-rect rect-1"/>
              <defs><linearGradient id="paint0_linear_9_86" x1="5.50003" y1="5.65625" x2="5.50003" y2="20.6562" gradientUnits="userSpaceOnUse"><stop stop-color="#F4320B"/><stop offset="1" stop-color="#5465F7"/></linearGradient><linearGradient id="paint1_linear_9_86" x1="8.50003" y1="28" x2="8.50003" y2="14" gradientUnits="userSpaceOnUse"><stop stop-color="#F99885"/><stop offset="1" stop-color="#DF392B"/></linearGradient><linearGradient id="paint2_linear_9_86" x1="17.5" y1="11.3281" x2="17.5" y2="17.3281" gradientUnits="userSpaceOnUse"><stop stop-color="#F4320B"/><stop offset="1" stop-color="#5465F7"/></linearGradient><linearGradient id="paint3_linear_9_86" x1="20.5" y1="28" x2="20.5" y2="14" gradientUnits="userSpaceOnUse"><stop stop-color="#F99885"/><stop offset="1" stop-color="#DF392B"/></linearGradient><linearGradient id="paint4_linear_9_86" x1="13.5" y1="11" x2="13.5" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#F4320B"/><stop offset="1" stop-color="#5465F7"/></linearGradient><linearGradient id="paint5_linear_9_86" x1="16.5" y1="23" x2="16.5" y2="14" gradientUnits="userSpaceOnUse"><stop stop-color="#F99885"/><stop offset="1" stop-color="#DF392B"/></linearGradient><linearGradient id="paint6_linear_9_86" x1="9.50003" y1="11.3281" x2="9.50003" y2="16.3281" gradientUnits="userSpaceOnUse"><stop stop-color="#F4320B"/><stop offset="1" stop-color="#5465F7"/></linearGradient><linearGradient id="paint7_linear_9_86" x1="12.5" y1="26" x2="12.5" y2="14" gradientUnits="userSpaceOnUse"><stop stop-color="#F99885"/><stop offset="1" stop-color="#DF392B"/></linearGradient><linearGradient id="paint8_linear_9_86" x1="1.5" y1="11" x2="1.5" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#F4320B"/><stop offset="1" stop-color="#5465F7"/></linearGradient><linearGradient id="paint9_linear_9_86" x1="4.5" y1="25.3281" x2="4.5" y2="14.3281" gradientUnits="userSpaceOnUse"><stop stop-color="#F99885"/><stop offset="1" stop-color="#DF392B"/></linearGradient></defs>
            </svg>
            <span className="brand-name">SPORTSEE</span>
          </Link>
        </header>

        <main className="login-content">
          <section className="login-card">
            <h1 className="login-heading">
              Transformez<br />vos stats en résultats
            </h1>

            <form className="login-form" onSubmit={handleSubmit}>
              <h2 id="login-title" className="form-title">Se connecter</h2>

              {error && <p className="form-error" role="alert">{error}</p>}

              <div className="form-field">
                <label className="form-label" htmlFor="email">Adresse email</label>
                <input
                  className="form-input"
                  id="email"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="password">Mot de passe</label>
                <input
                  className="form-input"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button className="login-button" type="submit">Se connecter</button>

              <a className="forgot-password-link" href="#">Mot de passe oublié ?</a>
            </form>
          </section>
        </main>
      </section>

      <aside className="login-visual" aria-label="Illustration de sportifs en course">
        <img
          className="login-visual-image"
          src={loginRunning}
          alt="Participants à une course à pied"
        />
        <div className="login-visual-content">
          <p className="login-visual-text">
            Analysez vos performances en un clin d'œil,<br />
            suivez vos progrès et atteignez vos objectifs.
          </p>
        </div>
      </aside>
    </div>
  )
}
