import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const WA_GABO = '56940533981'

const CURSOS = [
  { id: 'inicial', titulo: 'Cartomagia Inicial', icono: '🃏', precio: 'Gratis' },
  { id: 'avanzada', titulo: 'Cartomagia Avanzada', icono: '♠️', precio: '$4.500' },
  { id: 'escenica', titulo: 'Magia Escénica y Mentalismo', icono: '🎩', precio: '$20.000' },
]

function Reproductor({ leccion }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        key={leccion.id}
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${leccion.youtube_id}`}
        title={leccion.titulo}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function Curso({ curso, lecciones }) {
  const [activaId, setActivaId] = useState(null)

  const privadas = lecciones.filter((l) => !l.publica)
  const publicas = lecciones.filter((l) => l.publica)
  const esGratis = curso.id === 'inicial'
  const bloqueado = !esGratis && privadas.length === 0
  const activa = lecciones.find((l) => l.id === activaId) || lecciones[0]

  const mensaje = `Hola! Quiero acceso a ${curso.titulo} (${curso.precio})`
  const linkWa = `https://wa.me/${WA_GABO}?text=${encodeURIComponent(mensaje)}`

  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{curso.icono}</span>
        <div>
          <h3 className="font-display text-xl font-bold text-brand">{curso.titulo}</h3>
          <span className="text-xs uppercase tracking-wider text-muted">{curso.precio}</span>
        </div>
      </div>

      {bloqueado ? (
        <div className="mt-5 space-y-4">
          {publicas[0] && (
            <>
              <Reproductor leccion={publicas[0]} />
              <p className="text-sm font-semibold text-ink">{publicas[0].titulo}</p>
            </>
          )}
          <div className="rounded-xl bg-surface p-5 text-center">
            <p className="text-2xl">🔒</p>
            <p className="mt-2 text-sm text-muted">
              Las lecciones de este curso se desbloquean al inscribirte.
            </p>
            <a
              href={linkWa}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-sm font-semibold text-on-accent transition hover:scale-105"
            >
              Pedir acceso por WhatsApp
            </a>
          </div>
        </div>
      ) : lecciones.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface p-5 text-center">
          <p className="text-sm text-muted">Muy pronto subiremos las primeras lecciones.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
          <div>
            <Reproductor leccion={activa} />
            <h4 className="mt-3 font-semibold text-ink">{activa.titulo}</h4>
            {activa.descripcion && (
              <p className="mt-1 text-sm text-muted">{activa.descripcion}</p>
            )}
          </div>

          <ul className="space-y-2">
            {lecciones.map((l, i) => (
              <li key={l.id}>
                <button
                  onClick={() => setActivaId(l.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    activa.id === l.id
                      ? 'border-accent bg-brand-soft text-brand'
                      : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {i + 1}. {l.titulo}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function MisCursos() {
  const [lecciones, setLecciones] = useState([])
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    let vivo = true
    supabase
      .from('lecciones')
      .select('*')
      .order('orden', { ascending: true })
      .then(({ data, error }) => {
        if (!vivo) return
        if (error) {
          setEstado('error')
        } else {
          setLecciones(data)
          setEstado('listo')
        }
      })
    return () => {
      vivo = false
    }
  }, [])

  return (
    <section id="mis-cursos" className="bg-surface px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Mis cursos</h2>

        {estado === 'cargando' && (
          <p className="mt-8 text-center text-muted">Cargando tus cursos...</p>
        )}
        {estado === 'error' && (
          <p className="mt-8 text-center text-muted">
            No pudimos cargar tus cursos. Recarga la página o escríbenos por WhatsApp.
          </p>
        )}
        {estado === 'listo' && (
          <div className="mt-10 space-y-8">
            {CURSOS.map((c) => (
              <Curso
                key={c.id}
                curso={c}
                lecciones={lecciones.filter((l) => l.curso === c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}