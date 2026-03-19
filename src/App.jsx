// src/App.jsx
// Shell principal — maneja navegación entre páginas

import { useState } from 'react'
import { AppProvider } from './contexts/AppContext'
import Header    from './components/Header'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Report    from './pages/Report'
import Stats     from './pages/Stats'
import About     from './pages/About'

const PAGES = { dashboard: Dashboard, report: Report, stats: Stats, about: About }

function AppShell() {
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page] ?? Dashboard

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <Header activePage={page} onNavigate={setPage} />

      <main className="animate-fade-in" key={page}>
        <Page onNavigate={setPage} />
      </main>

      <BottomNav activePage={page} onNavigate={setPage} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
