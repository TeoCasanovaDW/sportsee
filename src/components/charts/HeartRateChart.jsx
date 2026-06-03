import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'

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

export default function HeartRateChart({ data, heartRate, periodLabel, pageOffset, onPrev, onNext }) {
  const [bpmHovered, setBpmHovered] = useState(false)

  return (
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
          <button className="period-button period-button-previous" type="button" aria-label="Période précédente" onClick={onPrev}>‹</button>
          <span className="period-label">{periodLabel}</span>
          <button className="period-button period-button-next" type="button" aria-label="Période suivante" onClick={onNext} disabled={pageOffset >= 0}>›</button>
        </div>
      </header>

      <div className="chart-container chart-container-bars">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={2} barCategoryGap="30%">
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
  )
}
