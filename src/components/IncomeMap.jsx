// src/components/IncomeMap.jsx
// Mapa mundi con puntos en tiempo real — un punto por reporte anónimo
// Usa react-simple-maps + datos de la colección 'mappoints' (actualizada por Cloud Function)

import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { collection, onSnapshot, limit, query, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'
import { formatIncome } from '../services/firestore'
import { PROF_COLORS } from '../constants'

// GeoJSON del mundo — usamos el CDN de react-simple-maps
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Coordenadas aproximadas por ciudad (fallback si no hay coords en el reporte)
const CITY_COORDS = {
  'Buenos Aires': [-58.38, -34.60], 'Córdoba': [-64.18, -31.42],
  'Rosario': [-60.64, -32.94], 'Tandil': [-59.13, -37.32],
  'Mendoza': [-68.83, -32.89], 'Tucumán': [-65.21, -26.82],
  'São Paulo': [-46.63, -23.55], 'Rio de Janeiro': [-43.17, -22.90],
  'Santiago': [-70.65, -33.45], 'Lima': [-77.04, -12.04],
  'Bogotá': [-74.08, 4.71], 'Ciudad de México': [-99.13, 19.43],
  'Montevideo': [-56.16, -34.90], 'Madrid': [-3.70, 40.42],
  'Barcelona': [2.15, 41.38], 'New York': [-74.00, 40.71],
  'Miami': [-80.19, 25.77], 'Los Angeles': [-118.24, 34.05],
}

export default function IncomeMap() {
  const [points,   setPoints]   = useState([])
  const [tooltip,  setTooltip]  = useState(null) // { x, y, data }
  const [loading,  setLoading]  = useState(true)

  // Suscripción en tiempo real a los últimos 200 reportes con coordenadas
  useEffect(() => {
    const q = query(
      collection(db, 'mappoints'),
      orderBy('timestamp', 'desc'),
      limit(200)
    )
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.lat && p.lng) // solo los que tienen coords
      setPoints(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-dark-border bg-dark-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">🌍 Mapa en tiempo real</span>
          <span className="flex items-center gap-1 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse inline-block" />
            {points.length} reportes visibles
          </span>
        </div>
        <span className="text-xs text-white/30">Ubicación aproximada por ciudad</span>
      </div>

      {/* Mapa */}
      <div className="relative" style={{ height: 320 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [0, 20] }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={6}>
            {/* Países */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1E1E30"
                    stroke="#2A2A45"
                    strokeWidth={0.5}
                    style={{
                      default:  { outline: 'none' },
                      hover:    { outline: 'none', fill: '#252540' },
                      pressed:  { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Puntos de reportes */}
            {points.map(point => {
              const color = PROF_COLORS[point.profession] ?? '#00C897'
              return (
                <Marker
                  key={point.id}
                  coordinates={[point.lng, point.lat]}
                  onMouseEnter={(evt) => {
                    setTooltip({ x: evt.clientX, y: evt.clientY, data: point })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => setTooltip(t => t?.data?.id === point.id ? null : { x: 0, y: 0, data: point })}
                >
                  {/* Anillo exterior animado */}
                  <circle r={6} fill={color} fillOpacity={0.15} />
                  {/* Punto central */}
                  <circle
                    r={3}
                    fill={color}
                    fillOpacity={0.9}
                    stroke="#0F0F1A"
                    strokeWidth={0.8}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip flotante */}
        {tooltip && tooltip.data && (
          <MapTooltip data={tooltip.data} onClose={() => setTooltip(null)} />
        )}
      </div>

      {/* Leyenda */}
      <div className="px-4 py-2 border-t border-dark-border flex items-center gap-2 flex-wrap">
        <span className="text-xs text-white/30">Profesiones:</span>
        {Object.entries(PROF_COLORS).slice(0, 5).map(([prof, color]) => (
          <span key={prof} className="flex items-center gap-1 text-xs text-white/40">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {prof.split('/')[0].trim()}
          </span>
        ))}
      </div>
    </div>
  )
}

// Tooltip que aparece al hacer hover/click en un punto
function MapTooltip({ data, onClose }) {
  return (
    <div
      className="absolute top-4 right-4 bg-dark-input border border-dark-border rounded-xl p-3 shadow-2xl z-10 min-w-[180px] animate-fade-in"
      onClick={onClose}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-bold"
          style={{ color: PROF_COLORS[data.profession] ?? '#00C897' }}
        >
          {data.profession}
        </span>
        <button onClick={onClose} className="text-white/30 hover:text-white text-xs">✕</button>
      </div>
      <p className="text-lg font-extrabold text-white">
        {formatIncome(data.income, data.currency)}
      </p>
      <p className="text-xs text-white/40 mt-1">
        📍 {data.city}, {data.country}
      </p>
      <p className="text-xs text-white/30 mt-0.5">
        {data.experience} de experiencia
      </p>
    </div>
  )
}
