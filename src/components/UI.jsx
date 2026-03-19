// src/components/UI.jsx
// Componentes reutilizables de UI

// ── Shimmer skeleton ──────────────────────────────────────────
export function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-dark-card rounded-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
    </div>
  )
}

// ── Card base ─────────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-dark-card border border-dark-border rounded-2xl ${onClick ? 'cursor-pointer hover:border-brand-green/40 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// ── Badge pequeño ─────────────────────────────────────────────
export function Badge({ children, color = 'green' }) {
  const colors = {
    green:  'bg-brand-green/15 text-brand-green',
    purple: 'bg-brand-purple/15 text-brand-purple',
    blue:   'bg-brand-blue/15 text-brand-blue',
    yellow: 'bg-yellow-400/15 text-yellow-400',
    gray:   'bg-white/10 text-white/60',
  }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  )
}

// ── Botón principal ───────────────────────────────────────────
export function Button({ children, onClick, loading, disabled, variant = 'primary', className = '' }) {
  const base = 'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:  'bg-brand-green text-black hover:bg-brand-green/90 active:scale-95',
    outline:  'border border-brand-green/40 text-brand-green hover:bg-brand-green/10 active:scale-95',
    ghost:    'text-white/60 hover:text-white hover:bg-white/5',
  }
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? <Spinner /> : children}
    </button>
  )
}

// ── Spinner pequeño ───────────────────────────────────────────
export function Spinner({ size = 'sm' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
  return <div className={`${s} border-2 border-current border-t-transparent rounded-full animate-spin`} />
}

// ── Select estilizado ─────────────────────────────────────────
export function Select({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-dark-input border border-dark-border text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors appearance-none cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  )
}

// ── Input estilizado ──────────────────────────────────────────
export function Input({ label, helper, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>}
      <input
        {...props}
        className={`bg-dark-input border ${error ? 'border-red-500/60' : 'border-dark-border'} text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors`}
      />
      {error  && <p className="text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="text-xs text-white/40">{helper}</p>}
    </div>
  )
}

// ── Dot "en vivo" ─────────────────────────────────────────────
export function LiveDot() {
  return (
    <span className="flex items-center gap-1.5 text-xs text-white/50">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-slow inline-block" />
      En vivo
    </span>
  )
}

// ── Pill de filtro activo ─────────────────────────────────────
export function FilterPill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-brand-green/15 text-brand-green text-xs font-semibold px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors ml-0.5">✕</button>
    </span>
  )
}

// ── Empty state ───────────────────────────────────────────────
export function EmptyState({ icon = '📊', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <span className="text-5xl opacity-30">{icon}</span>
      <p className="text-white/50 font-semibold">{title}</p>
      {subtitle && <p className="text-white/30 text-sm max-w-xs">{subtitle}</p>}
    </div>
  )
}
