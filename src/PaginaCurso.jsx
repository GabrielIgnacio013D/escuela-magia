import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Prueba from './Prueba'
import Entregas from './Entregas'
import { CURSOS, WA_GABO, wa } from './datos'

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

function Lista({ titulo, items }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <h2 className="font-display text-xl font-bold text-brand">{titulo}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-sm text-muted">
            <span className="font-bold text-accent">✓</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CajaAcceso({ curso, usuario, tieneAcceso, onIngresar, onRegistro }) {
  const linkWa = wa(WA_GABO, curso.mensaje)
  const base = 'rounded-full px-8 py-3 font-semibold transition'
  const principal = `${base} bg-accent text-on-accent hover:scale-105`
  const secundario = `${base} border border-accent text-accent hover:bg-brand-soft`

  if (tieneAcceso) {
    return (
      <div className="rounded-2xl bg-surface p-6 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-2 text-ink">¡Ya tienes acceso a este curso!</p>
        <a href={`#/curso/${curso.id}/lecciones`} className={`${principal} mt-5 inline-block`}>
          Ir a los tutoriales →
        </a>
      </div>
    )
  }

  if (curso.gratis) {
    return (
      <div className="rounded-2xl bg-surface p-6 text-center">
        <p className="text-2xl">🎁</p>
        <p className="mt-2 text-ink">Crea tu cuenta gratis para ver todos los tutoriales.</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onRegistro} className={principal}>
            Crear cuenta gratis
          </button>
          <button onClick={onIngresar} className={secundario}>
            Ya tengo cuenta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-surface p-6 text-center">
      <p className="text-2xl">🔒</p>
      <p className="mt-2 text-ink">
        {usuario
          ? 'Aún no tienes acceso a este curso.'
          : 'Los tutoriales se desbloquean al inscribirte. Si ya estás inscrito, ingresa con tu cuenta.'}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={linkWa} target="_blank" rel="noreferrer" className={principal}>
          Pedir acceso por WhatsApp
        </a>
        {!usuario && (
          <button onClick={onIngresar} className={secundario}>
            Ingresar
          </button>
        )}
      </div>
    </div>
  )
}

export default function PaginaCurso({ cursoId, vista, usuario, onIngresar, onRegistro }) {
  const curso = CURSOS.find((c) => c.id === cursoId)
  const [lecciones, setLecciones] = useState([])
  const [inscrito, setInscrito] = useState(false)
  const [vistas, setVistas] = useState(new Set())
  const [estado, setEstado] = useState('cargando')
  const [activaId, setActivaId] = useState(null)
  const uid = usuario?.id ?? null

  useEffect(() => {
    let vivo = true
    setEstado('cargando')
    setLecciones([])
    setInscrito(false)
    setVistas(new Set())
    setActivaId(null)

    async function cargar() {
      const [l, i, p] = await Promise.all([
        supabase
          .from('lecciones')
          .select('*')
          .eq('curso', cursoId)
          .order('orden', { ascending: true }),
        uid
          ? supabase.from('inscripciones').select('curso').eq('user_id', uid).eq('curso', cursoId)
          : Promise.resolve({ data: [] }),
        uid
          ? supabase.from('progreso').select('leccion_id').eq('user_id', uid)
          : Promise.resolve({ data: [] }),
      ])
      if (!vivo) return
      if (l.error) {
        setEstado('error')
        return
      }
      setLecciones(l.data)
      setInscrito((i.data || []).length > 0)
      setVistas(new Set((p.data || []).map((x) => x.leccion_id)))
      setEstado('listo')
    }

    cargar()
    return () => {
      vivo = false
    }
  }, [cursoId, uid])

  async function alternarVista(leccion) {
    if (!uid) return
    const yaVista = vistas.has(leccion.id)
    const siguiente = new Set(vistas)
    if (yaVista) siguiente.delete(leccion.id)
    else siguiente.add(leccion.id)
    setVistas(siguiente)

    const { error } = yaVista
      ? await supabase
          .from('progreso')
          .delete()
          .eq('user_id', uid)
          .eq('leccion_id', leccion.id)
      : await supabase.from('progreso').insert({ user_id: uid, leccion_id: leccion.id })

    if (error) setVistas(vistas)
  }

  if (!curso) return null

  const avance = lecciones.find((l) => l.publica)
  const tutoriales = lecciones.filter((l) => !l.publica)
  const tieneAcceso = curso.gratis ? Boolean(usuario) : inscrito || tutoriales.length > 0
  const activa = tutoriales.find((l) => l.id === activaId) || tutoriales[0]

  const totalVistas = tutoriales.filter((l) => vistas.has(l.id)).length
  const porcentaje =
    tutoriales.length > 0 ? Math.round((100 * totalVistas) / tutoriales.length) : 0

  const subtab = (activo) =>
    `-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${
      activo ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
    }`

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-40">
      <a href="#inicio" className="text-sm font-semibold text-accent hover:underline">
        ← Volver al inicio
      </a>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="text-6xl">{curso.icono}</span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
              {curso.nivel}
            </span>
            <span className="text-lg font-bold text-ink">{curso.precio}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-5xl">
            {curso.titulo}
          </h1>
        </div>
      </header>

      <div className="mt-8 flex gap-2 border-b border-line">
        <a href={`#/curso/${curso.id}`} className={subtab(vista === 'presentacion')}>
          Presentación
        </a>
        <a href={`#/curso/${curso.id}/lecciones`} className={subtab(vista === 'lecciones')}>
          {tieneAcceso ? '🎬' : '🔒'} Tutoriales
        </a>
      </div>

      {vista === 'presentacion' && (
        <div className="mt-8">
          <p className="max-w-3xl text-lg text-muted">{curso.descLarga}</p>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <Lista titulo="Qué aprenderás" items={curso.aprenderas} />
            <Lista
              titulo="Para empezar"
              items={[...curso.requisitos, `Duración: ${curso.duracion}`]}
            />
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-ink">Tráiler del curso</h2>

            {estado === 'cargando' && <p className="mt-6 text-muted">Cargando...</p>}
            {estado === 'error' && (
              <p className="mt-6 text-muted">
                No pudimos cargar el curso. Recarga la página o escríbenos por WhatsApp.
              </p>
            )}
            {estado === 'listo' && (
              <div className="mt-6 space-y-5">
                {avance && (
                  <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
                    <Reproductor leccion={avance} />
                    <p className="mt-3 font-semibold text-ink">{avance.titulo}</p>
                  </div>
                )}
                <CajaAcceso
                  curso={curso}
                  usuario={usuario}
                  tieneAcceso={tieneAcceso}
                  onIngresar={onIngresar}
                  onRegistro={onRegistro}
                />
              </div>
            )}
          </section>
        </div>
      )}

      {vista === 'lecciones' && (
        <div className="mt-8">
          {estado === 'cargando' && <p className="text-muted">Cargando...</p>}
          {estado === 'error' && (
            <p className="text-muted">
              No pudimos cargar los tutoriales. Recarga la página o escríbenos por WhatsApp.
            </p>
          )}

          {estado === 'listo' && !tieneAcceso && (
            <CajaAcceso
              curso={curso}
              usuario={usuario}
              tieneAcceso={false}
              onIngresar={onIngresar}
              onRegistro={onRegistro}
            />
          )}

          {estado === 'listo' && tieneAcceso && (
            <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
              {tutoriales.length === 0 ? (
                <p className="text-center text-sm text-muted">
                  Muy pronto subiremos los primeros tutoriales.
                </p>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">Tu progreso</span>
                      <span className="text-muted">
                        {totalVistas} de {tutoriales.length} lecciones · {porcentaje}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    {porcentaje === 100 && (
                      <p className="mt-2 text-sm font-semibold text-accent">
                        🎉 ¡Completaste todas las lecciones! Ahora rinde la prueba del nivel.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                    <div>
                      <Reproductor leccion={activa} />
                      <h3 className="mt-3 font-semibold text-ink">{activa.titulo}</h3>
                      {activa.descripcion && (
                        <p className="mt-1 text-sm text-muted">{activa.descripcion}</p>
                      )}
                      <button
                        onClick={() => alternarVista(activa)}
                        className={`mt-4 rounded-full px-5 py-2 text-sm font-semibold transition ${
                          vistas.has(activa.id)
                            ? 'bg-accent text-on-accent'
                            : 'border border-accent text-accent hover:bg-brand-soft'
                        }`}
                      >
                        {vistas.has(activa.id) ? '✓ Lección vista (desmarcar)' : 'Marcar como vista'}
                      </button>
                    </div>

                    <ul className="space-y-2">
                      {tutoriales.map((l, i) => (
                        <li key={l.id}>
                          <button
                            onClick={() => setActivaId(l.id)}
                            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                              activa.id === l.id
                                ? 'border-accent bg-brand-soft text-brand'
                                : 'border-line text-muted hover:text-ink'
                            }`}
                          >
                            {vistas.has(l.id) ? '✓ ' : ''}
                            {i + 1}. {l.titulo}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Prueba curso={curso} />
                  <Entregas curso={curso} />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}