// src/pages/Dashboard.jsx
import { useAverages, useGlobalAverage } from '../hooks/useAverages'
import { useApp } from '../contexts/AppContext'
import { formatIncome } from '../services/firestore'
import { COUNTRIES, PROFESSIONS, EXPERIENCE } from '../constants'
import IncomeCard, { IncomeCardSkeleton } from '../components/IncomeCard'
import ProfChart from '../components/ProfChart'
import { LiveDot, FilterPill, EmptyState, Select } from '../components/UI'

export default function Dashboard({ onNavigate }) {
  const { filters, setFilters, clearFilters, activeCount } = useApp()
  const { averages, loading } = useAverages(filters)
  const { global: globalAvg, meta, loading: loadingGlobal } = useGlobalAverage()

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 sm:pb-8 space-y-6">

      {/* ── Banner global ──────────────────────────────── */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-green/20 to-brand-blue/10 border border-brand-green/20 relative overflow-hidden">
        {/* Glow decorativo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
            🌍 Promedio Global <LiveDot />
          </span>
        </div>

        {loadingGlobal ? (
          <div className="h-10 w-40 bg-white/10 rounded-xl animate-pulse mb-1" />
        ) : (
          <p className="text-4xl font-extrabold text-white leading-none mb-1">
            {globalAvg ? formatIncome(globalAvg.avgIncome, globalAvg.currency) : '—'}
          </p>
        )}
        <p className="text-sm text-white/40 mb-4">ingreso neto mensual promedio</p>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs bg-white/10 text-white/60 px-3 py-1.5 rounded-full font-medium">
            👥 {meta.totalReports?.toLocaleString('es-AR') ?? '0'} reportes anónimos
          </span>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs bg-brand-green text-black px-3 py-1.5 rounded-full font-bold hover:bg-brand-green/90 transition-colors"
          >
            + Reportar el mío
          </button>
        </div>
      </div>

      {/* ── Filtros ────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-sm">
            Filtrar resultados
            {activeCount > 0 && (
              <span className="ml-2 text-xs bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full font-bold">
                {activeCount} activo{activeCount > 1 ? 's' : ''}
              </span>
            )}
          </h2>
          {activeCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-white/40 hover:text-red-400 transition-colors">
              Limpiar todo
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Select
            placeholder="País"
            value={filters.country}
            onChange={v => setFilter('country', v)}
            options={COUNTRIES}
          />
          <Select
            placeholder="Profesión"
            value={filters.profession}
            onChange={v => setFilter('profession', v)}
            options={PROFESSIONS}
          />
          <Select
            placeholder="Exp."
            value={filters.experience}
            onChange={v => setFilter('experience', v)}
            options={EXPERIENCE}
          />
        </div>

        {/* Pills de filtros activos */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {filters.country    && <FilterPill label={filters.country}    onRemove={() => setFilter('country',    '')} />}
            {filters.profession && <FilterPill label={filters.profession} onRemove={() => setFilter('profession', '')} />}
            {filters.experience && <FilterPill label={filters.experience} onRemove={() => setFilter('experience', '')} />}
          </div>
        )}
      </div>

      {/* ── Grid de cards ──────────────────────────────── */}
      <div>
        <h2 className="font-bold text-white text-sm mb-3">Promedios por categoría</h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array(6).fill(0).map((_, i) => <IncomeCardSkeleton key={i} />)}
          </div>
        ) : averages.length === 0 ? (
          <EmptyState
            icon={activeCount > 0 ? '🔍' : '📊'}
            title={activeCount > 0 ? 'Sin datos para esos filtros' : '¡Sé el primero en reportar!'}
            subtitle={activeCount > 0
              ? 'Probá con otros filtros o reportá tu ingreso.'
              : 'Los datos aparecen aquí una vez que la comunidad reporta.'}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {averages.map((avg, i) => <IncomeCard key={avg.id} avg={avg} index={i} />)}
          </div>
        )}
      </div>

      {/* ── Gráfico ────────────────────────────────────── */}
      {averages.length >= 2 && (
        <div>
          <h2 className="font-bold text-white text-sm mb-3">Comparativa por profesión</h2>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
            <ProfChart averages={averages} />
          </div>
        </div>
      )}
    </div>
  )
}
