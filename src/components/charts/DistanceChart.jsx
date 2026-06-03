import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'

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

export default function DistanceChart({ data, weeklyAvgDistance, periodLabel, pageOffset, onPrev, onNext }) {
  const [kmHovered, setKmHovered] = useState(false)

  return (
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
          <button className="period-button period-button-previous" type="button" aria-label="Période précédente" onClick={onPrev}>‹</button>
          <span className="period-label">{periodLabel}</span>
          <button className="period-button period-button-next" type="button" aria-label="Période suivante" onClick={onNext} disabled={pageOffset >= 0}>›</button>
        </div>
      </header>

      <div className="chart-container chart-container-bars">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
  )
}
