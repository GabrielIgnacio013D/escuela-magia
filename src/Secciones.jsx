import { useState } from 'react'
import { motion } from 'framer-motion'
import { FUNDADORES, FAQ } from './datos'

const aparecer = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export function QuienesSomos() {
  return (
    <section id="quienes" className="bg-surface px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2 {...aparecer} className="text-center font-display text-3xl font-bold sm:text-4xl">
          Quiénes somos
        </motion.h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          Dos apasionados de la magia que quieren enseñarte lo que a ellos les hubiera gustado
          aprender al empezar.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FUNDADORES.map((f, i) => (
            <motion.div
              key={f.nombre}
              {...aparecer}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-line bg-card p-6 text-center"
            >
              {f.foto ? (
                <img
                  src={f.foto}
                  alt={f.nombre}
                  className="mx-auto h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-brand-soft font-display text-5xl font-bold text-brand">
                  {f.nombre.charAt(0)}
                </div>
              )}
              <h3 className="mt-4 font-display text-xl font-bold text-brand">{f.nombre}</h3>
              <p className="text-xs uppercase tracking-wider text-muted">{f.rol}</p>
              <p className="mt-3 text-sm text-muted">{f.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const [abierta, setAbierta] = useState(null)

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
      <motion.h2 {...aparecer} className="text-center font-display text-3xl font-bold sm:text-4xl">
        Preguntas frecuentes
      </motion.h2>

      <div className="mt-10 space-y-3">
        {FAQ.map((x, i) => {
          const activa = abierta === i
          return (
            <div key={x.p} className="rounded-2xl border border-line bg-card">
              <button
                onClick={() => setAbierta(activa ? null : i)}
                aria-expanded={activa}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink"
              >
                <span>{x.p}</span>
                <span className="text-xl text-accent">{activa ? '−' : '+'}</span>
              </button>
              {activa && <p className="px-5 pb-5 text-sm text-muted">{x.r}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}