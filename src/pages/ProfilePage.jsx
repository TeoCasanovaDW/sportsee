import '../styles/profile.css'
import profileClara from '../../assets/images/profile-clara.jpg'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useUser } from '../context/UserContext'

const MONTHS_LONG = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

const profileFallbackStats = {
  gender: 'Femme',
  caloriesBurned: '25 000 kcal',
  restDays: 9,
}

function formatLongDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${parseInt(day, 10)} ${MONTHS_LONG[parseInt(month, 10) - 1]} ${year}`
}

function formatDuration(minutes) {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const min = minutes % 60
  return min > 0 ? `${h}h${String(min).padStart(2, '0')}` : `${h}h`
}

export default function ProfilePage() {
  const { userInfo, loading, error } = useUser()

  if (loading) return <p className="page-loading">Chargement…</p>
  if (error) return <p className="page-error">Erreur : {error}</p>

  const firstName = userInfo?.firstName || '—'
  const lastName = userInfo?.lastName || ''
  const fullName = lastName ? `${firstName} ${lastName}` : firstName
  const memberSince = userInfo?.memberSince
    ? `Membre depuis le ${formatLongDate(userInfo.memberSince)}`
    : '—'
  const avatarSrc = userInfo?.profilePicture || profileClara

  const age = userInfo?.age ?? '—'
  const height = userInfo?.height ?? '—'
  const weight = userInfo?.weight ?? '—'
  const totalDistance = userInfo?.stats?.totalDistance ?? '—'
  const totalDuration = formatDuration(userInfo?.stats?.totalDuration)
  const sessionsCount = userInfo?.stats?.sessionsCount ?? '—'

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
                  <dd className="profile-details-value">{profileFallbackStats.gender}</dd>
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
              {userInfo?.memberSince && (
                <p className="profile-stats-subtitle">depuis le {formatLongDate(userInfo.memberSince)}</p>
              )}
            </header>

            <div className="profile-stats-list">
              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Temps total couru</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{totalDuration}</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Calories brûlées</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{profileFallbackStats.caloriesBurned}</span>
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
                <h3 className="profile-stat-title">Nombre de sessions</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{sessionsCount}</span>
                  <span className="profile-stat-unit"> sessions</span>
                </p>
              </article>

              <article className="profile-stat-card">
                <h3 className="profile-stat-title">Nombre de jours de repos</h3>
                <p className="profile-stat-value">
                  <span className="profile-stat-number">{profileFallbackStats.restDays}</span>
                  <span className="profile-stat-unit"> jours</span>
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
