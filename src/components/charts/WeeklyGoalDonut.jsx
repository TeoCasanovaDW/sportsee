import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

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

export default function WeeklyGoalDonut({ donutData, sessionsCount, weeklyGoal }) {
  return (
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
  )
}
