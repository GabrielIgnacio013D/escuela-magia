import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const NOMBRES = {
  inicial: 'Cartomagia Inicial',
  avanzada: 'Cartomagia Avanzada',
  escenica: 'Magia Escénica y Mentalismo',
}

const formato = (n) => Number(n).toFixed(1).replace('.', ',')

const fecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminNotas() {
  const [intentos, setIntentos] = useState([])
  const [alumnos, setAlumnos] = useState({})
  const [buscar, setBuscar] = useState('')
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    let vivo = true
    async function cargar() {
      const [a, b] = await Promise.all([
        supabase.from('intentos').select('*').order('creado', { ascending: false }),
        supabase.from('perfiles').select('id, nombre, email'),
      ])
      if (!vivo) return
      if (a.error || b.error) {
        setEstado('error')
        return
      }
      const mapa = {}
      b.data.forEach((p) => {
        mapa[p.id] = p
      })
      setAlumnos(mapa)
      setIntentos(a.data)
      setEstado('listo')
    }
    cargar()
    return () => {
      vivo = false
    }
  }, [])

  const lista = intentos.filter((x) => {
    const al = alumnos[x.user_id]
    const texto = `${al?.nombre || ''} ${al?.email || ''}`.toLowerCase()
    return texto.includes(buscar.toLowerCase())
  })

  return (
    <section id="notas" className="bg-surface px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-3xl font-bold">Notas de las pruebas</h2>
        <p className="mt-2 text-center text-sm text-muted">
          {intentos.length} {intentos.length === 1 ? 'intento registrado' : 'intentos registrados'}.
        </p>

        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por nombre o correo"
          className="mt-8 w-full rounded-xl border border-line bg-card px-4 py-3 text-ink outline-none focus:border-accent"
        />

        {estado === 'cargando' && <p className="mt-6 text-center text-muted">Cargando...</p>}
        {estado === 'error' && (
          <p className="mt-6 text-center text-muted">No se pudieron cargar las notas.</p>
        )}

        {estado === 'listo' && (
          <ul className="mt-6 space-y-3">
            {lista.map((x) => {
              const al = alumnos[x.user_id]
              const aprobo = Number(x.nota) >= 4
              return (
                <li
                  key={x.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4"
                >
                  <div>
                    <p className="font-semibold text-ink">{al?.nombre || 'Sin nombre'}</p>
                    <p className="text-xs text-muted">{al?.email}</p>
                    <p className="mt-1 text-xs text-muted">
                      {NOMBRES[x.curso] || x.curso} · {fecha(x.creado)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-display text-3xl font-bold ${
                        aprobo ? 'text-accent' : 'text-red-500'
                      }`}
                    >
                      {formato(x.nota)}
                    </p>
                    <p className="text-xs text-muted">
                      {x.aciertos} de {x.total} correctas
                    </p>
                  </div>
                </li>
              )
            })}
            {lista.length === 0 && (
              <p className="text-center text-muted">No hay notas que coincidan.</p>
            )}
          </ul>
        )}
      </div>
    </section>
  )
}