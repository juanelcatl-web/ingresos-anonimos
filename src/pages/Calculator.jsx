// src/pages/Calculator.jsx
// Calculadora de poder adquisitivo — ¿cuánto equivale tu sueldo en otro país?
// Usa índice Big Mac / PPP simplificado con datos 2025

import { useState } from 'react'
import ShareButton from '../components/ShareButton'

// Índice de costo de vida relativo a USA = 100
// Fuente: Numbeo Cost of Living Index 2025
const COST_INDEX = {
  'Suiza':           132, 'Noruega':         118, 'Islandia':        115,
  'Dinamarca':       112, 'Luxemburgo':      110, 'Irlanda':         104,
  'Estados Unidos':  100, 'Países Bajos':     99, 'Australia':        97,
  'Canadá':           89, 'Alemania':         87, 'Singapur':         86,
  'Francia':          85, 'Japón':            81, 'Israel':           80,
  'Qatar':            78, 'Corea del Sur':    75, 'España':           72,
  'Emiratos Árabes':  71, 'Portugal':         62, 'Polonia':          55,
  'China':            47, 'Brasil':           44, 'Sudáfrica':        42,
  'Chile':            59, 'México':           45, 'Argentina':        38,
  'Costa Rica':       52, 'Panamá':           53, 'Colombia':         37,
  'Uruguay':          55, 'Ecuador':          40, 'Perú':             38,
  'India':            28, 'Bolivia':          32, 'Paraguay':         34,
  'Venezuela':        25,
}

const COUNTRIES = Object.keys(COST_INDEX).sort()

export default function Calculator() {
  const [salary,  setSalary]  = useState('')
  const [from,    setFrom]    = useState('Argentina')
  const [to,      setTo]      = useState('Estados Unidos')
  const [result,  setResult]  = useState(null)

  const calculate = () => {
    const s = parseFloat(salary)
    if (!s || s <= 0) return
    const fromIndex = COST_INDEX[from]
    const toIndex   = COST_INDEX[to]
    // Equivalencia de poder adquisitivo
    const equivalent = (s / fromIndex) * toIndex
    const diff       = ((equivalent - s) / s) * 100
    setResult({ equivalent, diff, from, to, salary: s })
  }

  const formatNum = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
    return Math.round(n).toLocaleString('es-AR')
  }

  const shareText = result
    ? `Mi sueldo de US$${formatNum(result.salary)} en ${result.from} equivale a US$${formatNum(result.equivalent)} en ${result.to} en poder adquisitivo real. Calculalo en IncomeAnon 👇`
    : ''

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 sm:pb-8 space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white">🧮 Calculadora de poder adquisitivo</h1>
        <p className="text-white/40 text-xs mt-1">
          ¿Cuánto equivale tu sueldo si vivieras en otro país? Basado en el índice de costo de vida Numbeo 2025.
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">

        {/* Sueldo */}
        <div>
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-2">
            💰 Tu sueldo mensual (USD)
          </label>
          <input
            type="number"
            placeholder="ej: 1500"
            value={salary}
            onChange={e => { setSalary(e.target.value); setResult(null) }}
            className="w-full bg-dark-input border border-dark-border text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors"
            style={{ fontSize: 16 }}
          />
        </div>

        {/* Desde / Hasta */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-2">🏠 Vivís en</label>
            <select
              value={from}
              onChange={e => { setFrom(e.target.value); setResult(null) }}
              className="w-full bg-dark-input border border-dark-border text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors appearance-none"
              style={{ fontSize: 16 }}
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-2">✈️ Te mudás a</label>
            <select
              value={to}
              onChange={e => { setTo(e.target.value); setResult(null) }}
              className="w-full bg-dark-input border border-dark-border text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors appearance-none"
              style={{ fontSize: 16 }}
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!salary || parseFloat(salary) <= 0}
          className="w-full bg-brand-green text-black font-bold py-3.5 rounded-xl text-sm hover:bg-brand-green/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calcular equivalencia
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-gradient-to-br from-brand-green/15 to-brand-blue/10 border border-brand-green/25 rounded-2xl p-5">

            <p className="text-xs text-white/50 mb-3 font-semibold uppercase tracking-wider">Resultado</p>

            <div className="flex items-center justify-between mb-4">
              {/* Origen */}
              <div className="text-center">
                <p className="text-xs text-white/40 mb-1">{result.from}</p>
                <p className="text-2xl font-extrabold text-white">US${formatNum(result.salary)}</p>
                <p className="text-xs text-white/30 mt-0.5">índice {COST_INDEX[result.from]}</p>
              </div>

              {/* Flecha */}
              <div className="text-2xl">→</div>

              {/* Destino */}
              <div className="text-center">
                <p className="text-xs text-white/40 mb-1">{result.to}</p>
                <p className="text-2xl font-extrabold text-brand-green">US${formatNum(result.equivalent)}</p>
                <p className="text-xs text-white/30 mt-0.5">índice {COST_INDEX[result.to]}</p>
              </div>
            </div>

            {/* Diferencia */}
            <div className={`rounded-xl px-4 py-3 text-center ${result.diff > 0 ? 'bg-brand-green/10 border border-brand-green/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <p className="text-sm font-bold" style={{ color: result.diff > 0 ? '#00C897' : '#FC466B' }}>
                {result.diff > 0 ? '📈' : '📉'} Tu poder adquisitivo {result.diff > 0 ? 'aumenta' : 'disminuye'} un {Math.abs(result.diff).toFixed(1)}%
              </p>
              <p className="text-xs text-white/40 mt-1">
                {result.diff > 0
                  ? `Vivir en ${result.to} te da más poder de compra por el mismo sueldo`
                  : `Vivir en ${result.to} te cuesta más caro que en ${result.from}`
                }
              </p>
            </div>
          </div>

          {/* Explicación */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-xs text-white/40 leading-relaxed">
            <p className="font-semibold text-white/60 mb-1">¿Cómo se calcula?</p>
            Este cálculo compara el índice de costo de vida entre países (Numbeo 2025). Un sueldo de US$1.000 en Argentina (índice 38) equivale en poder adquisitivo a US$2.632 en EE.UU. (índice 100), porque los precios en Argentina son un 62% más baratos.
          </div>

          {/* Compartir */}
          <ShareButton
            title="Calculadora de poder adquisitivo — IncomeAnon"
            text={shareText}
            url="https://ingresos-anonimos.web.app"
          />
        </div>
      )}

      {/* Tabla de índices */}
      <div>
        <h2 className="font-bold text-white text-sm mb-3">Índice de costo de vida por país</h2>
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-dark-border">
            {Object.entries(COST_INDEX)
              .sort((a, b) => b[1] - a[1])
              .map(([country, index]) => (
                <div key={country} className="flex items-center justify-between px-4 py-2.5 border-b border-dark-border hover:bg-white/3 transition-colors">
                  <span className="text-xs text-white/60 truncate">{country}</span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-green/60 rounded-full" style={{ width: `${index}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white/50 w-6 text-right">{index}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <p className="text-xs text-white/25 mt-2 text-center">EE.UU. = 100 · Fuente: Numbeo Cost of Living Index 2025</p>
      </div>
    </div>
  )
}
