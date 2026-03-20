// src/App.jsx — v3 completo
import { useState } from 'react'
import { AppProvider } from './contexts/AppContext'
import Header        from './components/Header'
import BottomNav     from './components/BottomNav'
import Dashboard     from './pages/Dashboard'
import Report        from './pages/Report'
import Stats         from './pages/Stats'
import About         from './pages/About'
import Privacy       from './pages/Privacy'
import WorldSalaries from './pages/WorldSalaries'
import Calculator    from './pages/Calculator'

const PAGES = {
  dashboard:  Dashboard,
  report:     Report,
  stats:      Stats,
  world:      WorldSalaries,
  calculator: Calculator,
  about:      About,
  privacy:    Privacy,
}

function AppShell() {
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page] ?? Dashboard

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <Header activePage={page} onNavigate={setPage} />
      <main className="animate-fade-in" key={page}>
        <Page onNavigate={setPage} />
      </main>
      <footer className="text-center py-4 pb-24 sm:pb-6 border-t border-dark-border mt-4">
        <button onClick={() => setPage('privacy')} className="text-xs text-white/25 hover:text-white/50 transition-colors">
          Política de Privacidad · Términos de Uso
        </button>
      </footer>
      <BottomNav activePage={page} onNavigate={setPage} />
    </div>
  )
}

export default function App() {
  return <AppProvider><AppShell /></AppProvider>
}
