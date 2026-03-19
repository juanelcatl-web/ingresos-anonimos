// src/components/CitySearchInput.jsx
// Input con autocompletado de ciudades usando OpenStreetMap

import { useState, useRef, useEffect, useCallback } from 'react'
import { searchCities } from '../services/citySearch'

export default function CitySearchInput({ value, onChange, onCoordsChange }) {
  const [query,       setQuery]       = useState(value?.city || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [open,        setOpen]        = useState(false)
  const debounceRef = useRef(null)
  const wrapRef     = useRef(null)

  // Cerrar al clickear afuera
  useEffect(() => {
    const handler = e => { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleInput = useCallback(e => {
    const val = e.target.value
    setQuery(val)
    setSuggestions([])

    // Limpiar coordenadas si el usuario edita manualmente
    onCoordsChange(null, null)
    onChange(val, '')

    clearTimeout(debounceRef.current)
    if (val.length < 2) { setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const results = await searchCities(val)
      setSuggestions(results)
      setOpen(results.length > 0)
      setLoading(false)
    }, 600)
  }, [onChange, onCoordsChange])

  const handleSelect = useCallback(item => {
    setQuery(item.label)
    setSuggestions([])
    setOpen(false)
    onChange(item.city, item.country)
    onCoordsChange(item.lat, item.lng)
  }, [onChange, onCoordsChange])

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Escribí tu ciudad..."
          className="w-full bg-dark-input border border-dark-border text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green/60 transition-colors pr-10"
          style={{ fontSize: 16 }}
          autoComplete="off"
        />
        {/* Ícono */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin inline-block" />
          ) : '📍'}
        </span>
      </div>

      {/* Dropdown de sugerencias */}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-dark-input border border-dark-border rounded-xl overflow-hidden shadow-2xl">
          {suggestions.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <span className="text-brand-green text-xs">📍</span>
                <div>
                  <span className="font-medium">{item.city}</span>
                  <span className="text-white/40 text-xs ml-1">{item.country}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-white/30 mt-1">
        Solo guardamos ciudad. Las coordenadas son aproximadas al centro de la ciudad.
      </p>
    </div>
  )
}
