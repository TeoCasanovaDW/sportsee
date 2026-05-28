import './Header.css'
import { NavLink } from 'react-router-dom'
import logoMark from '../../../assets/icons/logo-mark.svg'

export default function Header() {

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink className="brand-link" to="/dashboard" aria-label="SportSee - Dashboard">
          <img className="brand-icon" src={logoMark} alt="" />
          <span className="brand-name">SPORTSEE</span>
        </NavLink>

        <nav className="main-nav" aria-label="Navigation principale">
          <ul className="main-nav-list">
            <li className="main-nav-item">
              <NavLink className="main-nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="main-nav-item">
              <NavLink className="main-nav-link" to="/profile">Mon profil</NavLink>
            </li>
            <li className="main-nav-item main-nav-separator" aria-hidden="true">|</li>
            <li className="main-nav-item">
              <NavLink className="main-nav-link logout-link" to="/login">Se déconnecter</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
