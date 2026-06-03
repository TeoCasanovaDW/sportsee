import '../styles/dashboard.css'
import activityIcon from '../../assets/icons/activity.svg'
import profileClara from '../../assets/images/profile-clara.jpg'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useUser } from '../context/UserContext'
import { useUserActivity } from '../hooks/useUserActivity'
import { useMemo, useState } from 'react'
import { formatLongDate, formatShortDate, formatSlashDate } from '../utils/formatDate'
import DistanceChart from '../components/charts/DistanceChart'
import HeartRateChart from '../components/charts/HeartRateChart'
import WeeklyGoalDonut from '../components/charts/WeeklyGoalDonut'

function avgHeartRate(sessions) {
  if (!sessions?.length) return null
  return Math.round(sessions.reduce((sum, s) => sum + (s.heartRate?.average ?? 0), 0) / sessions.length)
}

function groupSessionsByWeek(sessions, periodStart) {
  // Génère toujours 4 slots S1–S4 depuis le début de la période
  const weeks = []
  if (periodStart) {
    for (let i = 0; i < 4; i++) {
      const d = new Date(periodStart + 'T12:00:00')
      d.setDate(d.getDate() + i * 7)
      weeks.push({ key: d.toISOString().slice(0, 10), label: `S${i + 1}`, km: 0 })
    }
  }
  sessions.forEach(s => {
    const d = new Date(s.date + 'T12:00:00')
    const diff = (d.getDay() + 6) % 7
    const mon = new Date(d)
    mon.setDate(d.getDate() - diff)
    const monKey = mon.toISOString().slice(0, 10)
    const slot = weeks.find(w => w.key === monKey)
    if (slot) slot.km += s.distance
  })
  return weeks.map(w => ({ label: w.label, km: Math.round(w.km * 10) / 10 }))
}

function roundDist(v) {
  if (v == null) return '—'
  return Math.round(Number(v) * 10) / 10
}

function getWeekBounds(offset) {
  const now = new Date()
  const diff = (now.getDay() + 6) % 7
  const thisMon = new Date(now)
  thisMon.setDate(now.getDate() - diff)
  const endSun = new Date(thisMon)
  endSun.setDate(thisMon.getDate() + 6 + offset * 7)
  const startMon = new Date(endSun)
  startMon.setDate(endSun.getDate() - 27)
  return {
    startWeek: startMon.toISOString().slice(0, 10),
    endWeek: endSun.toISOString().slice(0, 10),
  }
}

function getCurrentWeekBounds() {
  const now = new Date()
  const diff = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    startWeek: monday.toISOString().slice(0, 10),
    endWeek: sunday.toISOString().slice(0, 10),
  }
}

export default function DashboardPage() {
  const { userInfo, loading: userLoading, error: userError } = useUser()

  // Graphiques distance + FC : fenêtre navigable de 4 semaines
  const [pageOffset, setPageOffset] = useState(0)
  const { startWeek, endWeek } = useMemo(() => getWeekBounds(pageOffset), [pageOffset])
  const { data: activity } = useUserActivity(startWeek, endWeek)

  // Donut + stats "Cette semaine" : semaine courante uniquement, jamais décalée
  const { startWeek: cwStart, endWeek: cwEnd } = useMemo(() => getCurrentWeekBounds(), [])
  const { data: currentWeekActivity } = useUserActivity(cwStart, cwEnd)

  // Données graphique distance : 4 slots fixes S1–S4 depuis le début de la période
  const weeklyDistanceData = useMemo(() => {
    if (!activity) return []
    return groupSessionsByWeek(activity.sessions ?? [], startWeek)
  }, [activity, startWeek])

  // Moyenne km par semaine affichée dans l'en-tête de la carte
  const weeklyAvgDistance = useMemo(() => {
    if (!weeklyDistanceData.length) return '—'
    const total = weeklyDistanceData.reduce((s, w) => s + w.km, 0)
    return Math.round((total / weeklyDistanceData.length) * 10) / 10
  }, [weeklyDistanceData])

  // Données graphique fréquence cardiaque : une entrée par session
  const heartRateData = useMemo(() => {
    if (!activity?.sessions?.length) return []
    return activity.sessions.map(s => ({
      date: formatShortDate(s.date),
      min: s.heartRate.min,
      max: s.heartRate.max,
      avg: s.heartRate.average,
    }))
  }, [activity])

  if (userLoading || !userInfo) return (
    <div className="app-layout app-layout-dashboard">
      <Header />
      <main className="dashboard-main"><p className="page-loading">Chargement…</p></main>
      <Footer />
    </div>
  )

  if (userError) return (
    <div className="app-layout app-layout-dashboard">
      <Header />
      <main className="dashboard-main"><p className="page-error">Impossible de charger les données. Vérifiez que l'API est lancée.</p></main>
      <Footer />
    </div>
  )

  const { fullName, weeklyGoal } = userInfo
  const memberSince = userInfo.memberSince
    ? `Membre depuis le ${formatLongDate(userInfo.memberSince)}`
    : '—'
  const totalDistance = userInfo.stats.totalDistance

  const avatarSrc = userInfo.profilePicture || profileClara

  // Stats section "Cette semaine" — semaine courante uniquement
  const sessionsCount = currentWeekActivity?.weeklyStats?.sessionsCount ?? '—'
  const weeklyDuration = currentWeekActivity?.weeklyStats?.totalDuration ?? '—'
  const rawWeeklyDistance = currentWeekActivity?.weeklyStats?.totalDistance
  const weeklyDistance = rawWeeklyDistance != null ? roundDist(rawWeeklyDistance) : '—'

  // BPM moyen affiché dans l'en-tête de la carte FC — suit la période navigable
  const heartRate = avgHeartRate(activity?.sessions)

  const periodLabel = `${formatShortDate(startWeek)} - ${formatShortDate(endWeek)}`
  const weekLabel = `Du ${formatSlashDate(cwStart)} au ${formatSlashDate(cwEnd)}`

  // Données graphique donut objectif hebdomadaire
  const completedSessions = typeof sessionsCount === 'number' ? sessionsCount : 0
  const remainingSessions = Math.max(weeklyGoal - completedSessions, 0)
  const donutData = [
    { name: `${completedSessions} réalisée${completedSessions > 1 ? "s" : ""}`, value: Math.min(completedSessions, weeklyGoal) },
    { name: `${remainingSessions} restante${remainingSessions > 1 ? "s" : ""}`, value: remainingSessions },
  ]

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
            <DistanceChart
              data={weeklyDistanceData}
              weeklyAvgDistance={weeklyAvgDistance}
              periodLabel={periodLabel}
              pageOffset={pageOffset}
              onPrev={() => setPageOffset(o => o - 1)}
              onNext={() => setPageOffset(o => Math.min(0, o + 1))}
            />
            <HeartRateChart
              data={heartRateData}
              heartRate={heartRate}
              periodLabel={periodLabel}
              pageOffset={pageOffset}
              onPrev={() => setPageOffset(o => o - 1)}
              onNext={() => setPageOffset(o => Math.min(0, o + 1))}
            />
          </div>
        </section>

        <section className="week-section" aria-labelledby="week-title">
          <header className="section-header">
            <h2 id="week-title" className="section-title">Cette semaine</h2>
            <p className="section-subtitle">{weekLabel}</p>
          </header>

          <div className="week-row">
            <WeeklyGoalDonut
              donutData={donutData}
              sessionsCount={sessionsCount}
              weeklyGoal={weeklyGoal}
            />

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
