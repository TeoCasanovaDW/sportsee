import '../styles/profile.css'
import profileClara from '../../assets/images/profile-clara.jpg'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

export default function ProfilePage() {
  return (
    <div className="app-layout app-layout-profile">
      <Header />

      <main className="profile-main">
        <section className="profile-layout" aria-labelledby="profile-page-title">
          <h1 id="profile-page-title" className="visually-hidden">Profil de Clara Dupont</h1>

          <div className="profile-left-column">
            <article className="profile-user-card">
              <div className="user-avatar-container">
                <img className="user-avatar" src={profileClara} alt="Photo de profil de Clara Dupont" />
              </div>

              <div className="profile-user-content">
                <h2 className="profile-user-name">Clara Dupont</h2>
                <p className="profile-user-member-since">Membre depuis le 14 juin 2023</p>
              </div>
            </article>

            <article className="profile-details-card" aria-labelledby="profile-details-title">
              <h2 id="profile-details-title" className="profile-details-title">Votre profil</h2>

              <dl className="profile-details-list">
                <div className="profile-details-item">
                  <dt className="profile-details-label">Âge</dt>
                  <dd className="profile-details-value">29</dd>
                </div>

                <div className="profile-details-item">
                  <dt className="profile-details-label">Genre</dt>
                  <dd className="profile-details-value">Femme</dd>
                </div>

                <div className="profile-details-item">
                  <dt className="profile-details-label">Taille</dt>
                  <dd className="profile-details-value">1m68</dd>
                </div>

                <div className="profile-details-item">
                  <dt className="profile-details-label">Poids</dt>
                  <dd className="profile-details-value">58kg</dd>
                </div>
              </dl>
            </article>
          </div>

          <section className="profile-stats-column" aria-labelledby="profile-stats-title">
            <header className="profile-stats-header">
              <h2 id="profile-stats-title" className="profile-stats-title">Vos statistiques</h2>
              <p className="profile-stats-subtitle">depuis le 14 juin 2023</p>
            </header>

            <div className="profile-stats-list">
              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Temps total couru</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">27h</span>
                  <span className="profile-stat-unit">15min</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Calories brûlées</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">25000</span>
                  <span className="profile-stat-unit">cal</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Distance totale parcourue</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">312</span>
                  <span className="profile-stat-unit">km</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Nombre de jours de repos</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">9</span>
                  <span className="profile-stat-unit">jours</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Nombre de sessions</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">41</span>
                  <span className="profile-stat-unit">sessions</span>
                </p>
              </article>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  )
}
