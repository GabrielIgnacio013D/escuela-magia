import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const formato = (n) => Number(n).toFixed(1).replace('.', ',')

function VentanaPrueba({ curso, onClose, onTerminar }) {
  const [preguntas, setPreguntas] = useState(null)
  const [resp, setResp] = useState({})
  const [resultado, setResultado] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.rpc('obtener_prueba', { p_curso: curso.id }).then(({ data, error }) => {
      if (error) setError('No pudimos cargar la prueba.')
      else setPreguntas(data)
    })
  }, [curso.id])

  const completa =
    preguntas && preguntas.length > 0 && preguntas.every((p) => resp[p.id] !== undefined)

  async function enviar() {
    setEnviando(true)
    setError(null)
    const { data, error } = await supabase.rpc('enviar_prueba', {
      p_curso: curso.id,
      p_respuestas: resp,
    })
    setEnviando(false)
    if (error) {
      setError('No pudimos enviar tu prueba. Intenta de nuevo.')
      return
    }
    setResultado(data)
    onTerminar()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-brand">Prueba: {curso.titulo}</h3>
          <button onClick={onClose} aria-label="Cerrar" className="text-xl text-muted hover:text-ink">
            ✕
          </button>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}

        {!preguntas && !error && <p className="mt-6 text-center text-muted">Cargando prueba...</p>}

        {preguntas && preguntas.length === 0 && (
          <p className="mt-6 text-center text-muted">Aún no hay una prueba para este curso.</p>
        )}

        {resultado && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              {resultado.aciertos} de {resultado.total} respuestas correctas
            </p>
            <p className="mt-2 font-display text-5xl font-bold text-brand">
              {formato(resultado.nota)}
            </p>
            <p className="mt-3 text-ink">
              {Number(resultado.nota) >= 4
                ? '¡Aprobaste! Buen trabajo.'
                : 'Aún no llegas al 4,0. Repasa las lecciones y vuelve a intentarlo.'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-on-accent"
            >
              Cerrar
            </button>
          </div>
        )}

        {preguntas && preguntas.length > 0 && !resultado && (
          <div className="mt-5 space-y-6">
            {preguntas.map((p, i) => (
              <fieldset key={p.id}>
                <legend className="font-semibold text-ink">
                  {i + 1}. {p.enunciado}
                </legend>
                <div className="mt-3 space-y-2">
                  {p.opciones.map((op, k) => (
                    <label
                      key={k}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                        resp[p.id] === k
                          ? 'border-accent bg-brand-soft text-brand'
                          : 'border-line text-muted hover:text-ink'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`p${p.id}`}
                        checked={resp[p.id] === k}
                        onChange={() => setResp({ ...resp, [p.id]: k })}
                      />
                      {op}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <button
              onClick={enviar}
              disabled={!completa || enviando}
              className="w-full rounded-full bg-accent py-3 font-semibold text-on-accent transition disabled:opacity-50"
            >
              {enviando ? 'Corrigiendo...' : completa ? 'Enviar prueba' : 'Responde todas las preguntas'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Prueba({ curso }) {
  const [abierta, setAbierta] = useState(false)
  const [ultima, setUltima] = useState(null)
  const [uid, setUid] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUid(data.user?.id ?? null))
  }, [])

  async function cargarUltima() {
    if (!uid) return
    const { data } = await supabase
      .from('intentos')
      .select('nota, creado')
      .eq('user_id', uid)
      .eq('curso', curso.id)
      .order('creado', { ascending: false })
      .limit(1)
    setUltima(data && data.length > 0 ? data[0] : null)
  }

  useEffect(() => {
    cargarUltima()
  }, [uid])

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
      <button
        onClick={() => setAbierta(true)}
        className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-on-accent transition hover:scale-105"
      >
        📝 Rendir prueba del nivel
      </button>
      {ultima && (
        <span className="text-sm text-muted">
          Tu última nota: <strong className="text-ink">{formato(ultima.nota)}</strong>
        </span>
      )}
      {abierta && (
        <VentanaPrueba curso={curso} onClose={() => setAbierta(false)} onTerminar={cargarUltima} />
      )}
    </div>
  )
}