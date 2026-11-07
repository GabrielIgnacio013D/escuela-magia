import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const PAGOS = [
  { id: 'avanzada', nombre: 'Cartomagia Avanzada' },
  { id: 'escenica', nombre: 'Magia Escénica y Mentalismo' },
]

export default function Admin() {
  const [alumnos, setAlumnos] = useState([])
  const [inscs, setInscs] = useState([])
  const [buscar, setBuscar] = useState('')
  const [estado, setEstado] = useState('cargando')
  const [ocupado, setOcupado] = useState(null)

  async function cargar() {
    const [a, i] = await Promise.all([
      supabase
        .from('perfiles')
        .select('id, nombre, email, es_admin, creado')
        .order('creado', { ascending: false }),
      supabase.from('inscripciones').select('user_id, curso'),
    ])
    if (a.error || i.error) {
      setEstado('error')
      return
    }
    setAlumnos(a.data)
    setInscs(i.data)
    setEstado('listo')
  }

  useEffect(() => {
    cargar()
  }, [])

  const tiene = (id, curso) => inscs.some((x) => x.user_id === id && x.curso === curso)

  async function alternar(alumno, curso) {
    setOcupado(alumno.id + curso)
    const { error } = tiene(alumno.id, curso)
      ? await supabase
          .from('inscripciones')
          .delete()
          .eq('user_id', alumno.id)
          .eq('curso', curso)
      : await supabase.from('inscripciones').insert({ user_id: alumno.id, curso })
    if (error) alert('No se pudo guardar el cambio. Intenta de nuevo.')
    await cargar()
    setOcupado(null)
  }

  const lista = alumnos.filter((a) =>
    `${a.nombre} ${a.email}`.toLowerCase().includes(buscar.toLowerCase())
  )

  return (
    <section id="admin" className="bg-brand-soft px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-3xl font-bold">Panel de administración</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Solo lo ven los administradores. {alumnos.length} cuentas registradas.
        </p>

        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por nombre o correo"
          className="mt-8 w-full rounded-xl border border-line bg-card px-4 py-3 text-ink outline-none focus:border-accent"
        />

        {estado === 'cargando' && <p className="mt-6 text-center text-muted">Cargando...</p>}
        {estado === 'error' && (
          <p className="mt-6 text-center text-muted">
            No se pudo cargar la lista. Revisa que tu cuenta sea administradora.
          </p>
        )}

        {estado === 'listo' && (
          <ul className="mt-6 space-y-3">
            {lista.map((a) => (
              <li key={a.id} className="rounded-2xl border border-line bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{a.nombre || 'Sin nombre'}</span>
                  {a.es_admin && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{a.email}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {PAGOS.map((c) => {
                    const activo = tiene(a.id, c.id)
                    return (
                      <button
                        key={c.id}
                        onClick={() => alternar(a, c.id)}
                        disabled={ocupado === a.id + c.id}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                          activo
                            ? 'bg-accent text-on-accent'
                            : 'border border-line text-muted hover:text-ink'
                        }`}
                      >
                        {activo ? '✓ ' : '+ '}
                        {c.nombre}
                      </button>
                    )
                  })}
                </div>
              </li>
            ))}
            {lista.length === 0 && (
              <p className="text-center text-muted">No hay cuentas que coincidan.</p>
            )}
          </ul>
        )}
      </div>
    </section>
  )
}