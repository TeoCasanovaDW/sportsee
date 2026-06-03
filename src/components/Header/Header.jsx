import './Header.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../BrandLogo/BrandLogo'

export default function Header() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink className="brand-link" to="/dashboard" aria-label="SportSee - Dashboard">
          <BrandLogo />

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
              <button className="main-nav-link logout-link" type="button" onClick={handleLogout}>Se déconnecter</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
