// src/components/ProfChart.jsx
// Gráfico de barras con Recharts — promedios por profesión

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { PROF_COLORS } from '../constants'
import { formatIncome } from '../services/firestore'

function shortLabel(str) {
  if (!str || str.length <= 9) return str
  return str.slice(0, 7) + '.'
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-dark-input border border-dark-border rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-white mb-1">{d.profession}</p>
      <p className="text-brand-green font-extrabold text-sm">{formatIncome(d.avg, d.currency)}</p>
      <p className="text-white/40">{d.count} reportes</p>
    </div>
  )
}

export default function ProfChart({ averages }) {
  // Agrupar por profesión (mayor promedio)
  const byProf = {}
  averages.forEach(avg => {
    const p = avg.profession === 'Todas' ? 'Global' : avg.profession
    if (!byProf[p] || avg.avgIncome > byProf[p].avg) {
      byProf[p] = { profession: p, avg: avg.avgIncome, count: avg.count, currency: avg.currency }
    }
  })

  const data = Object.values(byProf).sort((a, b) => b.avg - a.avg).slice(0, 8)
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="profession"
          tickFormatter={shortLabel}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => {
            if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M`
            if (v >= 1_000) return `${(v/1_000).toFixed(0)}K`
            return v
          }}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {data.map((entry, i) => (
            <Cell key={i} fill={PROF_COLORS[entry.profession] ?? '#00C897'} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
