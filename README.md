# 📊 IncomeAnon Web — Guía de Setup Completa

> **Tiempo estimado: 15-20 minutos** desde cero hasta la app corriendo en producción.

---

## ✅ Lo que necesitás tener instalado

- **Node.js** → descargá de [nodejs.org](https://nodejs.org) (versión LTS)
- **Cuenta Firebase** → ya la tenés ✓

Para verificar que Node está instalado, abrí la terminal y escribí:
```bash
node --version   # debe mostrar v18.x o superior
npm --version    # debe mostrar 9.x o superior
```

---

## 🚀 Paso 1 — Crear proyecto en Firebase Console

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Agregar proyecto"** → nombre: `income-anon`
3. (opcional) Desactivar Google Analytics
4. Click **"Crear proyecto"**

### Activar Firestore:
1. En el menú izquierdo → **Firestore Database**
2. Click **"Crear base de datos"**
3. Elegir **"Modo producción"**
4. Región: **`southamerica-east1`** (São Paulo — más cercano)
5. Click **"Listo"**

### Agregar app Web:
1. En la pantalla principal del proyecto → ícono `</>` (Web)
2. Nombre: `income-anon-web`
3. Tildar **"Firebase Hosting"**
4. Click **"Registrar app"**
5. **Copiar el objeto `firebaseConfig`** — lo necesitás en el Paso 3

---

## 🚀 Paso 2 — Instalar Firebase CLI y preparar el proyecto

Abrí la terminal en la carpeta del proyecto (`income_anon_web/`) y ejecutá:

```bash
# Instalar Firebase CLI globalmente (solo una vez)
npm install -g firebase-tools

# Instalar dependencias del proyecto
npm install

# Instalar dependencias de Cloud Functions
cd functions && npm install && cd ..

# Loguearte en Firebase (abre el navegador)
firebase login

# Seleccionar tu proyecto
firebase use --add
# → te muestra la lista de proyectos, elegís "income-anon"
# → le ponés un alias, ej: "default"
```

---

## 🚀 Paso 3 — Configurar las credenciales de Firebase

Abrí el archivo **`src/services/firebase.js`** y reemplazá los valores con los que copiaste en el Paso 1:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // ← tu valor real
  authDomain:        "income-anon.firebaseapp.com",
  projectId:         "income-anon",
  storageBucket:     "income-anon.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...:web:abc..."
}
```

> ℹ️ Estos valores son públicos por diseño — Firebase los protege con reglas de seguridad (ya incluidas en `firestore.rules`), no con secretos.

---

## 🚀 Paso 4 — Deploy del backend a Firebase

```bash
# Desplegar reglas de seguridad + índices de Firestore
firebase deploy --only firestore:rules,firestore:indexes
```

Para las **Cloud Functions** (promedios automáticos cada 5 min) necesitás el **plan Blaze** (pago por uso, pero gratuito hasta ~2M invocaciones/mes):

```bash
# Solo si tenés plan Blaze activado:
firebase deploy --only functions
```

> ⚠️ Si no querés activar Blaze todavía, podés saltearte este paso. La app funciona igual — solo que los promedios no se calculan automáticamente hasta que alguien los dispare manualmente.

---

## 🚀 Paso 5 — Correr en local

```bash
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173) en el navegador. ¡La app ya funciona! 🎉

---

## 🚀 Paso 6 — Deploy a producción (Firebase Hosting)

```bash
npm run deploy
# Equivale a: npm run build && firebase deploy --only hosting
```

Al terminar te da una URL pública tipo:
```
https://income-anon.web.app
```

¡Esa URL ya funciona como PWA! En el celular podés instalarla desde el navegador → **"Agregar a pantalla de inicio"**.

---

## 📁 Estructura del proyecto

```
income_anon_web/
├── src/
│   ├── main.jsx                  ← Entry point React
│   ├── App.jsx                   ← Shell + navegación entre páginas
│   ├── index.css                 ← Tailwind + estilos globales
│   ├── constants.js              ← Listas: profesiones, países, etc.
│   ├── contexts/
│   │   └── AppContext.jsx        ← Estado global: tema + filtros
│   ├── hooks/
│   │   └── useAverages.js        ← Suscripciones en tiempo real
│   ├── services/
│   │   ├── firebase.js           ← Config Firebase ← EDITÁ ESTE
│   │   ├── firestore.js          ← Lectura/escritura Firestore
│   │   └── geo.js                ← Geolocalización por IP
│   ├── components/
│   │   ├── UI.jsx                ← Botón, Input, Select, Badge, etc.
│   │   ├── Header.jsx            ← Barra superior
│   │   ├── BottomNav.jsx         ← Nav inferior mobile
│   │   ├── IncomeCard.jsx        ← Card de promedio
│   │   └── ProfChart.jsx         ← Gráfico de barras (Recharts)
│   └── pages/
│       ├── Dashboard.jsx         ← Pantalla principal con cards
│       ├── Report.jsx            ← Formulario anónimo
│       ├── Stats.jsx             ← Ranking detallado
│       └── About.jsx             ← Info + FAQ
├── functions/
│   ├── index.js                  ← Cloud Functions (Node.js 18)
│   └── package.json
├── index.html
├── vite.config.js                ← Config Vite + PWA
├── tailwind.config.js
├── firebase.json                 ← Config Firebase Hosting
├── firestore.rules               ← Reglas de seguridad
└── firestore.indexes.json        ← Índices compuestos
```

---

## 📱 Instalar como PWA en el celular

1. Abrí la URL de Firebase Hosting en Chrome (Android) o Safari (iOS)
2. **Android**: menú (⋮) → "Agregar a pantalla de inicio"
3. **iOS**: botón compartir → "Agregar a pantalla de inicio"

La app queda instalada como si fuera nativa: sin barra del navegador, con ícono propio y funciona offline (con los datos cacheados).

---

## 🔧 Comandos útiles

```bash
npm run dev          # Servidor de desarrollo en localhost:5173
npm run build        # Build de producción en /dist
npm run preview      # Preview del build de producción
npm run deploy       # Build + deploy a Firebase Hosting

firebase deploy --only firestore:rules    # Solo actualizar reglas
firebase deploy --only functions          # Solo actualizar Cloud Functions
firebase functions:log                    # Ver logs de las funciones
firebase emulators:start                  # Emuladores locales
```
