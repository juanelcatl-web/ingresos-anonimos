// src/pages/WorldSalaries.jsx
// Tabla de salarios promedio mundiales — datos 2025
// Fuentes: CEOWORLD, Numbeo, Bloomberg Línea, OIT, Jobint

import { useState } from 'react'

const REGIONS = ['Todos', 'Latinoamérica', 'Europa', 'Norteamérica', 'Asia / Oceanía', 'Medio Oriente / África']

// Datos 2025 — salario neto mensual promedio
// Fuentes: CEOWORLD Salary Index 2025, Numbeo, Bloomberg Línea, OIT
const COUNTRIES = [
  // ── LATINOAMÉRICA ────────────────────────────────────────
  { country: 'Argentina',        flag: '🇦🇷', region: 'Latinoamérica', currency: 'ARS', symbol: '$',   localAvg: 1_350_000, usdAvg: 1_100,  note: 'Salario promedio registrado privado (oct 2025)' },
  { country: 'Brasil',           flag: '🇧🇷', region: 'Latinoamérica', currency: 'BRL', symbol: 'R$',  localAvg: 3_200,     usdAvg: 620,   note: 'Salario promedio formal' },
  { country: 'Chile',            flag: '🇨🇱', region: 'Latinoamérica', currency: 'CLP', symbol: '$',   localAvg: 1_030_000, usdAvg: 1_100,  note: 'Ingreso medio mensual' },
  { country: 'Colombia',         flag: '🇨🇴', region: 'Latinoamérica', currency: 'COP', symbol: '$',   localAvg: 3_100_000, usdAvg: 750,   note: 'Salario promedio urbano' },
  { country: 'México',           flag: '🇲🇽', region: 'Latinoamérica', currency: 'MXN', symbol: '$',   localAvg: 13_200,    usdAvg: 660,   note: 'Salario promedio formal IMSS' },
  { country: 'Uruguay',          flag: '🇺🇾', region: 'Latinoamérica', currency: 'UYU', symbol: '$U',  localAvg: 38_000,    usdAvg: 900,   note: 'Salario medio mensual' },
  { country: 'Perú',             flag: '🇵🇪', region: 'Latinoamérica', currency: 'PEN', symbol: 'S/',  localAvg: 3_300,     usdAvg: 889,   note: 'Ingreso laboral promedio urbano' },
  { country: 'Ecuador',          flag: '🇪🇨', region: 'Latinoamérica', currency: 'USD', symbol: 'US$', localAvg: 860,       usdAvg: 860,   note: 'Dolarizado — salario promedio' },
  { country: 'Bolivia',          flag: '🇧🇴', region: 'Latinoamérica', currency: 'BOB', symbol: 'Bs',  localAvg: 2_750,     usdAvg: 398,   note: 'Salario mínimo oficial 2025' },
  { country: 'Paraguay',         flag: '🇵🇾', region: 'Latinoamérica', currency: 'PYG', symbol: '₲',  localAvg: 2_800_000, usdAvg: 397,   note: 'Salario mínimo mensual' },
  { country: 'Costa Rica',       flag: '🇨🇷', region: 'Latinoamérica', currency: 'CRC', symbol: '₡',  localAvg: 545_000,   usdAvg: 1_047, note: 'Salario promedio sector formal' },
  { country: 'Panamá',           flag: '🇵🇦', region: 'Latinoamérica', currency: 'USD', symbol: 'US$', localAvg: 1_047,     usdAvg: 1_047, note: 'Dolarizado — salario promedio' },
  { country: 'Venezuela',        flag: '🇻🇪', region: 'Latinoamérica', currency: 'USD', symbol: 'US$', localAvg: 190,       usdAvg: 190,   note: 'Estimación sector privado' },

  // ── EUROPA ────────────────────────────────────────────────
  { country: 'Suiza',            flag: '🇨🇭', region: 'Europa',        currency: 'CHF', symbol: 'Fr',  localAvg: 7_500,     usdAvg: 8_218, note: 'Salario neto mensual más alto del mundo' },
  { country: 'Luxemburgo',       flag: '🇱🇺', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 6_200,     usdAvg: 6_740, note: 'Segundo salario más alto de Europa' },
  { country: 'Noruega',          flag: '🇳🇴', region: 'Europa',        currency: 'NOK', symbol: 'kr',  localAvg: 62_000,    usdAvg: 5_772, note: 'Alta carga impositiva, gran bienestar social' },
  { country: 'Dinamarca',        flag: '🇩🇰', region: 'Europa',        currency: 'DKK', symbol: 'kr',  localAvg: 39_000,    usdAvg: 5_749, note: 'Salario neto tras impuestos' },
  { country: 'Islandia',         flag: '🇮🇸', region: 'Europa',        currency: 'ISK', symbol: 'kr',  localAvg: 900_000,   usdAvg: 6_548, note: 'Fuerte demanda laboral en turismo y pesca' },
  { country: 'Irlanda',          flag: '🇮🇪', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 4_350,     usdAvg: 4_729, note: 'Hub tecnológico europeo' },
  { country: 'Países Bajos',     flag: '🇳🇱', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 4_300,     usdAvg: 4_688, note: 'Salario neto promedio' },
  { country: 'Alemania',         flag: '🇩🇪', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 3_500,     usdAvg: 3_810, note: 'Mayor economía de Europa' },
  { country: 'Francia',          flag: '🇫🇷', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 2_800,     usdAvg: 3_050, note: 'Neto tras cotizaciones sociales' },
  { country: 'España',           flag: '🇪🇸', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 2_100,     usdAvg: 2_290, note: 'Salario medio neto anual / 12' },
  { country: 'Polonia',          flag: '🇵🇱', region: 'Europa',        currency: 'PLN', symbol: 'zł',  localAvg: 7_800,     usdAvg: 1_950, note: 'Mayor crecimiento salarial de Europa (+95% en 5 años)' },
  { country: 'Portugal',         flag: '🇵🇹', region: 'Europa',        currency: 'EUR', symbol: '€',   localAvg: 1_550,     usdAvg: 1_690, note: 'Creciente destino de nómadas digitales' },

  // ── NORTEAMÉRICA ──────────────────────────────────────────
  { country: 'Estados Unidos',   flag: '🇺🇸', region: 'Norteamérica',  currency: 'USD', symbol: 'US$', localAvg: 6_562,     usdAvg: 6_562, note: 'Salario neto promedio tras impuestos' },
  { country: 'Canadá',           flag: '🇨🇦', region: 'Norteamérica',  currency: 'CAD', symbol: 'C$',  localAvg: 7_100,     usdAvg: 5_188, note: 'Salario medio neto mensual' },

  // ── ASIA / OCEANÍA ────────────────────────────────────────
  { country: 'Singapur',         flag: '🇸🇬', region: 'Asia / Oceanía', currency: 'SGD', symbol: 'S$',  localAvg: 6_000,     usdAvg: 4_457, note: 'Sistema fiscal muy favorable' },
  { country: 'Australia',        flag: '🇦🇺', region: 'Asia / Oceanía', currency: 'AUD', symbol: 'A$',  localAvg: 6_700,     usdAvg: 4_325, note: 'Salario medio neto mensual' },
  { country: 'Japón',            flag: '🇯🇵', region: 'Asia / Oceanía', currency: 'JPY', symbol: '¥',   localAvg: 350_000,   usdAvg: 2_350, note: 'Yen depreciado impacta en USD' },
  { country: 'Corea del Sur',    flag: '🇰🇷', region: 'Asia / Oceanía', currency: 'KRW', symbol: '₩',   localAvg: 3_000_000, usdAvg: 2_250, note: 'Salario promedio sector formal' },
  { country: 'China',            flag: '🇨🇳', region: 'Asia / Oceanía', currency: 'CNY', symbol: '¥',   localAvg: 10_500,    usdAvg: 1_452, note: 'Gran disparidad ciudad/campo' },
  { country: 'India',            flag: '🇮🇳', region: 'Asia / Oceanía', currency: 'INR', symbol: '₹',   localAvg: 35_000,    usdAvg: 420,   note: 'Sector tech muy por encima del promedio' },

  // ── MEDIO ORIENTE / ÁFRICA ────────────────────────────────
  { country: 'Qatar',            flag: '🇶🇦', region: 'Medio Oriente / África', currency: 'QAR', symbol: 'ر.ق', localAvg: 14_300, usdAvg: 3_937, note: 'Sin impuesto a la renta personal' },
  { country: 'Emiratos Árabes',  flag: '🇦🇪', region: 'Medio Oriente / África', currency: 'AED', symbol: 'د.إ', localAvg: 13_800, usdAvg: 3_770, note: 'Dubai / Abu Dhabi — expatriados incluidos' },
  { country: 'Israel',           flag: '🇮🇱', region: 'Medio Oriente / África', currency: 'ILS', symbol: '₪',  localAvg: 14_000, usdAvg: 3_715, note: 'Fuerte sector tecnológico (Silicon Wadi)' },
  { country: 'Sudáfrica',        flag: '🇿🇦', region: 'Medio Oriente / África', currency: 'ZAR', symbol: 'R',  localAvg: 22_000, usdAvg: 1_200, note: 'Gran desigualdad salarial interna' },
]

