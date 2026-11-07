import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const BUCKET = 'videos-practica'

const NOMBRES = {
  inicial: 'Cartomagia Inicial',
  avanzada: 'Cartomagia Avanzada',
  escenica: 'Magia Escénica y Mentalismo',
}

const fecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })

function Entrega({ e, alumno, onCambio }) {
  const [url, setUrl] = useState(null)
  const [urlDescarga, setUrlDescarga] = useState(null)
  const [texto, setTexto] = useState(e.correccion || '')
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg] = useState(null)

  async function verVideo() {
    setMsg(null)
    const ver = await supabase.storage.from(BUCKET).createSignedUrl(e.ruta, 3600)
    const desc = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(e.ruta, 3600, { download: true })
    if (ver.error) {
      setMsg('No se pudo abrir el video.')
      return
    }
    setUrl(ver.data.signedUrl)
    setUrlDescarga(desc.data?.signedUrl ?? null)
  }

  async function guardar() {
    setGuardando(true)
    const { error } = await supabase
      .from('entregas')
      .update({ correccion: texto.trim(), corregido_en: new Date().toISOString() })
      .eq('id', e.id)
    setGuardando(false)
    setMsg(error ? 'No se pudo guardar la corrección.' : 'Corrección guardada.')
    if (!error) onCambio()
  }

  async function borrarVideo() {
    if (!window.confirm('¿Borrar el video del servidor? Asegúrate de haberlo descargado antes.')) return
    const { error: e1 } = await supabase.storage.from(BUCKET).remove([e.ruta])
    if (e1) {
      setMsg('No se pudo borrar el video.')
      return
    }
    await supabase.from('entregas').update({ video_borrado: true }).eq('id', e.id)
    setUrl(null)
    setUrlDescarga(null)
    onCambio()
  }

  return (
    <li className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-ink">{alumno?.nombre || 'Sin nombre'}</p>
          <p className="text-xs text-muted">{alumno?.email}</p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>{NOMBRES[e.curso] || e.curso}</p>
          <p>{fecha(e.creado)}</p>
        </div>
      </div>

      {e.comentario && <p className="mt-3 text-sm text-muted">Comentario: {e.comentario}</p>}

      {e.video_borrado ? (
        <p className="mt-3 rounded-lg bg-surface p-3 text-sm text-muted">
          Video archivado (borrado del servidor).
        </p>
      ) : url ? (
        <div className="mt-3 space-y-2">
          <video controls src={url} className="w-full rounded-xl bg-black" />
          <div className="flex flex-wrap gap-3 text-sm">
            {urlDescarga && (
              <a href={urlDescarga} className="font-semibold text-accent hover:underline">
                ⬇ Descargar
              </a>
            )}
            <button onClick={borrarVideo} className="font-semibold text-red-500 hover:underline">
              🗑 Borrar del servidor
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={verVideo}
          className="mt-3 rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent hover:bg-brand-soft"
        >
          ▶ Ver video
        </button>
      )}

      <textarea
        value={texto}
        onChange={(ev) => setTexto(ev.target.value)}
        placeholder="Escribe aquí la corrección para el alumno..."
        rows={3}
        className="mt-3 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={guardar}
          disabled={guardando || !texto.trim()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : e.corregido_en ? 'Actualizar corrección' : 'Guardar corrección'}
        </button>
        {msg && <span className="text-xs text-muted">{msg}</span>}
      </div>
    </li>
  )
}

export default function AdminEntregas() {
  const [entregas, setEntregas] = useState([])
  const [alumnos, setAlumnos] = useState({})
  const [soloPendientes, setSoloPendientes] = useState(true)
  const [estado, setEstado] = useState('cargando')

  async function cargar() {
    const [a, b] = await Promise.all([
      supabase.from('entregas').select('*').order('creado', { ascending: false }),
      supabase.from('perfiles').select('id, nombre, email'),
    ])
    if (a.error || b.error) {
      setEstado('error')
      return
    }
    const mapa = {}
    b.data.forEach((p) => {
      mapa[p.id] = p
    })
    setAlumnos(mapa)
    setEntregas(a.data)
    setEstado('listo')
  }

  useEffect(() => {
    cargar()
  }, [])

  const pendientes = entregas.filter((x) => !x.corregido_en).length
  const lista = entregas.filter((x) => !soloPendientes || !x.corregido_en)

  return (
    <section id="entregas" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-3xl font-bold">Videos de los alumnos</h2>
        <p className="mt-2 text-center text-sm text-muted">
          {pendientes} {pendientes === 1 ? 'video pendiente' : 'videos pendientes'} de corregir.
        </p>

        <label className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={soloPendientes}
            onChange={(ev) => setSoloPendientes(ev.target.checked)}
          />
          Mostrar solo los pendientes
        </label>

        {estado === 'cargando' && <p className="mt-6 text-center text-muted">Cargando...</p>}
        {estado === 'error' && (
          <p className="mt-6 text-center text-muted">No se pudieron cargar los videos.</p>
        )}
        {estado === 'listo' && (
          <ul className="mt-6 space-y-4">
            {lista.map((x) => (
              <Entrega key={x.id} e={x} alumno={alumnos[x.user_id]} onCambio={cargar} />
            ))}
            {lista.length === 0 && (
              <p className="text-center text-muted">No hay videos para mostrar.</p>
            )}
          </ul>
        )}
      </div>
    </section>
  )
}