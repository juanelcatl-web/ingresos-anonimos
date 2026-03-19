// src/services/firestore.js
// Todas las operaciones de lectura y escritura a Firestore

import {
  collection, addDoc, query, where, orderBy,
  limit, onSnapshot, doc, serverTimestamp, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ── Enviar reporte anónimo ────────────────────────────────────
export async function submitReport({ income, currency, country, city, profession, experience }) {
  const now = new Date()
  const expireAt = new Date(now)
  expireAt.setDate(expireAt.getDate() + 30) // TTL 30 días

  return addDoc(collection(db, 'reports'), {
    income:     parseFloat(income),
    currency,
    country,
    city:       city.trim() || 'Sin especificar',
    profession,
    experience,
    timestamp:  serverTimestamp(),
    expireAt:   Timestamp.fromDate(expireAt),
  })
}

// ── Suscripción en tiempo real a promedios ────────────────────
export function subscribeToAverages({ country, profession, experience }, callback) {
  let q = query(collection(db, 'averages'), orderBy('count', 'desc'), limit(50))

  if (country    && country    !== 'Todos')  q = query(q, where('country',    'isEqualTo', country))
  if (profession && profession !== 'Todas')  q = query(q, where('profession', 'isEqualTo', profession))
  if (experience && experience !== 'Todas')  q = query(q, where('experience', 'isEqualTo', experience))

  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(data)
  }, err => console.error('Firestore error:', err))
}

// ── Promedio global ───────────────────────────────────────────
export function subscribeToGlobal(callback) {
  return onSnapshot(doc(db, 'averages', '__global__'), snap => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })
}

// ── Metadatos globales (total reportes) ───────────────────────
export function subscribeToMeta(callback) {
  return onSnapshot(doc(db, 'averages', '__meta__'), snap => {
    callback(snap.exists() ? snap.data() : { totalReports: 0 })
  })
}

// ── Helpers de formato ─────────────────────────────────────────
export function formatIncome(value, currency = 'USD') {
  const symbols = { USD: 'US$', ARS: '$', EUR: '€', BRL: 'R$', CLP: '$', MXN: '$', COP: '$', UYU: '$U' }
  const sym = symbols[currency] ?? '$'
  if (value >= 1_000_000) return `${sym}${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `${sym}${(value / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(value).toLocaleString('es-AR')}`
}

export function averageLabel(avg) {
  const parts = []
  if (avg.country    && avg.country    !== 'Global') parts.push(avg.country)
  if (avg.city       && avg.city       !== 'Global' && avg.city !== avg.country) parts.push(avg.city)
  if (avg.profession && avg.profession !== 'Todas')  parts.push(avg.profession)
  return parts.length ? parts.join(' · ') : 'Global'
}
