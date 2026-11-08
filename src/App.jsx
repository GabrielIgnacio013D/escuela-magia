import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabase'
import AuthModal from './AuthModal'
import PaginaCurso from './PaginaCurso'
import Privacidad from './Privacidad'
import VideoModal from './VideoModal'
import Admin from './Admin'
import AdminEntregas from './AdminEntregas'
import AdminNotas from './AdminNotas'
import { QuienesSomos, Faq } from './Secciones'
import { NOMBRE, WA_GABO, WA_XINO, wa, CURSOS } from './datos'

const pasos = [
  { icono: '🎬', titulo: 'Mira las clases', desc: 'Videos cortos con cada técnica explicada paso a paso.' },
  { icono: '🃏', titulo: 'Practica', desc: 'Aprende los trucos que podrás hacer con esas técnicas.' },
  { icono: '📝', titulo: 'Rinde tu prueba', desc: 'Una prueba escrita al final de cada nivel.' },
  { icono: '📹', titulo: 'Sube tu video', desc: 'Nosotros lo revisamos y te decimos qué mejorar.' },
]

const aparecer = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

function useTema() {
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('tema') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = tema
    try {
      localStorage.setItem('tema', tema)
    } catch {}
  }, [tema])

  const cambiar = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'))
  return [tema, cambiar]
}

function useRuta() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const alCambiar = () => setHash(window.location.hash)
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  const m = hash.match(/^#\/curso\/([a-z]+)(\/lecciones)?/)
  const cursoId = m && CURSOS.some((c) => c.id === m[1]) ? m[1] : null
  const vista = m && m[2] ? 'lecciones' : 'presentacion'
  const esPrivacidad = hash === '#/privacidad'

  useEffect(() => {
    if (cursoId || esPrivacidad) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.replace('#', '')
    if (!id || id.startsWith('/')) return
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60)
    return () => clearTimeout(t)
  }, [cursoId, vista, esPrivacidad, hash])

  return { cursoId, vista, esPrivacidad }
}

function Navbar({
  tema,
  cambiarTema,
  usuario,
  esAdmin,
  pendientes,
  cursoId,
  inicioActivo,
  onIngresar,
  onSalir,
}) {
  const nombre = usuario?.user_metadata?.nombre || usuario?.email

  const tab = (activa) =>
    `shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
      activa ? 'bg-accent text-on-accent' : 'text-muted hover:bg-brand-soft hover:text-ink'
    }`

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pb-2 pt-3">
        <a href="#inicio" className="font-display text-lg font-bold tracking-wide text-brand">
          ✦ {NOMBRE}
        </a>
        <div className="flex items-center gap-3 sm:gap-4">
          {esAdmin && (
            <div className="flex gap-3 text-xs font-semibold text-accent sm:text-sm">
              <a href="#entregas" className="flex items-center hover:underline">
                Videos
                {pendientes > 0 && (
                  <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {pendientes}
                  </span>
                )}
              </a>
              <a href="#notas" className="hover:underline">Notas</a>
              <a href="#admin" className="hover:underline">Alumnos</a>
            </div>
          )}
          {usuario ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">Hola, {nombre}</span>
              <button
                onClick={onSalir}
                className="rounded-full border border-line px-4 py-2 text-sm transition hover:bg-brand-soft"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={onIngresar}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition hover:scale-105"
            >
              Ingresar
            </button>
          )}
          <button
            onClick={cambiarTema}
            aria-label="Cambiar entre tema claro y oscuro"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card transition hover:scale-105"
          >
            {tema === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <a href="#inicio" className={tab(inicioActivo)}>
          Inicio
        </a>
        {CURSOS.map((c) => (
          <a key={c.id} href={`#/curso/${c.id}`} className={tab(cursoId === c.id)}>
            {c.icono} {c.corto}
          </a>
        ))}
        <a href="#quienes" className={tab(false)}>
          Nosotros
        </a>
        <a href="#faq" className={tab(false)}>
          Preguntas
        </a>
        <a href="#contacto" className={tab(false)}>
          Contacto
        </a>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section
      id="inicio"
      className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--brand-soft),var(--bg)_70%)] px-5 text-center"
    >
      <motion.div {...aparecer} className="max-w-3xl pt-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Aprende. Sorprende. Fascina.
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
          Aprende magia <span className="text-accent">desde cero</span>
        </h1>
        <p className="mt-6 text-lg text-muted">
          Empieza gratis con cartomagia y avanza hasta la magia escénica y el mentalismo, con
          videos, pruebas y correcciones personalizadas.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#cursos"
            className="rounded-full bg-accent px-8 py-3 font-semibold text-on-accent transition hover:scale-105"
          >
            Ver los cursos
          </a>
          <a
            href="#como"
            className="rounded-full border border-accent px-8 py-3 text-accent transition hover:bg-brand-soft"
          >
            ¿Cómo funciona?
          </a>
        </div>
      </motion.div>
    </section>
  )
}

