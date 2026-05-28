import './Footer.css'
import logoMark from '../../../assets/icons/logo-mark.svg'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="footer-copyright">©Sportsee&nbsp;&nbsp;Tous droits réservés</p>

        <nav className="footer-nav" aria-label="Navigation secondaire">
          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <a className="footer-nav-link" href="#">Conditions générales</a>
            </li>
            <li className="footer-nav-item">
              <a className="footer-nav-link" href="#">Contact</a>
            </li>
            <li className="footer-nav-item footer-logo-item">
              <img className="footer-logo-icon" src={logoMark} alt="SportSee" />
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
