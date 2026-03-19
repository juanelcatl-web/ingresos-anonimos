// src/components/IncomeCard.jsx
import { formatIncome, averageLabel } from '../services/firestore'
import { PROF_COLORS } from '../constants'

export default function IncomeCard({ avg, index = 0 }) {
  const label = averageLabel(avg)
  const color = PROF_COLORS[avg.profession] ?? '#00C897'
  const income = formatIncome(avg.avgIncome, avg.currency)

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4 border transition-transform hover:scale-[1.02] animate-fade-in"
      style={{
        animationDelay: `${index * 60}ms`,
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        borderColor: `${color}30`,
      }}
    >
      {/* Dot de color */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-xs text-white/50 font-medium truncate">{label}</span>

        {avg.experience && avg.experience !== 'Todas' && (
          <span
            className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
            style={{ background: `${color}20`, color }}
          >
            {avg.experience}
          </span>
        )}
      </div>

      {/* Monto principal con gradiente */}
      <p
        className="text-2xl font-extrabold leading-none mb-1"
        style={{ background: `linear-gradient(90deg, ${color}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {income}
      </p>
      <p className="text-xs text-white/40 mb-4">promedio mensual neto</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/35 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          {avg.count} {avg.count === 1 ? 'reporte' : 'reportes'}
        </span>
        <span className="text-[10px] font-bold" style={{ color }}>{avg.currency}</span>
      </div>
    </div>
  )
}

// Skeleton card para loading
export function IncomeCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-dark-border bg-dark-card animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="h-3 bg-white/10 rounded w-24" />
      </div>
      <div className="h-7 bg-white/10 rounded w-32 mb-1" />
      <div className="h-3 bg-white/10 rounded w-24 mb-4" />
      <div className="flex justify-between">
        <div className="h-3 bg-white/10 rounded w-20" />
        <div className="h-3 bg-white/10 rounded w-8" />
      </div>
    </div>
  )
}
