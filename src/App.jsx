import { motion } from 'framer-motion'

const NOMBRE = 'Escuela RojoDiel'

const cursos = [
  { icono: '🃏', titulo: 'CartoMagia', nivel: 'Principiante', precio: '$0.00', desc: 'Tecnicas y Trucos Basicos para comenzar.' },
  { icono: '🪙', titulo: 'CartoMagia Avanzado', nivel: 'Intermedio', precio: '$4.887', desc: 'Tecnicas Avanzadas, Trucos Avanzados' },
  { icono: '🧠', titulo: 'Mentalismo Y Magia Escenica', nivel: 'Avanzado', precio: '$20.889', desc: 'Magia de escenario avanzada, rutinas completas, con mentalismo' },
]

const productos = [
  { icono: '🎴', nombre: 'Baraja marcada', precio: '$9.990' },
  { icono: '🪄', nombre: 'Varita profesional', precio: '$14.990' },
  { icono: '🎩', nombre: 'Sombrero de copa', precio: '$19.990' },
  { icono: '🔮', nombre: 'Set de monedas', precio: '$12.990' },
]

const aparecer = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-night/70 border-b border-white/10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4">
        <a href="#inicio" className="font-display text-gold text-lg tracking-wide">✦ {NOMBRE}</a>
        <div className="hidden sm:flex gap-6 text-sm text-white/80">
          <a href="#cursos" className="hover:text-gold">Cursos</a>
          <a href="#tienda" className="hover:text-gold">Tienda</a>
          <a href="#contacto" className="hover:text-gold">Contacto</a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center text-center px-5 overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--color-violet-deep),var(--color-night)_70%)]">
      <motion.div {...aparecer} className="max-w-3xl pt-20">
        <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Aprende. Sorprende. Fascina.</p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight">
          Descubre el arte de la <span className="text-gold">magia</span>
        </h1>
        <p className="mt-6 text-white/70 text-lg">
          Clases online paso a paso y todo lo que necesitas para tus presentaciones, en un solo lugar.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#cursos" className="rounded-full bg-gold text-night font-semibold px-8 py-3 hover:scale-105 transition">
            Empieza a aprender
          </a>
          <a href="#tienda" className="rounded-full border border-gold/60 text-gold px-8 py-3 hover:bg-gold/10 transition">
            Ver la tienda
          </a>
        </div>
      </motion.div>
    </section>
  )
}

function Cursos() {
  return (
    <section id="cursos" className="mx-auto max-w-6xl px-5 py-24">
      <motion.h2 {...aparecer} className="font-display text-3xl sm:text-4xl text-center">Nuestros cursos</motion.h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cursos.map((c, i) => (
          <motion.div
            key={c.titulo}
            {...aparecer}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col"
          >
            <div className="text-5xl">{c.icono}</div>
            <h3 className="mt-4 font-display text-xl text-gold">{c.titulo}</h3>
            <span className="mt-1 text-xs uppercase tracking-wider text-white/50">{c.nivel}</span>
            <p className="mt-3 text-white/70 text-sm flex-1">{c.desc}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-lg font-semibold">{c.precio}</span>
              <button className="rounded-full bg-gold text-night text-sm font-semibold px-5 py-2 hover:scale-105 transition">
                Inscribirme
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Tienda() {
  return (
    <section id="tienda" className="bg-violet-deep/60 py-24 px-5">
      <div className="mx-auto max-w-6xl">
        <motion.h2 {...aparecer} className="font-display text-3xl sm:text-4xl text-center">Tienda de magia</motion.h2>
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {productos.map((p, i) => (
            <motion.div
              key={p.nombre}
              {...aparecer}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.04 }}
              className="rounded-2xl border border-white/10 bg-night/60 p-5 text-center"
            >
              <div className="text-5xl sm:text-6xl">{p.icono}</div>
              <h3 className="mt-4 text-sm sm:text-base font-medium">{p.nombre}</h3>
              <p className="mt-1 text-gold font-semibold">{p.precio}</p>
              <button className="mt-4 w-full rounded-full border border-gold/60 text-gold text-sm py-2 hover:bg-gold/10 transition">
                Agregar
              </button>
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
        <h2 className="font-display text-3xl sm:text-4xl">¿Tienes dudas?</h2>
        <p className="mt-4 text-white/70">Escríbenos y te ayudamos a elegir tu primer curso.</p>
        <a
          href="https://wa.me/56940533981"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-8 rounded-full bg-gold text-night font-semibold px-8 py-3 hover:scale-105 transition"
        >
          Escribir por WhatsApp
        </a>
      </motion.div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Cursos />
      <Tienda />
      <Contacto />
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {NOMBRE}. Todos los derechos reservados.
      </footer>
    </>
  )
}