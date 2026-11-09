import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { CURSOS } from './datos'

const EJEMPLO = 'M7lc1UVf-VE'

function sacarId(texto) {
  const t = texto.trim()
  if (/^[\w-]{11}$/.test(t)) return t
  const m = t.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/)
  return m ? m[1] : null
}

function Fila({ l, onCambio }) {
  const [titulo, setTitulo] = useState(l.titulo)
  const [descripcion, setDescripcion] = useState(l.descripcion || '')
  const [orden, setOrden] = useState(l.orden)
  const [publica, setPublica] = useState(Boolean(l.publica))
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg] = useState(null)

  const campo =
    'w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent'

  async function guardar() {
    setGuardando(true)
    setMsg(null)
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        titulo: titulo.trim() || l.titulo,
        descripcion: descripcion.trim() || null,
        orden: Number(orden) || 0,
        publica,
      })
      .eq('id', l.id)
      .select('id')
    setGuardando(false)
    if (error || !data || data.length === 0) {
      setMsg('No se pudo guardar.')
      return
    }
    setMsg('Guardado.')
    onCambio()
  }

  async function borrar() {
    if (!window.confirm(`¿Borrar la lección "${l.titulo}"? Esto no borra el video de YouTube.`)) return
    const { error } = await supabase.from('lecciones').delete().eq('id', l.id)
    if (error) {
      setMsg('No se pudo borrar.')
      return
    }
    onCambio()
  }

  return (
    <li className="rounded-xl border border-line bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
        <div>
          <label className="text-xs text-muted">Orden</label>
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className={campo}
          />
        </div>
        <div>
          <label className="text-xs text-muted">Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={campo} />
        </div>
      </div>

      <label className="mt-3 block text-xs text-muted">Descripción (opcional)</label>
      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className={campo}
      />

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <label className="flex items-center gap-2 text-muted">
          <input type="checkbox" checked={publica} onChange={(e) => setPublica(e.target.checked)} />
          Público (tráiler o bienvenida)
        </label>
        <a
          href={`https://youtu.be/${l.youtube_id}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          ▶ Probar en YouTube
        </a>
        {l.youtube_id === EJEMPLO && (
          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
            Video de ejemplo
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={guardar}
          disabled={guardando}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={borrar} className="text-sm font-semibold text-red-500 hover:underline">
          🗑 Borrar
        </button>
        {msg && <span className="text-xs text-muted">{msg}</span>}
      </div>
    </li>
  )
}

export default function AdminLecciones() {
  const [lecciones, setLecciones] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [curso, setCurso] = useState('inicial')
  const [publica, setPublica] = useState(false)
  const [texto, setTexto] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [aviso, setAviso] = useState(null)

  async function cargar() {
    const { data, error } = await supabase
      .from('lecciones')
      .select('*')
      .order('orden', { ascending: true })
    if (error) {
      setEstado('error')
      return
    }
    setLecciones(data)
    setEstado('listo')
  }

  useEffect(() => {
    cargar()
  }, [])

  async function agregar() {
    setAviso(null)
    const lineas = texto
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
    if (lineas.length === 0) {
      setAviso({ tipo: 'error', texto: 'Pega al menos un enlace de YouTube.' })
      return
    }

    const existentes = lecciones.filter((l) => l.curso === curso && Boolean(l.publica) === publica)
    let siguiente = existentes.length > 0 ? Math.max(...existentes.map((l) => l.orden)) + 1 : publica ? 0 : 1

    const filas = []
    const malas = []
    lineas.forEach((linea) => {
      const [enlace, ...resto] = linea.split('|')
      const id = sacarId(enlace)
      if (!id) {
        malas.push(linea)
        return
      }
      filas.push({
        curso,
        orden: siguiente,
        titulo: resto.join('|').trim() || `Lección ${siguiente}`,
        descripcion: null,
        youtube_id: id,
        publica,
      })
      siguiente += 1
    })

    if (filas.length === 0) {
      setAviso({ tipo: 'error', texto: 'No encontré ningún enlace de YouTube válido en esas líneas.' })
      return
    }

    setAgregando(true)
    const { error } = await supabase.from('lecciones').insert(filas)
    setAgregando(false)
    if (error) {
      setAviso({ tipo: 'error', texto: 'No se pudieron agregar. Revisa que tu cuenta sea administradora.' })
      return
    }
    setTexto('')
    setAviso({
      tipo: 'ok',
      texto:
        `Se agregaron ${filas.length} ${filas.length === 1 ? 'video' : 'videos'}.` +
        (malas.length > 0 ? ` No pude leer ${malas.length} línea(s): ${malas.join(' / ')}` : ''),
    })
    cargar()
  }

  const campo =
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent'

  return (
    <section id="clases" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-3xl font-bold">Lecciones y videos</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Agrega los videos de cada curso pegando sus enlaces de YouTube.
        </p>

        <div className="mt-8 rounded-2xl border border-line bg-card p-5">
          <h3 className="font-semibold text-ink">Agregar videos</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted">Curso</label>
              <select value={curso} onChange={(e) => setCurso(e.target.value)} className={campo}>
                {CURSOS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-end gap-2 pb-3 text-sm text-muted">
              <input type="checkbox" checked={publica} onChange={(e) => setPublica(e.target.checked)} />
              Es el tráiler o la bienvenida (lo ve cualquiera)
            </label>
          </div>

          <label className="mt-4 block text-xs text-muted">
            Un enlace por línea. Si quieres, agrega el título después de una barra | 
          </label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={6}
            placeholder={
              'https://youtu.be/ABC123xyz | Cómo sostener la baraja\nhttps://www.youtube.com/watch?v=DEF456uvw | Tu primer truco'
            }
            className={`${campo} mt-1 font-mono`}
          />

          {aviso && (
            <p
              className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                aviso.tipo === 'ok' ? 'bg-brand-soft text-brand' : 'bg-red-500/10 text-red-500'
              }`}
            >
              {aviso.texto}
            </p>
          )}

          <button
            onClick={agregar}
            disabled={agregando}
            className="mt-4 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-on-accent disabled:opacity-50"
          >
            {agregando ? 'Agregando...' : 'Agregar videos'}
          </button>
        </div>

        {estado === 'cargando' && <p className="mt-8 text-center text-muted">Cargando...</p>}
        {estado === 'error' && (
          <p className="mt-8 text-center text-muted">No se pudieron cargar las lecciones.</p>
        )}

        {estado === 'listo' &&
          CURSOS.map((c) => {
            const lista = lecciones.filter((l) => l.curso === c.id)
            return (
              <div key={c.id} className="mt-10">
                <h3 className="font-display text-xl font-bold text-brand">
                  {c.icono} {c.titulo}
                </h3>
                {lista.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">Todavía no hay lecciones en este curso.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {lista.map((l) => (
                      <Fila key={l.id} l={l} onCambio={cargar} />
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
      </div>
    </section>
  )
}