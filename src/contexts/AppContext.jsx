// src/contexts/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Tema: dark por defecto, respeta preferencia del sistema
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('ia-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Filtros del dashboard
  const [filters, setFilters] = useState({ country: '', profession: '', experience: '' })

  // Aplicar clase "dark" al <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('ia-theme', dark ? 'dark' : 'light')
  }, [dark])

  const clearFilters = () => setFilters({ country: '', profession: '', experience: '' })
  const activeCount  = Object.values(filters).filter(Boolean).length

  return (
    <AppContext.Provider value={{ dark, setDark, filters, setFilters, clearFilters, activeCount }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
