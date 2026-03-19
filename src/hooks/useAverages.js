// src/hooks/useAverages.js
import { useState, useEffect } from 'react'
import { subscribeToAverages, subscribeToGlobal, subscribeToMeta } from '../services/firestore'

export function useAverages(filters) {
  const [averages, setAverages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeToAverages(filters, data => {
      setAverages(data)
      setLoading(false)
    })
    return unsub
  }, [filters.country, filters.profession, filters.experience])

  return { averages, loading, error }
}

export function useGlobalAverage() {
  const [global,  setGlobal]  = useState(null)
  const [meta,    setMeta]    = useState({ totalReports: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u1 = subscribeToGlobal(d => { setGlobal(d); setLoading(false) })
    const u2 = subscribeToMeta(d => setMeta(d))
    return () => { u1(); u2() }
  }, [])

  return { global, meta, loading }
}