function Cursos() {
  const [avances, setAvances] = useState({})
  const [video, setVideo] = useState(null)

  useEffect(() => {
    supabase
      .from('lecciones')
      .select('curso, orden, titulo, youtube_id')
      .eq('publica', true)
      .order('orden', { ascending: true })
      .then(({ data }) => {
        const mapa = {}
        const lista = data || []
        lista.forEach((l) => {
          if (!mapa[l.curso]) mapa[l.curso] = l
        })
        setAvances(mapa)
      })
  }, [])

  return (
    <section id="cursos" className="mx-auto max-w-6xl px-5 py-24">
      <motion.h2 {...aparecer} className="text-center font-display text-3xl font-bold sm:text-4xl">
        Tres niveles, un solo camino
      </motion.h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CURSOS.map((c, i) => (
          <motion.div
            key={c.id}
            {...aparecer}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="relative flex flex-col rounded-2xl border border-line bg-card p-6 shadow-sm"
          >
            {c.gratis && (
              <span className="absolute -top-3 right-5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">
                Gratis
              </span>
            )}
            <div className="text-5xl">{c.icono}</div>
            <h3 className="mt-4 font-display text-xl font-bold text-brand">{c.titulo}</h3>
            <span className="mt-1 text-xs uppercase tracking-wider text-muted">{c.nivel}</span>
            <p className="mt-3 flex-1 text-sm text-muted">{c.desc}</p>
            {avances[c.id] && (
              <button
                onClick={() => setVideo(avances[c.id])}
                className="mt-4 text-left text-sm font-semibold text-accent hover:underline"
              >
                ▶ Ver avance del curso
              </button>
            )}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold">{c.precio}</span>
              <a
                href={`#/curso/${c.id}`}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition hover:scale-105"
              >
                Ver curso →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
    </section>
  )
}

function Como() {
  return (
    <section id="como" className="bg-surface px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2 {...aparecer} className="text-center font-display text-3xl font-bold sm:text-4xl">
          Así aprendes
        </motion.h2>
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {pasos.map((p, i) => (
            <motion.div
              key={p.titulo}
              {...aparecer}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-line bg-card p-5 text-center"
            >
              <div className="text-4xl">{p.icono}</div>
              <h3 className="mt-3 font-semibold text-brand">
                {i + 1}. {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contacto() {
  return (
    <section id="contacto" className="mx-auto max-w-2xl px-5 py-24 text-center">
      <motion.div {...aparecer}>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">¿Tienes dudas?</h2>
        <p className="mt-4 text-muted">
          Escríbenos por WhatsApp y te ayudamos a elegir tu primer curso.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={wa(WA_GABO, 'Hola Gabo! Tengo una consulta sobre la escuela de magia')}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-8 py-3 font-semibold text-on-accent transition hover:scale-105"
          >
            Escribir a Gabo
          </a>
          <a
            href={wa(WA_XINO, 'Hola Xino! Tengo una consulta sobre la escuela de magia')}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-accent px-8 py-3 font-semibold text-accent transition hover:bg-brand-soft"
          >
            Escribir al Xino
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default function App() {
  const [tema, cambiarTema] = useTema()
  const { cursoId, vista, esPrivacidad } = useRuta()
  const [usuario, setUsuario] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [pendientes, setPendientes] = useState(0)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUsuario(data.session?.user ?? null))

    const { data: sub } = supabase.auth.onAuthStateChange((evento, sesion) => {
      setUsuario(sesion?.user ?? null)
      if (evento === 'PASSWORD_RECOVERY') setModal('nueva')
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const uid = usuario?.id

  useEffect(() => {
    if (!uid) {
      setEsAdmin(false)
      return
    }
    supabase
      .from('perfiles')
      .select('es_admin')
      .eq('id', uid)
      .maybeSingle()
      .then(({ data }) => setEsAdmin(Boolean(data?.es_admin)))
  }, [uid])

  useEffect(() => {
    if (!esAdmin) {
      setPendientes(0)
      return
    }
    let vivo = true
    async function contar() {
      const { count } = await supabase
        .from('entregas')
        .select('id', { count: 'exact', head: true })
        .is('corregido_en', null)
      if (vivo) setPendientes(count ?? 0)
    }
    contar()
    const cada60s = setInterval(contar, 60000)
    return () => {
      vivo = false
      clearInterval(cada60s)
    }
  }, [esAdmin])

  useEffect(() => {
    document.title =
      pendientes > 0
        ? `(${pendientes}) ${NOMBRE}`
        : `${NOMBRE} | Aprende magia desde cero`
  }, [pendientes])

  return (
    <>
      <Navbar
        tema={tema}
        cambiarTema={cambiarTema}
        usuario={usuario}
        esAdmin={esAdmin}
        pendientes={pendientes}
        cursoId={cursoId}
        inicioActivo={!cursoId && !esPrivacidad}
        onIngresar={() => setModal('login')}
        onSalir={() => supabase.auth.signOut()}
      />

      {esPrivacidad ? (
        <Privacidad />
      ) : cursoId ? (
        <PaginaCurso
          key={cursoId}
          cursoId={cursoId}
          vista={vista}
          usuario={usuario}
          onIngresar={() => setModal('login')}
          onRegistro={() => setModal('registro')}
        />
      ) : (
        <>
          <Hero />
          {esAdmin && (
            <>
              <AdminEntregas />
              <AdminNotas />
              <Admin />
            </>
          )}
          <Cursos />
          <Como />
          <QuienesSomos />
          <Faq />
          <Contacto />
        </>
      )}

      <footer className="border-t border-line px-5 py-8 text-center text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {NOMBRE}. Todos los derechos reservados.
        </p>
        <p className="mt-2">
          <a href="#/privacidad" className="underline hover:text-ink">
            Política de privacidad
          </a>
        </p>
      </footer>
      {modal && <AuthModal modoInicial={modal} onClose={() => setModal(null)} />}
    </>
  )
}