// src/pages/Stats.jsx
import { useAverages } from '../hooks/useAverages'
import { useApp } from '../contexts/AppContext'
import { formatIncome, averageLabel } from '../services/firestore'
import { PROF_COLORS } from '../constants'
import ProfChart from '../components/ProfChart'
import { EmptyState } from '../components/UI'

const RANK_COLORS = ['#FFD200', '#B0BEC5', '#CD7F32']

export default function Stats() {
  const { filters } = useApp()
  const { averages, loading } = useAverages(filters)

  const sorted = [...averages].sort((a, b) => b.avgIncome - a.avgIncome)

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 sm:pb-8 space-y-6">

      {/* Gráfico */}
      {averages.length >= 2 && (
        <div>
          <h2 className="font-bold text-white text-sm mb-3">📊 Por profesión</h2>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
            <ProfChart averages={averages} />
          </div>
        </div>
      )}

      {/* Ranking */}
      <div>
        <h2 className="font-bold text-white text-sm mb-3">🏆 Ranking de ingresos</h2>

        {loading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-dark-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState icon="🏆" title="Sin datos disponibles" subtitle="Reportá tu ingreso para empezar el ranking." />
        ) : (
          <div className="space-y-2">
            {sorted.map((avg, i) => {
              const color = PROF_COLORS[avg.profession] ?? '#9E9E9E'
              const rankColor = RANK_COLORS[i] ?? '#607D8B'
              return (
                <div
                  key={avg.id}
                  className="flex items-center gap-3 bg-dark-card border rounded-xl px-4 py-3 animate-fade-in transition-transform hover:scale-[1.01]"
                  style={{
                    borderColor: i < 3 ? `${rankColor}40` : 'rgba(255,255,255,0.06)',
                    animationDelay: `${i * 40}ms`
                  }}
                >
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{ background: `${rankColor}20`, color: rankColor }}>
                    #{i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">
                      {avg.profession === 'Todas' ? 'Global' : avg.profession}
                    </p>
                    <p className="text-xs text-white/35 truncate">
                      {avg.country}{avg.experience && avg.experience !== 'Todas' ? ` · ${avg.experience}` : ''}
                    </p>
                  </div>

                  {/* Ingreso */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-base" style={{ color: i === 0 ? rankColor : color }}>
                      {formatIncome(avg.avgIncome, avg.currency)}
                    </p>
                    <p className="text-xs text-white/30">{avg.count} rep.</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
