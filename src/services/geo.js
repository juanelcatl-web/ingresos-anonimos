// src/services/geo.js
// Detecta ciudad y país por IP usando ip-api.com (sin GPS, máximo anonimato)

let cached = null

export async function getApproxLocation() {
  if (cached) return cached
  try {
    const res = await fetch('http://ip-api.com/json/?fields=country,city,countryCode,status', { signal: AbortSignal.timeout(5000) })
    const json = await res.json()
    if (json.status === 'success') {
      cached = { country: json.country, city: json.city, countryCode: json.countryCode }
      return cached
    }
  } catch { /* falla silenciosamente */ }
  return { country: '', city: '', countryCode: '' }
}
