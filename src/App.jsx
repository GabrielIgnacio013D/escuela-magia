import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabase'
import AuthModal from './AuthModal'

const NOMBRE = 'Magia Club'
const WA_GABO = '56940533981'
const WA_XINO = '56975457092'

const wa = (numero, texto) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`

const cursos = [
  {
    icono: '🃏',
    titulo: 'Cartomagia Inicial',
    nivel: 'Principiante',
    precio: 'Gratis',
    gratis: true,
    desc: 'Entra al mundo de la cartomagia sin tecnicismos: técnicas básicas y trucos en video que podrás lograr desde el primer día.',
    cta: 'Empezar gratis',
    mensaje: 'Hola! Quiero empezar el curso gratuito de Cartomagia Inicial',
  },
  {
    icono: '♠️',
    titulo: 'Cartomagia Avanzada',
    nivel: 'Intermedio',
    precio: '$4.500',
    desc: 'Lleva tus técnicas al siguiente nivel con manipulaciones, controles y rutinas completas explicadas paso a paso.',
    cta: 'Inscribirme',
    mensaje: 'Hola! Quiero inscribirme en Cartomagia Avanzada ($4.500)',
  },
  {
    icono: '🎩',
    titulo: 'Magia Escénica y Mentalismo',
    nivel: 'Avanzado',
    precio: '$20.000',
    desc: 'Presentación, psicología y efectos para escenario. Aprende a crear momentos que nadie olvida.',
    cta: 'Inscribirme',
    mensaje: 'Hola! Quiero inscribirme en Magia Escénica y Mentalismo ($20.000)',
  },
]

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

function Navbar({ tema, cambiarTema, usuario, onIngresar, onSalir }) {
  const nombre = usuario?.user_metadata?.nombre || usuario?.email

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-bg/80 border-b border-line">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4">
        <a href="#inicio" className="font-display text-brand text-lg font-bold tracking-wide">
          ✦ {NOMBRE}
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 text-sm text-muted">
            <a href="#cursos" className="hover:text-brand">Cursos</a>
            <a href="#como" className="hover:text-brand">Cómo funciona</a>
            <a href="#contacto" className="hover:text-brand">Contacto</a>
          </div>
          {usuario ? (
            <>
              <span className="hidden sm:inline text-sm text-muted">Hola, {nombre}</span>
              <button
                onClick={onSalir}
                className="rounded-full border border-line text-sm px-4 py-2 hover:bg-brand-soft transition"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={onIngresar}
              className="rounded-full bg-accent text-on-accent text-sm font-semibold px-5 py-2 hover:scale-105 transition"
            >
              Ingresar
            </button>
          )}
          <button
            onClick={cambiarTema}
            aria-label="Cambiar entre tema claro y oscuro"
            className="rounded-full border border-line bg-card w-10 h-10 flex items-center justify-center hover:scale-105 transition"
          >
            {tema === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}
function Hero() {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center text-center px-5 bg-[radial-gradient(ellipse_at_top,var(--brand-soft),var(--bg)_70%)]"
    >
      <motion.div {...aparecer} className="max-w-3xl pt-20">
        <p className="text-accent tracking-[0.3em] text-xs uppercase mb-4 font-semibold">
          Aprende. Sorprende. Fascina.
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight text-ink">
          Aprende magia <span className="text-accent">desde cero</span>
        </h1>
        <p className="mt-6 text-muted text-lg">
          Empieza gratis con cartomagia y avanza hasta la magia escénica y el mentalismo, con
          videos, pruebas y correcciones personalizadas.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#cursos"
            className="rounded-full bg-accent text-on-accent font-semibold px-8 py-3 hover:scale-105 transition"
          >
            Ver los cursos
          </a>
          <a
            href="#como"
            className="rounded-full border border-accent text-accent px-8 py-3 hover:bg-brand-soft transition"
          >
            ¿Cómo funciona?
          </a>
        </div>
      </motion.div>
    </section>
  )
}

function Cursos() {
  return (
    <section id="cursos" className="mx-auto max-w-6xl px-5 py-24">
      <motion.h2 {...aparecer} className="font-display text-3xl sm:text-4xl text-center font-bold">
        Tres niveles, un solo camino
      </motion.h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cursos.map((c, i) => (
          <motion.div
            key={c.titulo}
            {...aparecer}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl border border-line bg-card p-6 flex flex-col shadow-sm"
          >
            {c.gratis && (
              <span className="absolute -top-3 right-5 rounded-full bg-accent text-on-accent text-xs font-semibold px-3 py-1">
                Gratis
              </span>
            )}
            <div className="text-5xl">{c.icono}</div>
            <h3 className="mt-4 font-display text-xl font-bold text-brand">{c.titulo}</h3>
            <span className="mt-1 text-xs uppercase tracking-wider text-muted">{c.nivel}</span>
            <p className="mt-3 text-muted text-sm flex-1">{c.desc}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold">{c.precio}</span>
              <a
                href={wa(WA_GABO, c.mensaje)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent text-on-accent text-sm font-semibold px-5 py-2 hover:scale-105 transition"
              >
                {c.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Como() {
  return (
    <section id="como" className="bg-surface py-24 px-5">
      <div className="mx-auto max-w-6xl">
        <motion.h2 {...aparecer} className="font-display text-3xl sm:text-4xl text-center font-bold">
          Así aprendes
        </motion.h2>
        <p className="mt-3 text-center text-muted text-sm">
          Estamos terminando tu cuenta personal, las pruebas y la subida de videos. ¡Muy pronto!
        </p>
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
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
        <h2 className="font-display text-3xl sm:text-4xl font-bold">¿Tienes dudas?</h2>
        <p className="mt-4 text-muted">
          Escríbenos por WhatsApp y te ayudamos a elegir tu primer curso.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={wa(WA_GABO, 'Hola Gabo! Tengo una consulta sobre la escuela de magia')}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent text-on-accent font-semibold px-8 py-3 hover:scale-105 transition"
          >
            Escribir a Gabo
          </a>
          <a
            href={wa(WA_XINO, 'Hola Xino! Tengo una consulta sobre la escuela de magia')}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-accent text-accent font-semibold px-8 py-3 hover:bg-brand-soft transition"
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
  const [usuario, setUsuario] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUsuario(data.session?.user ?? null))

    const { data: sub } = supabase.auth.onAuthStateChange((evento, sesion) => {
      setUsuario(sesion?.user ?? null)
      if (evento === 'PASSWORD_RECOVERY') setModal('nueva')
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <>
      <Navbar
        tema={tema}
        cambiarTema={cambiarTema}
        usuario={usuario}
        onIngresar={() => setModal('login')}
        onSalir={() => supabase.auth.signOut()}
      />
      <Hero />
      <Cursos />
      <Como />
      <Contacto />
      <footer className="border-t border-line py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {NOMBRE}. Todos los derechos reservados.
      </footer>
      {modal && <AuthModal modoInicial={modal} onClose={() => setModal(null)} />}
    </>
  )
}