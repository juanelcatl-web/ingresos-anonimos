// src/pages/About.jsx
import { useState } from 'react'

const INFO = [
  { icon: '🔒', color: '#00C897', title: '100% Anónimo', body: 'Sin login, sin cuenta, sin email. Cada reporte es un registro aislado con solo campos generales y timestamp. Nadie puede rastrear quién reportó qué.' },
  { icon: '📍', color: '#7C4DFF', title: 'Geo aproximada por IP', body: 'Usamos ip-api.com para detectar ciudad y país de forma aproximada. Nunca accedemos al GPS del dispositivo. Solo guardamos el nombre de la ciudad.' },
  { icon: '🗑️', color: '#F7971E', title: 'Auto-borrado en 30 días', body: 'Los reportes individuales se eliminan automáticamente a los 30 días. Solo permanecen los promedios agregados, que nunca identifican a nadie.' },
  { icon: '📊', color: '#007BFF', title: 'Estadísticas reales', body: 'Los promedios se recalculan cada 5 minutos por Cloud Functions. Nunca se pueden ver reportes individuales desde el dashboard, solo agregados.' },
]

const FAQ = [
  { q: '¿Mis datos son realmente anónimos?', a: 'Sí. No existe ningún User ID, cookie de tracking, ni dato personal. Solo guardamos: ingreso, moneda, país, ciudad, profesión, experiencia y timestamp.' },
  { q: '¿Por qué necesitan la ciudad?', a: 'Para comparar salarios por región. Solo guardamos el nombre de la ciudad (ej: "Tandil"), sin coordenadas ni dirección exacta.' },
  { q: '¿Cada cuánto se actualizan los promedios?', a: 'Cada 5 minutos mediante Cloud Functions. El dashboard se actualiza en tiempo real gracias a Firestore.' },
  { q: '¿Puedo reportar en ARS y en USD?', a: 'Sí. Podés elegir la moneda al reportar. Los promedios se agrupan por moneda para no mezclar valores.' },
  { q: '¿Quién puede ver mi reporte individual?', a: 'Nadie. Las reglas de Firestore bloquean la lectura de reportes individuales. Solo las Cloud Functions con acceso de administrador los procesan para calcular promedios.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-dark-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-white hover:bg-white/5 transition-colors"
      >
        {q}
        <span className={`text-brand-green transition-transform flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-white/50 leading-relaxed border-t border-dark-border pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 sm:pb-8 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-brand-green/20 via-brand-purple/10 to-brand-blue/10 border border-brand-green/20 text-center">
        <div className="text-5xl mb-3">📈</div>
        <h1 className="text-2xl font-extrabold text-white">IncomeAnon</h1>
        <p className="text-white/40 text-sm mt-1">Ingresos Anónimos · v1.0.0</p>
        <p className="text-white/60 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Una plataforma comunitaria para compartir y comparar ingresos de forma completamente anónima.
        </p>
      </div>

      {/* Cards de info */}
      <div className="space-y-3">
        {INFO.map(item => (
          <div
            key={item.title}
            className="flex gap-4 p-4 rounded-2xl border"
            style={{ background: `${item.color}10`, borderColor: `${item.color}25` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${item.color}20` }}
            >
              {item.icon}
            </div>
            <div>
              <p className="font-bold text-white text-sm mb-1" style={{ color: item.color }}>{item.title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stack técnico */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
        <p className="font-bold text-white text-sm mb-3">🛠 Stack técnico</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Frontend', 'React + Vite + Tailwind'],
            ['Backend', 'Firebase Firestore'],
            ['Functions', 'Cloud Functions Node.js'],
            ['Geo', 'ip-api.com (solo ciudad)'],
            ['Charts', 'Recharts'],
            ['PWA', 'Vite PWA Plugin'],
          ].map(([k, v]) => (
            <div key={k} className="bg-dark-input rounded-xl px-3 py-2">
              <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider">{k}</p>
              <p className="text-xs text-white/70 font-medium mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-bold text-white text-sm mb-3">❓ Preguntas frecuentes</h2>
        <div className="space-y-2">
          {FAQ.map(item => <FaqItem key={item.q} {...item} />)}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-white/25 pb-2">
        Hecho con ❤️ en Tandil, Buenos Aires 🇦🇷 · MIT License
      </p>
    </div>
  )
}
