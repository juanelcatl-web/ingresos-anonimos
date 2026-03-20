// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            "AIzaSyAdyCcgjpnsHQRGJJyfyHfCFaCh1Mo6F2o",
  authDomain:        "ingresos-anonimos.firebaseapp.com",
  projectId:         "ingresos-anonimos",
  storageBucket:     "ingresos-anonimos.firebasestorage.app",
  messagingSenderId: "101939322452",
  appId:             "1:101939322452:web:0c60d5fec994d93ea6d7c1",
  measurementId:     "G-WZ7H97JBZQ"
}

const app = initializeApp(firebaseConfig)
export const db        = getFirestore(app)
export const analytics = getAnalytics(app) // activa Google Analytics automáticamente
