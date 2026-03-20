// src/components/IncomeMap.jsx
// Mapa grande + lista de sueldos por país debajo

import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { collection, onSnapshot, limit, query, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'
import { formatIncome } from '../services/firestore'
import { PROF_COLORS } from '../constants'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function IncomeMap() {
  const [points,          setPoints]          = useState([])
  const [loading,         setLoading]         = useState(true)
  const [tooltip,         setTooltip]         = useState(null)
  const [expandedCountry, setExpandedCountry] = useState(null)

  useEffect(() => {
    const q = query(
      collection(db, 'mappoints'),
      orderBy('timestamp', 'desc'),
      limit(500)
    )
    return onSnapshot(q, snap => {
      setPoints(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.lat && p.lng))
      setLoading(false)
    })
  }, [])

  // Agrupar por país
  const byCountry = points.reduce((acc, p) => {
    const key = p.country || 'Desconocido'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  // Ordenar países por cantidad de reportes
  const countries = Object.entries(byCountry).sort((a, b) => b[1].length - a[1].length)

  return (
    <div className="w-full space-y-4">

      {/* ── MAPA ──────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-dark-border bg-dark-card">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">🌍 Mapa en tiempo real</span>
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse inline-block" />
              {points.length} sueldos cargados
            </span>
          </div>
          <span className="text-xs text-white/25 hidden sm:block">Ubicación aproximada por ciudad</span>
        </div>

        {/* Mapa — más alto */}
        <div className="relative" style={{ height: 420 }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-card">
              <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 130, center: [10, 15] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup zoom={1} minZoom={0.6} maxZoom={8}>
              {/* Países */}
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1A1A2E"
                      stroke="#2A2A45"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover:   { outline: 'none', fill: '#22223A' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Puntos */}
              {points.map(point => {
                const color = PROF_COLORS[point.profession] ?? '#00C897'
                const isHovered = tooltip?.point?.id === point.id
                return (
                  <Marker
                    key={point.id}
                    coordinates={[point.lng, point.lat]}
                    onMouseEnter={() => setTooltip({ point })}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setTooltip(t => t?.point?.id === point.id ? null : { point })}
                  >
                    {/* Anillo exterior si está hovered */}
                    {isHovered && (
                      <circle r={10} fill={color} fillOpacity={0.2} />
                    )}
                    <circle
                      r={isHovered ? 5 : 3.5}
                      fill={color}
                      fillOpacity={0.9}
                      stroke="#0F0F1A"
                      strokeWidth={0.8}
                      style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                    />
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip fijo arriba a la derecha */}
          {tooltip?.point && (
            <div className="absolute top-3 right-3 bg-dark-input/95 backdrop-blur-sm border border-dark-border rounded-xl p-3 shadow-2xl min-w-[170px] animate-fade-in pointer-events-none">
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: PROF_COLORS[tooltip.point.profession] ?? '#00C897' }}
                />
                <span
                  className="text-xs font-bold truncate"
                  style={{ color: PROF_COLORS[tooltip.point.profession] ?? '#00C897' }}
                >
                  {tooltip.point.profession}
                </span>
              </div>
              <p className="text-xl font-extrabold text-white leading-none mb-1">
                {formatIncome(tooltip.point.income, tooltip.point.currency)}
              </p>
              <p className="text-xs text-white/50">
                📍 {tooltip.point.city}{tooltip.point.city ? ', ' : ''}{tooltip.point.country}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {tooltip.point.experience} de experiencia
              </p>
            </div>
          )}
        </div>

        {/* Leyenda de colores */}
        <div className="px-4 py-2.5 border-t border-dark-border flex items-center gap-3 flex-wrap">
          {Object.entries(PROF_COLORS).filter(([k]) => k !== 'Global').slice(0, 6).map(([prof, color]) => (
            <span key={prof} className="flex items-center gap-1 text-xs text-white/35">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              {prof.split('/')[0].trim()}
            </span>
          ))}
        </div>
      </div>

      {/* ── LISTA POR PAÍS ─────────────────────────────── */}
      {countries.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-white text-sm px-1">
            Sueldos por país
            <span className="ml-2 text-xs text-white/30 font-normal">{points.length} reportes en total</span>
          </h2>

          {countries.map(([country, salaries]) => {
            const isOpen = expandedCountry === country
            return (
              <div key={country} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">

                {/* Cabecera del país — clickeable */}
                <button
                  onClick={() => setExpandedCountry(isOpen ? null : country)}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{countryFlag(country)}</span>
                    <span className="font-bold text-white text-sm">{country}</span>
                    <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full font-medium">
                      {salaries.length} {salaries.length === 1 ? 'sueldo' : 'sueldos'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Promedio rápido */}
                    <span className="text-xs text-white/40 hidden sm:block">
                      Prom: {formatIncome(
                        salaries.reduce((s, p) => s + p.income, 0) / salaries.length,
                        salaries[0]?.currency
                      )}
                    </span>
                    <span className={`text-brand-green transition-transform text-xs ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </button>

                {/* Lista de sueldos expandible */}
                {isOpen && (
                  <div className="border-t border-dark-border divide-y divide-dark-border">
                    {salaries.map((p, i) => {
                      const color = PROF_COLORS[p.profession] ?? '#9E9E9E'
                      return (
                        <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/3 transition-colors animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
                          {/* Número */}
                          <span className="text-xs text-white/20 w-5 text-right flex-shrink-0">{i + 1}</span>

                          {/* Dot de profesión */}
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold" style={{ color }}>{p.profession}</span>
                            {p.city && p.city !== 'Sin especificar' && (
                              <span className="text-xs text-white/30 ml-1.5">· {p.city}</span>
                            )}
                          </div>

                          {/* Experiencia */}
                          <span className="text-xs text-white/25 hidden sm:block flex-shrink-0">{p.experience}</span>

                          {/* Sueldo */}
                          <span className="text-sm font-extrabold flex-shrink-0" style={{ color }}>
                            {formatIncome(p.income, p.currency)}
                          </span>
                        </div>
                      )
                    })}

                    {/* Total / promedio al final */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-white/3">
                      <span className="text-xs text-white/30">Promedio de {salaries.length} reportes</span>
                      <span className="text-sm font-extrabold text-brand-green">
                        {formatIncome(
                          salaries.reduce((s, p) => s + p.income, 0) / salaries.length,
                          salaries[0]?.currency
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Emoji de bandera por país
function countryFlag(country) {
  const flags = {
    'Argentina':      '🇦🇷', 'Brasil':        '🇧🇷', 'Chile':         '🇨🇱',
    'Colombia':       '🇨🇴', 'México':        '🇲🇽', 'Uruguay':       '🇺🇾',
    'Perú':           '🇵🇪', 'Bolivia':       '🇧🇴', 'Paraguay':      '🇵🇾',
    'Ecuador':        '🇪🇨', 'España':        '🇪🇸', 'Estados Unidos':'🇺🇸',
    'Otro':           '🌍', 'Desconocido':   '🌍',
  }
  return flags[country] ?? '🌍'
}
