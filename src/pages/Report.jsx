// src/pages/Report.jsx
import { useState, useEffect } from 'react'
import { submitReport } from '../services/firestore'
import { getApproxLocation } from '../services/geo'
import { PROFESSIONS, EXPERIENCE, CURRENCIES, COUNTRIES } from '../constants'
import { Button, Input, Select } from '../components/UI'

const INITIAL = {
  income: '', currency: 'USD', country: 'Argentina',
  city: '', profession: 'Desarrollador/a', experience: '1-3 años'
}

export default function Report({ onNavigate }) {
  const [form,       setForm]       = useState(INITIAL)
  const [errors,     setErrors]     = useState({})
  const [loading,    setLoading]    = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [geoLoading, setGeoLoading] = useState(true)

  // Autodetectar ubicación
  useEffect(() => {
    getApproxLocation().then(geo => {
      if (geo.country) {
        setForm(f => ({
          ...f,
          country: COUNTRIES.includes(geo.country) ? geo.country : f.country,
          city: geo.city || ''
        }))
      }
      setGeoLoading(false)
    })
  }, [])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.income || isNaN(Number(form.income)) || Number(form.income) <= 0)
      errs.income = 'Ingresá un monto válido'
    if (Number(form.income) > 99_999_999)
      errs.income = 'Monto demasiado grande'
    if (!form.country) errs.country = 'Seleccioná un país'
    if (!form.profession) errs.profession = 'Seleccioná tu profesión'
    if (!form.experience) errs.experience = 'Seleccioná tu experiencia'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await submitReport(form)
      setSubmitted(true)
    } catch {
      setErrors({ general: 'Error al enviar. Verificá tu conexión.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Pantalla de éxito ───────────────────────────────────────
  if (submitted) return (
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-5 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-4xl shadow-2xl shadow-brand-green/30 animate-slide-up">
        ✅
      </div>
      <h2 className="text-2xl font-extrabold text-white">¡Reporte enviado!</h2>
      <p className="text-white/50 max-w-xs leading-relaxed">
        Gracias por contribuir. Tu reporte anónimo ya está siendo procesado y aparecerá en el dashboard en los próximos minutos.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => { setSubmitted(false); setForm(INITIAL) }} variant="outline">
          Reportar otro
        </Button>
        <Button onClick={() => onNavigate('dashboard')}>
          Ver dashboard
        </Button>
      </div>
    </div>
  )

  // ── Formulario ──────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-28 sm:pb-8">

      {/* Banner de anonimato */}
      <div className="flex items-start gap-3 bg-brand-green/10 border border-brand-green/20 rounded-2xl p-4 mb-6 animate-fade-in">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="font-bold text-brand-green text-sm">Datos 100% anónimos</p>
          <p className="text-white/50 text-xs mt-0.5">Sin login · Sin cookies de tracking · Sin datos personales. Ayudá a crear estadísticas reales.</p>
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
              <Input
                type="number"
                placeholder="ej: 2500"
                value={form.income}
                onChange={e => set('income', e.target.value)}
                error={errors.income}
                min="0"
                step="any"
              />
            </div>
          </div>
        </div>

        {/* País */}
        <Select
          label="🌍 País"
          value={form.country}
          onChange={v => set('country', v)}
          options={COUNTRIES}
          error={errors.country}
        />

        {/* Ciudad */}
        <Input
          label="📍 Ciudad / Provincia (opcional)"
          placeholder="ej: Tandil, Buenos Aires"
          value={form.city}
          onChange={e => set('city', e.target.value)}
          helper={geoLoading ? '📡 Detectando ubicación...' : 'Solo guardamos ciudad, sin precisión.'}
        />

        {/* Profesión */}
        <Select
          label="💼 Profesión / Rubro"
          value={form.profession}
          onChange={v => set('profession', v)}
          options={PROFESSIONS}
          error={errors.profession}
        />

        {/* Experiencia — chips */}
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
                    : 'bg-dark-input text-white/50 border-dark-border hover:border-white/20 hover:text-white/70'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
          {errors.experience && <p className="text-xs text-red-400 mt-1">{errors.experience}</p>}
        </div>

        {/* Error general */}
        {errors.general && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {errors.general}
          </p>
        )}

        {/* Botón enviar */}
        <Button type="submit" loading={loading} className="w-full justify-center text-base py-4">
          🚀 Reportar Anónimamente
        </Button>

        <p className="text-center text-xs text-white/25">
          Sin cookies · Sin tracking · Sin login · Auto-borrado en 30 días
        </p>
      </form>
    </div>
  )
}
