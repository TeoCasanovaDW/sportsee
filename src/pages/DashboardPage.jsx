import '../styles/dashboard.css'
import activityIcon from '../../assets/icons/activity.svg'
import profileClara from '../../assets/images/profile-clara.jpg'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { useUser } from '../context/UserContext'
import { useUserActivity } from '../hooks/useUserActivity'
import { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ComposedChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { formatLongDate, formatShortDate, formatSlashDate } from '../utils/formatDate'

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

function renderDonutLabel({ cx, cy, midAngle, outerRadius, name, value, index }) {
  if (value === 0) return null
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 28
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const isRight = x > cx
  const dotColor = index === 0 ? '#1428ff' : '#c6cafc'
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={dotColor} />
      <text
        x={isRight ? x + 11 : x - 11}
        y={y}
        fill="#666"
        textAnchor={isRight ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {name}
      </text>
    </g>
  )
}

function DistanceLegend() {
  return (
    <div className="chart-legend">
      <span className="chart-legend-item">
        <span className="chart-legend-dot" style={{ background: '#7B82F5' }} />
        <span className="chart-legend-text">Km</span>
      </span>
    </div>
  )
}

function HeartRateLegend() {
  return (
    <div className="chart-legend">
      <span className="chart-legend-item">
        <span className="chart-legend-dot" style={{ background: '#ffb3b3' }} />
        <span className="chart-legend-text">Min</span>
      </span>
      <span className="chart-legend-item">
        <span className="chart-legend-dot" style={{ background: '#ff6b50' }} />
        <span className="chart-legend-text">Max BPM</span>
      </span>
      <span className="chart-legend-item">
        <svg width="20" height="12" style={{ display: 'block' }}>
          <line x1="0" y1="6" x2="20" y2="6" stroke="#1428ff" strokeWidth="2" />
          <circle cx="10" cy="6" r="3" fill="#1428ff" />
        </svg>
        <span className="chart-legend-text">Moy BPM</span>
      </span>
    </div>
  )
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
  const [bpmHovered, setBpmHovered] = useState(false)
  const [kmHovered, setKmHovered] = useState(false)
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
            <article className="chart-card chart-card-distance" onMouseEnter={() => setKmHovered(true)} onMouseLeave={() => setKmHovered(false)}>
              <header className="chart-card-header">
                <div className="chart-title-group">
                  <h3 className="chart-title">
                    <span className="chart-value">
                      {weeklyAvgDistance !== '—' ? `${weeklyAvgDistance}km` : '—'}
                    </span>{' '}
                    en moyenne
                  </h3>
                  <p className="chart-subtitle">Total des kilomètres 4 dernières semaines</p>
                </div>

                <div className="chart-period-selector" aria-label="Période du graphique distance">
                  <button className="period-button period-button-previous" type="button" aria-label="Période précédente" onClick={() => setPageOffset(o => o - 1)}>‹</button>
                  <span className="period-label">{periodLabel}</span>
                  <button className="period-button period-button-next" type="button" aria-label="Période suivante" onClick={() => setPageOffset(o => Math.min(0, o + 1))} disabled={pageOffset >= 0}>›</button>
                </div>
              </header>

              <div className="chart-container chart-container-bars">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weeklyDistanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis dataKey="label" axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} tickLine={false} tick={{ fontSize: 13, fill: '#aaa' }} />
                    <YAxis axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} tickLine={false} tick={{ fontSize: 12, fill: '#aaa' }} />
                    <Tooltip formatter={(v) => [`${v} km`, 'Distance']} cursor={false} />
                    <Legend verticalAlign="bottom" align="left" content={() => <DistanceLegend />} />
                    <Bar dataKey="km" name="Distance" fill={kmHovered ? '#1428ff' : '#B6BDFC'} radius={[15, 15, 15, 15]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="chart-card chart-card-heart-rate" onMouseEnter={() => setBpmHovered(true)} onMouseLeave={() => setBpmHovered(false)}>
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
                  <button className="period-button period-button-previous" type="button" aria-label="Période précédente" onClick={() => setPageOffset(o => o - 1)}>‹</button>
                  <span className="period-label">{periodLabel}</span>
                  <button className="period-button period-button-next" type="button" aria-label="Période suivante" onClick={() => setPageOffset(o => Math.min(0, o + 1))} disabled={pageOffset >= 0}>›</button>
                </div>
              </header>

              <div className="chart-container chart-container-bars">
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={heartRateData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={2} barCategoryGap="30%">
                    <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis dataKey="date" axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} tickLine={false} tick={{ fontSize: 11, fill: '#aaa' }} />
                    <YAxis axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} tickLine={false} tick={{ fontSize: 12, fill: '#aaa' }} domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="left" content={() => <HeartRateLegend />} />
                    <Bar dataKey="min" name="Min" fill="#ffb3b3" radius={[15, 15, 15, 15]} barSize={16} />
                    <Bar dataKey="max" name="Max BPM" fill="#ff6b50" radius={[15, 15, 15, 15]} barSize={16} />
                    <Line type="monotone" dataKey="avg" name="Moy BPM" stroke={bpmHovered ? '#1428ff' : '#F2F3FF'} strokeWidth={2} dot={{ fill: '#1428ff', stroke: '#1428ff', r: 3 }} activeDot={{ fill: '#1428ff', stroke: '#1428ff', r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
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

              <div className="chart-container chart-container-donut">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart margin={{ top: 24, right: 52, bottom: 24, left: 52 }}>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={84}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                      label={renderDonutLabel}
                      labelLine={false}
                      cornerRadius={5}
                    >
                      <Cell fill="#1428ff" />
                      <Cell fill="#e0e3ff" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
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