function formatLocal(value, symbol) {
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `${symbol}${(value / 1_000).toFixed(0)}K`
  return `${symbol}${value.toLocaleString('es-AR')}`
}

function formatUSD(value) {
  return `US$${value.toLocaleString('es-AR')}`
}

// Color por rango de salario USD
function salaryColor(usd) {
  if (usd >= 5_000) return '#00C897'
  if (usd >= 2_000) return '#7C4DFF'
  if (usd >= 1_000) return '#007BFF'
  if (usd >= 500)   return '#F7971E'
  return '#FC466B'
}

function salaryBar(usd) {
  const max = 8_500
  return Math.min(100, Math.round((usd / max) * 100))
}

export default function WorldSalaries() {
  const [region,  setRegion]  = useState('Todos')
  const [search,  setSearch]  = useState('')
  const [sortDir, setSortDir] = useState('desc') // asc | desc

  const filtered = COUNTRIES
    .filter(c => region === 'Todos' || c.region === region)
    .filter(c => c.country.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === 'desc' ? b.usdAvg - a.usdAvg : a.usdAvg - b.usdAvg)

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 sm:pb-8 space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white">🌍 Salarios promedio mundiales 2025</h1>
        <p className="text-white/40 text-xs mt-1">
          Salario neto mensual promedio en moneda local y equivalente en USD.
          Fuentes: CEOWORLD, Numbeo, Bloomberg Línea, OIT · Actualizado 2025.
        </p>
      </div>

      {/* Buscador + orden */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar país..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-dark-input border border-dark-border text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green/60"
          style={{ fontSize: 16 }}
        />
        <button
          onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="bg-dark-input border border-dark-border rounded-xl px-3 py-2.5 text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
        >
          {sortDir === 'desc' ? '↓ Mayor' : '↑ Menor'}
        </button>
      </div>

      {/* Filtros de región */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {REGIONS.map(r => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              region === r
                ? 'bg-brand-green/20 text-brand-green border-brand-green/40'
                : 'bg-dark-input text-white/40 border-dark-border hover:text-white/70'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Contador */}
      <p className="text-xs text-white/30">{filtered.length} países</p>

      {/* Tabla */}
      <div className="space-y-2">
        {filtered.map((c, i) => {
          const color = salaryColor(c.usdAvg)
          const pct   = salaryBar(c.usdAvg)
          return (
            <div
              key={c.country}
              className="bg-dark-card border border-dark-border rounded-2xl p-4 animate-fade-in hover:border-white/10 transition-colors"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                {/* País */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl flex-shrink-0">{c.flag}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm">{c.country}</p>
                    <p className="text-xs text-white/30 truncate">{c.note}</p>
                  </div>
                </div>

                {/* Salarios */}
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-base" style={{ color }}>
                    {formatUSD(c.usdAvg)}
                  </p>
                  <p className="text-xs text-white/35">
                    {formatLocal(c.localAvg, c.symbol)} {c.currency}
                  </p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: color, opacity: 0.7 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-xs text-white/35 leading-relaxed">
        <p className="font-semibold text-white/50 mb-1">⚠️ Nota metodológica</p>
        Los valores corresponden al <strong className="text-white/50">salario neto mensual promedio</strong> (después de impuestos y deducciones) en moneda local y su equivalente en USD al tipo de cambio de mercado. No reflejan el poder adquisitivo real (PPA) ni la mediana salarial. Los datos son estimaciones basadas en fuentes oficiales y reportes de organismos internacionales. Pueden variar significativamente según sector, ciudad y nivel de experiencia.
      </div>
    </div>
  )
}
