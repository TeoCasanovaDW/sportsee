import '../styles/dashboard.css'
import activityIcon from '../../assets/icons/activity.svg'
import profileClara from '../../assets/images/profile-clara.jpg'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useUser } from '../context/UserContext'
import { useUserActivity } from '../hooks/useUserActivity'

const MONTHS_LONG = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const MONTHS_SHORT = ['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc']
const WEEKLY_SESSIONS_GOAL = 6

function formatLongDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${parseInt(day, 10)} ${MONTHS_LONG[parseInt(month, 10) - 1]} ${year}`
}

function formatShortDate(iso) {
  if (!iso) return '—'
  const [, month, day] = iso.split('-')
  return `${parseInt(day, 10)} ${MONTHS_SHORT[parseInt(month, 10) - 1]}`
}

function formatSlashDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function avgHeartRate(sessions) {
  if (!sessions?.length) return null
  return Math.round(sessions.reduce((sum, s) => sum + (s.heartRate?.average ?? 0), 0) / sessions.length)
}

export default function DashboardPage() {
  const { userInfo } = useUser()
  const { data: activity } = useUserActivity()

  const firstName = userInfo?.firstName || '—'
  const lastName = userInfo?.lastName || ''
  const fullName = lastName ? `${firstName} ${lastName}` : firstName
  const memberSince = userInfo?.memberSince
    ? `Membre depuis le ${formatLongDate(userInfo.memberSince)}`
    : '—'
  const totalDistance = userInfo?.stats?.totalDistance ?? '—'
  const weeklyGoal = WEEKLY_SESSIONS_GOAL

  const avatarSrc = userInfo?.profilePicture || profileClara

  const sessionsCount = activity?.weeklyStats?.sessionsCount ?? '—'
  const weeklyDuration = activity?.weeklyStats?.totalDuration ?? '—'
  const weeklyDistance = activity?.weeklyStats?.totalDistance ?? '—'
  const heartRate = avgHeartRate(activity?.sessions)

  const periodStart = activity?.period?.startWeek
  const periodEnd = activity?.period?.endWeek
  const periodLabel = periodStart && periodEnd
    ? `${formatShortDate(periodStart)} - ${formatShortDate(periodEnd)}`
    : '—'
  const weekLabel = periodStart && periodEnd
    ? `Du ${formatSlashDate(periodStart)} au ${formatSlashDate(periodEnd)}`
    : '—'

  return (
    <div className="app-layout app-layout-dashboard">
      <Header />

      <main className="dashboard-main">
        <section className="user-summary-section" aria-labelledby="user-summary-title">
          <h1 id="user-summary-title" className="visually-hidden">Résumé utilisateur</h1>

          <article className="user-summary-card">
            <div className="user-summary-left">
              <div className="user-avatar-container">
                <img className="user-avatar" src={avatarSrc} alt={`Photo de profil de ${fullName}`} onError={(e) => { e.currentTarget.src = profileClara }} />
              </div>

              <div className="user-identity">
                <h2 className="user-name">{fullName}</h2>
                <p className="user-member-since">{memberSince}</p>
              </div>
            </div>

            <div className="user-summary-right">
              <p className="total-distance-label">Distance totale parcourue</p>

              <div className="total-distance-card">
                <img className="total-distance-icon" src={activityIcon} alt="" />
                <p className="total-distance-value">
                  <span className="total-distance-number">{totalDistance}</span>
                  <span className="total-distance-unit"> km</span>
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="performances-section" aria-labelledby="performances-title">
          <header className="section-header">
            <h2 id="performances-title" className="section-title">Vos dernières performances</h2>
          </header>

          <div className="performances-row">
            <article className="chart-card chart-card-distance">
              <header className="chart-card-header">
                <div className="chart-title-group">
                  <h3 className="chart-title">
                    <span className="chart-value">
                      {weeklyDistance !== '—' ? `${weeklyDistance}km` : '—'}
                    </span>{' '}
                    en moyenne
                  </h3>
                  <p className="chart-subtitle">Total des kilomètres 4 dernières semaines</p>
                </div>

                <div className="chart-period-selector" aria-label="Période du graphique distance">
                  <button className="period-button period-button-previous" type="button" aria-label="Période précédente">‹</button>
                  <span className="period-label">{periodLabel}</span>
                  <button className="period-button period-button-next" type="button" aria-label="Période suivante">›</button>
                </div>
              </header>

              <div className="chart-placeholder chart-placeholder-distance">
                <p className="chart-placeholder-label">Graphique Recharts : distance hebdomadaire</p>
              </div>
            </article>

            <article className="chart-card chart-card-heart-rate">
              <header className="chart-card-header">
                <div className="chart-title-group">
                  <h3 className="chart-title">
                    <span className="chart-value">
                      {heartRate != null ? `${heartRate} BPM` : '—'}
                    </span>
                  </h3>
                  <p className="chart-subtitle">Fréquence cardiaque moyenne</p>
                </div>

                <div className="chart-period-selector" aria-label="Période du graphique fréquence cardiaque">
                  <button className="period-button period-button-previous" type="button" aria-label="Période précédente">‹</button>
                  <span className="period-label">{periodLabel}</span>
                  <button className="period-button period-button-next" type="button" aria-label="Période suivante">›</button>
                </div>
              </header>

              <div className="chart-placeholder chart-placeholder-heart-rate">
                <p className="chart-placeholder-label">Graphique Recharts : fréquence cardiaque</p>
              </div>
            </article>
          </div>
        </section>

        <section className="week-section" aria-labelledby="week-title">
          <header className="section-header">
            <h2 id="week-title" className="section-title">Cette semaine</h2>
            <p className="section-subtitle">{weekLabel}</p>
          </header>

          <div className="week-row">
            <article className="week-card week-progress-card">
              <div className="week-progress-content">
                <h3 className="week-progress-title">
                  <span className="week-progress-value">x{sessionsCount}</span>
                  <span className="week-progress-target">sur objectif de {weeklyGoal}</span>
                </h3>
                <p className="week-progress-subtitle">Courses hebdomadaire réalisées</p>
              </div>

              <div className="chart-placeholder chart-placeholder-week-progress">
                <p className="chart-placeholder-label">Graphique Recharts : objectif hebdomadaire</p>
              </div>
            </article>

            <div className="week-stats-column">
              <article className="week-stat-card week-stat-card-duration">
                <h3 className="week-stat-title">Durée d'activité</h3>
                <p className="week-stat-value">
                  <span className="week-stat-number">{weeklyDuration}</span>
                  <span className="week-stat-unit"> minutes</span>
                </p>
              </article>

              <article className="week-stat-card week-stat-card-distance">
                <h3 className="week-stat-title">Distance</h3>
                <p className="week-stat-value">
                  <span className="week-stat-number">{weeklyDistance}</span>
                  <span className="week-stat-unit"> kilomètres</span>
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
