// src/components/Header.jsx — v3
import { useApp } from '../contexts/AppContext'

export default function Header({ activePage, onNavigate }) {
  const { dark, setDark } = useApp()
  const nav = [
    { id: 'dashboard',  label: 'Dashboard'  },
    { id: 'report',     label: 'Reportar'   },
    { id: 'stats',      label: 'Ranking'    },
    { id: 'world',      label: 'Mundial'    },
    { id: 'calculator', label: '🧮 Calc'    },
    { id: 'about',      label: 'Info'       },
  ]
  return (
    <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-sm">📈</div>
          <span className="font-extrabold text-white text-sm tracking-tight hidden sm:block">
            Income<span className="text-brand-green">Anon</span>
          </span>
        </button>
        <nav className="hidden sm:flex items-center gap-1">
          {nav.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === item.id ? 'bg-brand-green/15 text-brand-green' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setDark(d => !d)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm">
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
