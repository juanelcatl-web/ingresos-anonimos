// src/components/BottomNav.jsx
export default function BottomNav({ activePage, onNavigate }) {
  const items = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'report',    icon: '➕', label: 'Reportar'  },
    { id: 'stats',     icon: '🏆', label: 'Ranking'   },
    { id: 'about',     icon: 'ℹ️',  label: 'Info'      },
  ]

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-xl border-t border-dark-border pb-safe">
      <div className="flex">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all ${
              activePage === item.id ? 'text-brand-green' : 'text-white/35 hover:text-white/60'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
            {activePage === item.id && (
              <span className="absolute bottom-0 w-4 h-0.5 bg-brand-green rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
