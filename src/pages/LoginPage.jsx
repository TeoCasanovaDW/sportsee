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
            <img className="brand-icon" src={logoMark} alt="" />
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
