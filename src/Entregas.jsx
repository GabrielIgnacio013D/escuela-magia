import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const MAX_MB = 50
const BUCKET = 'videos-practica'

const fecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Entregas({ curso }) {
  const [uid, setUid] = useState(null)
  const [lista, setLista] = useState([])
  const [abierta, setAbierta] = useState(false)
  const [archivo, setArchivo] = useState(null)
  const [comentario, setComentario] = useState('')
  const [estado, setEstado] = useState('inactivo')
  const [error, setError] = useState(null)
  const [errorCarga, setErrorCarga] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUid(data.user?.id ?? null))
  }, [])

  async function cargar() {
    if (!uid) return
    const { data, error } = await supabase
      .from('entregas')
      .select('id, comentario, correccion, corregido_en, creado, video_borrado')
      .eq('user_id', uid)
      .eq('curso', curso.id)
      .order('creado', { ascending: false })
    if (error) {
      setErrorCarga(true)
      return
    }
    setErrorCarga(false)
    setLista(data || [])
  }

  useEffect(() => {
    if (!uid) return
    cargar()
    const cada30s = setInterval(cargar, 30000)
    const alVolver = () => {
      if (document.visibilityState === 'visible') cargar()
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(cada30s)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [uid])

  function abrir() {
    setAbierta(true)
    setEstado('inactivo')
    setError(null)
    setArchivo(null)
  }

  function elegir(e) {
    const f = e.target.files?.[0]
    setError(null)
    if (!f) return
    if (!f.type.startsWith('video/')) {
      setError('Elige un archivo de video.')
      setArchivo(null)
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(
        `Tu video pesa ${(f.size / 1024 / 1024).toFixed(0)} MB y el máximo es ${MAX_MB} MB. Graba uno más corto o en calidad normal.`
      )
      setArchivo(null)
      return
    }
    setArchivo(f)
  }

  async function subir() {
    if (!archivo || !uid) return
    setEstado('subiendo')
    setError(null)

    const ext = (archivo.name.split('.').pop() || 'mp4')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 5)
    const ruta = `${uid}/${Date.now()}.${ext || 'mp4'}`

    const { error: e1 } = await supabase.storage
      .from(BUCKET)
      .upload(ruta, archivo, { contentType: archivo.type })
    if (e1) {
      setError('No se pudo subir el video. Revisa tu conexión e inténtalo de nuevo.')
      setEstado('inactivo')
      return
    }

    const { error: e2 } = await supabase.from('entregas').insert({
      user_id: uid,
      curso: curso.id,
      ruta,
      comentario: comentario.trim() || null,
    })
    if (e2) {
      setError('El video se subió, pero no pudimos registrarlo. Escríbenos por WhatsApp.')
      setEstado('inactivo')
      return
    }

    setEstado('listo')
    setComentario('')
    setArchivo(null)
    cargar()
  }

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={abrir}
          className="rounded-full border border-accent px-6 py-2 text-sm font-semibold text-accent transition hover:bg-brand-soft"
        >
          📹 Subir video de práctica
        </button>
        <button
          onClick={cargar}
          className="text-sm text-muted underline hover:text-ink"
        >
          Actualizar
        </button>
      </div>

      {errorCarga && (
        <p className="mt-3 text-sm text-red-500">
          No pudimos cargar tus envíos. Recarga la página.
        </p>
      )}

      {lista.length > 0 && (
        <ul className="mt-5 space-y-3">
          {lista.map((x) => (
            <li key={x.id} className="rounded-xl border border-line bg-surface p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-muted">Enviado el {fecha(x.creado)}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    x.corregido_en ? 'bg-accent text-on-accent' : 'bg-brand-soft text-brand'
                  }`}
                >
                  {x.corregido_en ? 'Corregido' : 'En revisión'}
                </span>
              </div>
              {x.comentario && <p className="mt-2 text-muted">Tu comentario: {x.comentario}</p>}
              {x.correccion && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-card p-3 text-ink">
                  <strong>Corrección:</strong> {x.correccion}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {abierta && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-5"
          onClick={() => estado !== 'subiendo' && setAbierta(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-brand">Subir video de práctica</h3>
              <button
                onClick={() => setAbierta(false)}
                disabled={estado === 'subiendo'}
                aria-label="Cerrar"
                className="text-xl text-muted hover:text-ink disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            {estado === 'listo' ? (
              <div className="mt-6 text-center">
                <p className="text-4xl">✅</p>
                <p className="mt-3 text-ink">¡Listo! Recibimos tu video.</p>
                <p className="mt-1 text-sm text-muted">
                  Lo revisaremos y verás nuestra corrección aquí mismo.
                </p>
                <button
                  onClick={() => setAbierta(false)}
                  className="mt-6 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-on-accent"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand">
                  Graba un video de 30 a 60 segundos, en calidad normal (720p). Máximo {MAX_MB} MB.
                  Solo lo verán nuestros profesores.
                </p>

                <input
                  type="file"
                  accept="video/*"
                  onChange={elegir}
                  disabled={estado === 'subiendo'}
                  className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-on-accent"
                />

                {archivo && (
                  <p className="text-sm text-muted">
                    {archivo.name} ({(archivo.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}

                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Algo que quieras contarnos? (opcional)"
                  rows={3}
                  className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                />

                {error && (
                  <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>
                )}

                <button
                  onClick={subir}
                  disabled={!archivo || estado === 'subiendo'}
                  className="w-full rounded-full bg-accent py-3 font-semibold text-on-accent transition disabled:opacity-50"
                >
                  {estado === 'subiendo' ? 'Subiendo... no cierres la página' : 'Enviar video'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}