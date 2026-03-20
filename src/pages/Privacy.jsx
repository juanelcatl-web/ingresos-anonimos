// src/pages/Privacy.jsx
// Página de Política de Privacidad y Términos de Uso
// Requerida por Google AdSense para aprobación

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 sm:pb-8 animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white mb-2">Política de Privacidad</h1>
        <p className="text-white/40 text-sm">Última actualización: marzo 2025</p>
      </div>

      <div className="space-y-8 text-white/60 text-sm leading-relaxed">

        {/* Intro */}
        <section>
          <p>
            <strong className="text-white">IncomeAnon</strong> ("nosotros", "nuestro", "el sitio") opera en{' '}
            <a href="https://ingresos-anonimos.web.app" className="text-brand-green hover:underline">
              https://ingresos-anonimos.web.app
            </a>. Esta página informa sobre nuestras políticas respecto a la recopilación,
            uso y divulgación de datos personales cuando usás nuestro servicio.
          </p>
        </section>

        <Divider />

        {/* Datos que recopilamos */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">1. Datos que recopilamos</h2>
          <p className="mb-3">
            IncomeAnon está diseñado para ser <strong className="text-white">100% anónimo</strong>. No recopilamos ningún dato personal identificable. Los únicos datos que se almacenan son:
          </p>
          <ul className="space-y-2 ml-4">
            {[
              'Ingreso neto mensual (número)',
              'Moneda seleccionada',
              'País y ciudad (aproximados, ingresados manualmente por el usuario)',
              'Profesión o rubro',
              'Años de experiencia',
              'Coordenadas geográficas aproximadas al centro de la ciudad (opcionales)',
              'Fecha y hora del reporte',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-brand-green mt-0.5 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong className="text-white">No recopilamos</strong>: nombre, email, teléfono, dirección IP, identificadores de dispositivo, cookies de seguimiento ni ningún otro dato personal.
          </p>
        </section>

        <Divider />

        {/* Límite de reportes */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">2. Almacenamiento local (localStorage)</h2>
          <p>
            Para limitar el número de reportes por dispositivo (máximo 3 cada 30 días), guardamos un contador anónimo en el <strong className="text-white">localStorage</strong> de tu navegador. Este dato nunca se envía a nuestros servidores y no contiene ningún identificador personal. Podés borrarlo en cualquier momento desde la configuración de tu navegador.
          </p>
        </section>

        <Divider />

        {/* Google Analytics */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">3. Google Analytics</h2>
          <p>
            Usamos <strong className="text-white">Google Analytics</strong> (Firebase Analytics) para entender cómo se usa el sitio — cantidad de visitas, países de origen, dispositivos. Google Analytics puede usar cookies propias. Podés optar por no ser rastreado instalando el{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">
              complemento de inhabilitación de Google Analytics
            </a>.
          </p>
        </section>

        <Divider />

        {/* AdSense */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">4. Google AdSense y publicidad</h2>
          <p className="mb-3">
            Usamos <strong className="text-white">Google AdSense</strong> para mostrar anuncios. Google puede usar cookies para mostrar anuncios personalizados basados en tus visitas anteriores a este y otros sitios.
          </p>
          <p>
            Podés desactivar la publicidad personalizada visitando{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">
              Configuración de anuncios de Google
            </a>.
            Para más información sobre cómo Google usa los datos, visitá{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">
              Política de Privacidad de Google
            </a>.
          </p>
        </section>

        <Divider />

        {/* Retención */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">5. Retención de datos</h2>
          <p>
            Los reportes individuales se eliminan automáticamente a los <strong className="text-white">30 días</strong> de haber sido creados. Solo se conservan estadísticas agregadas (promedios) que no permiten identificar a ningún usuario.
          </p>
        </section>

        <Divider />

        {/* Terceros */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">6. Servicios de terceros</h2>
          <p className="mb-2">El sitio utiliza los siguientes servicios de terceros:</p>
          <ul className="space-y-2 ml-4">
            {[
              ['Google Firebase / Firestore', 'Base de datos y hosting', 'https://firebase.google.com/support/privacy'],
              ['Google Analytics', 'Estadísticas de uso', 'https://policies.google.com/privacy'],
              ['Google AdSense', 'Publicidad', 'https://policies.google.com/privacy'],
              ['ip-api.com', 'Geolocalización aproximada por IP', 'https://ip-api.com/docs/legal'],
              ['Nominatim / OpenStreetMap', 'Búsqueda de ciudades', 'https://osmfoundation.org/wiki/Privacy_Policy'],
            ].map(([name, desc, url]) => (
              <li key={name} className="flex items-start gap-2">
                <span className="text-brand-green mt-0.5 flex-shrink-0">·</span>
                <span>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-green transition-colors">{name}</a>
                  {' — '}{desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* Derechos */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">7. Tus derechos</h2>
          <p>
            Dado que no recopilamos datos personales identificables, no es posible identificar ni eliminar reportes individuales una vez enviados. Si tenés dudas o consultas, podés contactarnos a través de{' '}
            <a href="https://github.com/juanelcatl-web/ingresos-anonimos" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">
              nuestro repositorio en GitHub
            </a>.
          </p>
        </section>

        <Divider />

        {/* Términos */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">8. Términos de uso</h2>
          <ul className="space-y-2 ml-4">
            {[
              'El servicio se provee "tal cual", sin garantías de ningún tipo.',
              'Los datos mostrados son aportados por usuarios anónimos y pueden no ser precisos.',
              'Está prohibido cargar datos falsos o manipular las estadísticas intencionalmente.',
              'Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento.',
              'El uso del sitio implica la aceptación de estos términos.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-brand-green mt-0.5 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* Cambios */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">9. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política periódicamente. Los cambios se publicarán en esta página con la fecha de actualización. Te recomendamos revisarla ocasionalmente.
          </p>
        </section>

      </div>
    </div>
  )
}

function Divider() {
  return <hr className="border-dark-border" />
}
