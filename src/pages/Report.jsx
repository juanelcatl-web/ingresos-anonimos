// src/pages/Report.jsx — v2.1
// Formulario con límite de 3 reportes + buscador de ciudad + profesión personalizada

import { useState, useEffect } from 'react'
import { submitReport } from '../services/firestore'
import { getApproxLocation } from '../services/geo'
import { canReport, getRemainingReports, registerReport, getNextResetDate } from '../services/reportLimit'
import { PROFESSIONS, EXPERIENCE, CURRENCIES, COUNTRIES } from '../constants'
import { Button, Select } from '../components/UI'
import CitySearchInput from '../components/CitySearchInput'

const INITIAL = {
  income: '', currency: 'USD', country: 'Argentina',
  city: '', profession: 'Desarrollador/a', customProfession: '',
  experience: '1-3 años', lat: null, lng: null
}

export default function Report({ onNavigate }) {
  const [form,      setForm]      = useState(INITIAL)
  const [errors,    setErrors]    = useState({})
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [remaining, setRemaining] = useState(getRemainingReports())

  useEffect(() => {
    getApproxLocation().then(geo => {
      if (geo.country) {
        setForm(f => ({
          ...f,
          country: COUNTRIES.includes(geo.country) ? geo.country : f.country,
        }))
      }
    })
  }, [])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  // La profesión real a guardar: si eligió "Otro" usa el campo libre
  const getFinalProfession = () => {
    if (form.profession === 'Otro') {
      return form.customProfession.trim() || 'Otro'
    }
    return form.profession
  }

  const validate = () => {
    const errs = {}
    if (!form.income || isNaN(Number(form.income)) || Number(form.income) <= 0)
      errs.income = 'Ingresá un monto válido'
    if (Number(form.income) > 99_999_999)
      errs.income = 'Monto demasiado grande'
    if (!form.country)    errs.country    = 'Seleccioná un país'
    if (!form.profession) errs.profession = 'Seleccioná tu profesión'
    if (!form.experience) errs.experience = 'Seleccioná tu experiencia'
    if (form.profession === 'Otro' && !form.customProfession.trim())
      errs.customProfession = 'Escribí tu profesión'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!canReport()) return
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await submitReport({ ...form, profession: getFinalProfession() })
      registerReport()
      setRemaining(getRemainingReports())
      setSubmitted(true)
    } catch {
      setErrors({ general: 'Error al enviar. Verificá tu conexión.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Límite alcanzado ───────────────────────────────────────
  if (!canReport() && !submitted) {
    const reset = getNextResetDate()
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4 animate-fade-in">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-extrabold text-white">Límite alcanzado</h2>
        <p className="text-white/50 max-w-xs leading-relaxed text-sm">
          Para mantener la integridad de los datos, cada dispositivo puede reportar un máximo de{' '}
          <strong className="text-white">3 veces</strong> cada 30 días.
        </p>
        {reset && (
          <div className="bg-dark-card border border-dark-border rounded-xl px-5 py-3 text-sm">
            <span className="text-white/40">Próximo reporte disponible el </span>
            <span className="text-brand-green font-bold">
              {reset.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
            </span>
          </div>
        )}
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          Ver el dashboard
        </Button>
      </div>
    )
  }

  // ── Éxito ──────────────────────────────────────────────────
  if (submitted) return (
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-5 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-4xl shadow-2xl shadow-brand-green/30">
        ✅
      </div>
      <h2 className="text-2xl font-extrabold text-white">¡Reporte enviado!</h2>
      <p className="text-white/50 max-w-xs leading-relaxed text-sm">
        Gracias por contribuir. Tu punto ya va a aparecer en el mapa en los próximos minutos.
      </p>
      {remaining > 0 && (
        <p className="text-xs text-white/30">
          Te {remaining === 1 ? 'queda' : 'quedan'}{' '}
          <span className="text-brand-green font-bold">{remaining}</span>{' '}
          reporte{remaining > 1 ? 's' : ''} disponible{remaining > 1 ? 's' : ''} este mes.
        </p>
      )}
      <div className="flex gap-3">
        {remaining > 0 && (
          <Button onClick={() => { setSubmitted(false); setForm(INITIAL) }} variant="outline">
            Reportar otro
          </Button>
        )}
        <Button onClick={() => onNavigate('dashboard')}>Ver dashboard</Button>
      </div>
    </div>
  )

  // ── Formulario ─────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-28 sm:pb-8">

      {/* Banner */}
      <div className="flex items-start gap-3 bg-brand-green/10 border border-brand-green/20 rounded-2xl p-4 mb-6">
        <span className="text-2xl">🔒</span>
        <div className="flex-1">
          <p className="font-bold text-brand-green text-sm">Datos 100% anónimos</p>
          <p className="text-white/50 text-xs mt-0.5">Sin login · Sin tracking · Sin datos personales.</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-white/30">Reportes restantes</p>
          <p className="text-lg font-extrabold" style={{ color: remaining === 1 ? '#F7971E' : '#00C897' }}>
            {remaining}/3
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Ingreso + Moneda */}
        <div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">💰 Ingreso neto mensual</p>
          <div className="flex gap-2">
            <div className="w-28">
              <Select value={form.currency} onChange={v => set('currency', v)} options={CURRENCIES} />
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="ej: 2500"
                value={form.income}
                onChange={e => set('income', e.target.value)}
                min="0"
                step="any"
                className={`w-full bg-dark-input border ${errors.income ? 'border-red-500/60' : 'border-dark-border'} text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors`}
                style={{ fontSize: 16 }}
              />
              {errors.income && <p className="text-xs text-red-400 mt-1">{errors.income}</p>}
            </div>
          </div>
        </div>

        {/* País */}
        <Select
          label="🌍 País"
          value={form.country}
          onChange={v => set('country', v)}
          options={COUNTRIES}
        />

        {/* Ciudad */}
        <div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">📍 Ciudad</p>
          <CitySearchInput
            value={{ city: form.city }}
            onChange={(city, country) => {
              set('city', city)
              if (country && COUNTRIES.includes(country)) set('country', country)
            }}
            onCoordsChange={(lat, lng) => setForm(f => ({ ...f, lat, lng }))}
          />
          {form.lat && (
            <p className="text-xs text-brand-green/60 mt-1">✓ Coordenadas detectadas — aparecerás en el mapa</p>
          )}
        </div>

        {/* Profesión */}
        <div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">💼 Profesión / Rubro</p>
          <Select
            value={form.profession}
            onChange={v => set('profession', v)}
            options={PROFESSIONS}
          />

          {/* Campo libre cuando eligen "Otro" */}
          {form.profession === 'Otro' && (
            <div className="mt-2 animate-fade-in">
              <input
                type="text"
                placeholder="ej: Contador, Abogado, Chef, Músico..."
                value={form.customProfession}
                onChange={e => set('customProfession', e.target.value)}
                maxLength={50}
                className={`w-full bg-dark-input border ${errors.customProfession ? 'border-red-500/60' : 'border-brand-green/30'} text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors`}
                style={{ fontSize: 16 }}
                autoFocus
              />
              {errors.customProfession && (
                <p className="text-xs text-red-400 mt-1">{errors.customProfession}</p>
              )}
              <p className="text-xs text-white/30 mt-1">{form.customProfession.length}/50 caracteres</p>
            </div>
          )}
        </div>

        {/* Experiencia */}
        <div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">📅 Años de experiencia</p>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE.map(exp => (
              <button
                key={exp}
                type="button"
                onClick={() => set('experience', exp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  form.experience === exp
                    ? 'bg-brand-green/20 text-brand-green border-brand-green/40'
                    : 'bg-dark-input text-white/50 border-dark-border hover:border-white/20'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {errors.general && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {errors.general}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full justify-center text-base py-4">
          🚀 Reportar Anónimamente
        </Button>

        <p className="text-center text-xs text-white/25">
          Máximo 3 reportes por dispositivo cada 30 días · Auto-borrado en 30 días
        </p>
      </form>
    </div>
  )
}
