import './Header.css'
import { Link, useLocation } from 'react-router-dom'
import logoMark from '../../../assets/icons/logo-mark.svg'

export default function Header() {
  const { pathname } = useLocation()

  const navLink = (to, label) => {
    const isActive = pathname === to
    return (
      <li className="main-nav-item">
        <Link className={`main-nav-link${isActive ? ' main-nav-link-active' : ''}`} to={to}>
          {label}
        </Link>
      </li>
    )
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-link" to="/dashboard" aria-label="SportSee - Dashboard">
          <img className="brand-icon" src={logoMark} alt="" />
          <span className="brand-name">SPORTSEE</span>
        </Link>

        <nav className="main-nav" aria-label="Navigation principale">
          <ul className="main-nav-list">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/profile', 'Mon profil')}
            <li className="main-nav-item main-nav-separator" aria-hidden="true">|</li>
            <li className="main-nav-item">
              <Link className="main-nav-link logout-link" to="/login">Se déconnecter</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
