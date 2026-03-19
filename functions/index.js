// functions/index.js
// Cloud Functions para IncomeAnon Web

const { onSchedule }       = require('firebase-functions/v2/scheduler')
const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { initializeApp }    = require('firebase-admin/app')
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore')
const logger = require('firebase-functions/logger')

initializeApp()
const db = getFirestore()

// ══════════════════════════════════════════════════════════════
// Calcular promedios cada 5 minutos
// ══════════════════════════════════════════════════════════════
exports.calculateAverages = onSchedule(
  { schedule: 'every 5 minutes', timeZone: 'America/Argentina/Buenos_Aires', region: 'southamerica-east1', memory: '256MiB', timeoutSeconds: 120 },
  async () => {
    const snap = await db.collection('reports').where('expireAt', '>', Timestamp.now()).get()
    if (snap.empty) return

    const aggs = new Map()
    const add = (key, income, currency, meta) => {
      if (!aggs.has(key)) aggs.set(key, { sum: 0, count: 0, currency, ...meta })
      const a = aggs.get(key)
      a.sum += income; a.count++
    }

    snap.forEach(doc => {
      const { income, currency, country, city, profession, experience } = doc.data()
      if (!income || income <= 0 || income > 1e8) return
      const [c, ci, p, e] = [country, city, profession, experience].map(s => (s || '').trim())
      const cur = currency || 'USD'
      const inc = Number(income)

      add('global',                             inc, cur, { country: 'Global', city: 'Global',  profession: 'Todas', experience: 'Todas' })
      add(`c:${c}`,                             inc, cur, { country: c,        city: 'Global',  profession: 'Todas', experience: 'Todas' })
      add(`p:${p}`,                             inc, cur, { country: 'Global', city: 'Global',  profession: p,       experience: 'Todas' })
      add(`p:${p}|e:${e}`,                      inc, cur, { country: 'Global', city: 'Global',  profession: p,       experience: e })
      add(`c:${c}|p:${p}`,                      inc, cur, { country: c,        city: 'Global',  profession: p,       experience: 'Todas' })
      add(`c:${c}|p:${p}|e:${e}`,               inc, cur, { country: c,        city: 'Global',  profession: p,       experience: e })
      if (ci && ci !== 'Sin especificar')
        add(`c:${c}|ci:${ci}`,                  inc, cur, { country: c,        city: ci,        profession: 'Todas', experience: 'Todas' })
    })

    // Escribir en batches de 400
    const entries = [...aggs.entries()]
    for (let i = 0; i < entries.length; i += 400) {
      const batch = db.batch()
      entries.slice(i, i + 400).forEach(([key, agg]) => {
        const id = key === 'global' ? '__global__' : key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 200)
        batch.set(db.collection('averages').doc(id), {
          ...agg,
          avgIncome: Math.round((agg.sum / agg.count) * 100) / 100,
          key,
          lastUpdated: FieldValue.serverTimestamp(),
        })
      })
      await batch.commit()
    }

    await db.collection('averages').doc('__meta__').set(
      { totalReports: snap.size, totalCategories: aggs.size, lastCalculated: FieldValue.serverTimestamp() },
      { merge: true }
    )
    logger.info(`✅ ${aggs.size} promedios calculados de ${snap.size} reportes`)
  }
)

// ══════════════════════════════════════════════════════════════
// Limpiar reportes expirados — 1x por día
// ══════════════════════════════════════════════════════════════
exports.cleanExpiredReports = onSchedule(
  { schedule: 'every day 03:00', timeZone: 'America/Argentina/Buenos_Aires', region: 'southamerica-east1', memory: '256MiB', timeoutSeconds: 300 },
  async () => {
    const snap = await db.collection('reports').where('expireAt', '<=', Timestamp.now()).limit(500).get()
    if (snap.empty) return
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = db.batch()
      snap.docs.slice(i, i + 400).forEach(d => batch.delete(d.ref))
      await batch.commit()
    }
    logger.info(`🗑️ ${snap.size} reportes expirados eliminados`)
  }
)

// ══════════════════════════════════════════════════════════════
// Incrementar contador global en tiempo real
// ══════════════════════════════════════════════════════════════
exports.onReportCreated = onDocumentCreated(
  { document: 'reports/{id}', region: 'southamerica-east1', memory: '128MiB' },
  async () => {
    await db.collection('averages').doc('__meta__').set(
      { totalReports: FieldValue.increment(1), lastReport: FieldValue.serverTimestamp() },
      { merge: true }
    )
  }
)
