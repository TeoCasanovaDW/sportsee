import '../styles/profile.css'
import profileClara from '../../assets/images/profile-clara.jpg'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useUser } from '../context/UserContext'
import { formatLongDate, formatDuration } from '../utils/formatDate'

const profileFallbackStats = {
  caloriesBurned: '25 000',
  restDays: 9,
}

export default function ProfilePage() {
  const { userInfo, loading, error } = useUser()

  if (loading || !userInfo) return (
    <div className="app-layout app-layout-profile">
      <Header />
      <main className="profile-main"><p className="page-loading">Chargement…</p></main>
      <Footer />
    </div>
  )
  if (error) return (
    <div className="app-layout app-layout-profile">
      <Header />
      <main className="profile-main"><p className="page-error">Impossible de charger les données. Vérifiez que l'API est lancée.</p></main>
      <Footer />
    </div>
  )

  const memberSince = userInfo.memberSince
    ? `Membre depuis le ${formatLongDate(userInfo.memberSince)}`
    : '—'
  const avatarSrc = userInfo.profilePicture || profileClara

  const { fullName, age, height, weight, gender } = userInfo
  const { totalDistance, totalDuration: rawDuration, sessionsCount } = userInfo.stats
  const totalDuration = formatDuration(rawDuration)

  return (
    <div className="app-layout app-layout-profile">
      <Header />

      <main className="profile-main">
        <section className="profile-layout" aria-labelledby="profile-page-title">
          <h1 id="profile-page-title" className="visually-hidden">Profil de {fullName}</h1>

          <div className="profile-left-column">
            <article className="profile-user-card">
              <div className="user-avatar-container">
                <img
                  className="user-avatar"
                  src={avatarSrc}
                  alt={`Photo de profil de ${fullName}`}
                  onError={(e) => { e.currentTarget.src = profileClara }}
                />
              </div>

              <div className="profile-user-content">
                <h2 className="profile-user-name">{fullName}</h2>
                <p className="profile-user-member-since">{memberSince}</p>
              </div>
            </article>

            <article className="profile-details-card" aria-labelledby="profile-details-title">
              <h2 id="profile-details-title" className="profile-details-title">Votre profil</h2>

              <dl className="profile-details-list">
                <div className="profile-details-item">
                  <dt className="profile-details-label">Âge</dt>
                  <dd className="profile-details-value">{age}</dd>
                </div>

                <div className="profile-details-item">
                  <dt className="profile-details-label">Genre</dt>
                  <dd className="profile-details-value">{gender}</dd>
                </div>

                <div className="profile-details-item">
                  <dt className="profile-details-label">Taille</dt>
                  <dd className="profile-details-value">{height !== '—' ? `${height} cm` : '—'}</dd>
                </div>

                <div className="profile-details-item">
                  <dt className="profile-details-label">Poids</dt>
                  <dd className="profile-details-value">{weight !== '—' ? `${weight} kg` : '—'}</dd>
                </div>
              </dl>
            </article>
          </div>

          <section className="profile-stats-column" aria-labelledby="profile-stats-title">
            <header className="profile-stats-header">
              <h2 id="profile-stats-title" className="profile-stats-title">Vos statistiques</h2>
              {userInfo.memberSince && (
                <p className="profile-stats-subtitle">depuis le {formatLongDate(userInfo.memberSince)}</p>
              )}
            </header>

            <div className="profile-stats-list">
              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Temps total couru</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{totalDuration.hours}</span>
                  {totalDuration.minutes != "" && <span className="profile-stat-unit"> {totalDuration.minutes}</span>}
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Calories brûlées</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{profileFallbackStats.caloriesBurned}</span>
                  <span className="profile-stat-unit"> kcal</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Distance totale parcourue</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{totalDistance}</span>
                  <span className="profile-stat-unit"> km</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Nombre de jours de repos</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{profileFallbackStats.restDays}</span>
                  <span className="profile-stat-unit"> jours</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Nombre de sessions</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{sessionsCount}</span>
                  <span className="profile-stat-unit"> sessions</span>
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
