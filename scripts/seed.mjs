// scripts/seed.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const SEED_DATA = [
  { country: 'Argentina', city: 'Buenos Aires', profession: 'Desarrollador/a',    experience: '3-5 años',  income: 2800,  currency: 'USD', lat: -34.60, lng: -58.38 },
  { country: 'Argentina', city: 'Buenos Aires', profession: 'Freelance',           experience: '1-3 años',  income: 1500,  currency: 'USD', lat: -34.61, lng: -58.40 },
  { country: 'Argentina', city: 'Córdoba',      profession: 'Desarrollador/a',    experience: '5-10 años', income: 3200,  currency: 'USD', lat: -31.42, lng: -64.18 },
  { country: 'Argentina', city: 'Tandil',       profession: 'Desarrollador/a',    experience: '1-3 años',  income: 1800,  currency: 'USD', lat: -37.32, lng: -59.13 },
  { country: 'Argentina', city: 'Rosario',      profession: 'Marketing Digital',  experience: '3-5 años',  income: 900,   currency: 'USD', lat: -32.94, lng: -60.64 },
  { country: 'Argentina', city: 'Mendoza',      profession: 'Agro',               experience: '5-10 años', income: 1200,  currency: 'USD', lat: -32.89, lng: -68.83 },
  { country: 'Argentina', city: 'Buenos Aires', profession: 'Trading / Crypto',   experience: '3-5 años',  income: 4500,  currency: 'USD', lat: -34.62, lng: -58.37 },
  { country: 'Argentina', city: 'Buenos Aires', profession: 'Diseño / UX',        experience: '1-3 años',  income: 1200,  currency: 'USD', lat: -34.59, lng: -58.42 },
  { country: 'Argentina', city: 'La Plata',     profession: 'Docente',            experience: '5-10 años', income: 600,   currency: 'USD', lat: -34.92, lng: -57.95 },
  { country: 'Argentina', city: 'Buenos Aires', profession: 'Finanzas',           experience: '10+ años',  income: 3500,  currency: 'USD', lat: -34.63, lng: -58.36 },
  { country: 'Brasil',    city: 'São Paulo',    profession: 'Desarrollador/a',    experience: '3-5 años',  income: 3500,  currency: 'USD', lat: -23.55, lng: -46.63 },
  { country: 'Brasil',    city: 'São Paulo',    profession: 'Marketing Digital',  experience: '1-3 años',  income: 1200,  currency: 'USD', lat: -23.56, lng: -46.64 },
  { country: 'Brasil',    city: 'Rio de Janeiro', profession: 'Diseño / UX',      experience: '3-5 años',  income: 1800,  currency: 'USD', lat: -22.90, lng: -43.17 },
  { country: 'Brasil',    city: 'Brasilia',     profession: 'Finanzas',           experience: '5-10 años', income: 2800,  currency: 'USD', lat: -15.78, lng: -47.93 },
  { country: 'Brasil',    city: 'Curitiba',     profession: 'Freelance',          experience: '1-3 años',  income: 900,   currency: 'USD', lat: -25.43, lng: -49.27 },
  { country: 'Chile',     city: 'Santiago',     profession: 'Desarrollador/a',    experience: '5-10 años', income: 3800,  currency: 'USD', lat: -33.45, lng: -70.65 },
  { country: 'Chile',     city: 'Santiago',     profession: 'Finanzas',           experience: '3-5 años',  income: 2500,  currency: 'USD', lat: -33.46, lng: -70.66 },
  { country: 'Chile',     city: 'Valparaíso',   profession: 'Freelance',          experience: '1-3 años',  income: 1400,  currency: 'USD', lat: -33.05, lng: -71.62 },
  { country: 'Colombia',  city: 'Bogotá',       profession: 'Desarrollador/a',    experience: '3-5 años',  income: 2200,  currency: 'USD', lat: 4.71,   lng: -74.08 },
  { country: 'Colombia',  city: 'Medellín',     profession: 'Emprendedor/a Tech', experience: '5-10 años', income: 3000,  currency: 'USD', lat: 6.24,   lng: -75.57 },
  { country: 'Colombia',  city: 'Bogotá',       profession: 'Marketing Digital',  experience: '1-3 años',  income: 800,   currency: 'USD', lat: 4.72,   lng: -74.07 },
  { country: 'México',    city: 'Ciudad de México', profession: 'Desarrollador/a', experience: '3-5 años', income: 2500,  currency: 'USD', lat: 19.43,  lng: -99.13 },
  { country: 'México',    city: 'Guadalajara',  profession: 'Diseño / UX',        experience: '1-3 años',  income: 1300,  currency: 'USD', lat: 20.66,  lng: -103.35 },
  { country: 'México',    city: 'Monterrey',    profession: 'Finanzas',           experience: '5-10 años', income: 3200,  currency: 'USD', lat: 25.67,  lng: -100.31 },
  { country: 'Uruguay',   city: 'Montevideo',   profession: 'Desarrollador/a',    experience: '3-5 años',  income: 2800,  currency: 'USD', lat: -34.90, lng: -56.16 },
  { country: 'Uruguay',   city: 'Montevideo',   profession: 'Freelance',          experience: '5-10 años', income: 3500,  currency: 'USD', lat: -34.91, lng: -56.17 },
  { country: 'Estados Unidos', city: 'New York',      profession: 'Desarrollador/a', experience: '5-10 años', income: 9500,  currency: 'USD', lat: 40.71,  lng: -74.00 },
  { country: 'Estados Unidos', city: 'San Francisco', profession: 'Desarrollador/a', experience: '10+ años',  income: 14000, currency: 'USD', lat: 37.77,  lng: -122.42 },
  { country: 'Estados Unidos', city: 'Miami',         profession: 'Marketing Digital', experience: '3-5 años', income: 5500, currency: 'USD', lat: 25.77,  lng: -80.19 },
  { country: 'España',    city: 'Madrid',       profession: 'Desarrollador/a',    experience: '3-5 años',  income: 2800,  currency: 'EUR', lat: 40.42,  lng: -3.70 },
  { country: 'España',    city: 'Barcelona',    profession: 'Diseño / UX',        experience: '5-10 años', income: 2500,  currency: 'EUR', lat: 41.38,  lng: 2.15  },
  { country: 'España',    city: 'Valencia',     profession: 'Freelance',          experience: '3-5 años',  income: 2200,  currency: 'EUR', lat: 39.47,  lng: -0.37 },
  { country: 'Alemania',  city: 'Berlín',       profession: 'Desarrollador/a',    experience: '5-10 años', income: 5500,  currency: 'EUR', lat: 52.52,  lng: 13.40 },
  { country: 'Alemania',  city: 'Múnich',       profession: 'Finanzas',           experience: '10+ años',  income: 7000,  currency: 'EUR', lat: 48.14,  lng: 11.58 },
  { country: 'Perú',      city: 'Lima',         profession: 'Desarrollador/a',    experience: '1-3 años',  income: 1500,  currency: 'USD', lat: -12.04, lng: -77.04 },
  { country: 'Ecuador',   city: 'Quito',        profession: 'Desarrollador/a',    experience: '3-5 años',  income: 1400,  currency: 'USD', lat: -0.22,  lng: -78.51 },
  { country: 'Canadá',    city: 'Toronto',      profession: 'Desarrollador/a',    experience: '5-10 años', income: 7500,  currency: 'USD', lat: 43.65,  lng: -79.38 },
  { country: 'Australia', city: 'Sydney',       profession: 'Desarrollador/a',    experience: '5-10 años', income: 8000,  currency: 'USD', lat: -33.87, lng: 151.21 },
  { country: 'India',     city: 'Bangalore',    profession: 'Desarrollador/a',    experience: '3-5 años',  income: 2200,  currency: 'USD', lat: 12.97,  lng: 77.59  },
  { country: 'Israel',    city: 'Tel Aviv',     profession: 'Desarrollador/a',    experience: '5-10 años', income: 8500,  currency: 'USD', lat: 32.08,  lng: 34.78  },
]

async function seed() {
  console.log(`\n🌱 Cargando ${SEED_DATA.length} reportes...\n`)
  let success = 0

  for (const item of SEED_DATA) {
    const daysAgo   = Math.floor(Math.random() * 15)
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - daysAgo)
    const expireAt  = new Date(timestamp)
    expireAt.setDate(expireAt.getDate() + 30)

    const data = {
      income: item.income, currency: item.currency, country: item.country,
      city: item.city, profession: item.profession, experience: item.experience,
      timestamp: Timestamp.fromDate(timestamp), expireAt: Timestamp.fromDate(expireAt),
    }

    await db.collection('reports').add(data)
    await db.collection('mappoints').add({
      ...data,
      lat: item.lat + (Math.random() * 0.05 - 0.025),
      lng: item.lng + (Math.random() * 0.05 - 0.025),
    })

    console.log(`✅ ${item.country} — ${item.city} — ${item.profession} — ${item.currency}${item.income}`)
    success++
    await new Promise(r => setTimeout(r, 100))
  }

  console.log(`\n🎉 ${success} reportes cargados exitosamente!`)
  process.exit(0)
}

seed()
