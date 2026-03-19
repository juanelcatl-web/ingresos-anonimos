// src/services/citySearch.js
// Búsqueda de ciudades con coordenadas reales usando Nominatim (OpenStreetMap)
// Gratis, sin API key, con límite de 1 req/seg

let lastCall = 0

export async function searchCities(query) {
  if (!query || query.length < 2) return []

  // Rate limit: mínimo 1 segundo entre llamadas
  const now = Date.now()
  if (now - lastCall < 1000) return []
  lastCall = now

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&featuretype=city&accept-language=es`
    const res  = await fetch(url, {
      headers: { 'Accept-Language': 'es', 'User-Agent': 'IncomeAnon/1.0' },
      signal:  AbortSignal.timeout(4000)
    })
    const data = await res.json()
    return data.map(item => ({
      label:   item.display_name.split(',').slice(0, 2).join(',').trim(),
      city:    item.display_name.split(',')[0].trim(),
      country: item.display_name.split(',').at(-1).trim(),
      lat:     parseFloat(item.lat),
      lng:     parseFloat(item.lon),
    }))
  } catch {
    return []
  }
}
