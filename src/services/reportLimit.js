// src/services/reportLimit.js
// Límite de 3 reportes por dispositivo usando localStorage
// 100% anónimo — no identifica al usuario, solo cuenta localmente

const KEY     = 'ia_reports'
const MAX     = 3
const TTL_MS  = 30 * 24 * 60 * 60 * 1000 // 30 días en ms

function getRecords() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const records = JSON.parse(raw)
    // Filtrar los que ya expiraron (más de 30 días)
    const now = Date.now()
    return records.filter(r => now - r.ts < TTL_MS)
  } catch {
    return []
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(KEY, JSON.stringify(records))
  } catch { /* localStorage bloqueado (modo privado estricto) */ }
}

// Cuántos reportes le quedan al usuario
export function getRemainingReports() {
  const records = getRecords()
  return Math.max(0, MAX - records.length)
}

// Cuántos reportes hizo
export function getReportCount() {
  return getRecords().length
}

// ¿Puede reportar?
export function canReport() {
  return getRemainingReports() > 0
}

// Registrar un nuevo reporte
export function registerReport() {
  const records = getRecords()
  records.push({ ts: Date.now() })
  saveRecords(records)
}

// Fecha del próximo "reset" (cuando expire el primer reporte)
export function getNextResetDate() {
  const records = getRecords()
  if (records.length === 0) return null
  const oldest = Math.min(...records.map(r => r.ts))
  return new Date(oldest + TTL_MS)
}
