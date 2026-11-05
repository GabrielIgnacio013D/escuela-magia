import { useState } from 'react'
import { supabase } from './supabase'

function traducir(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'Correo o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Primero confirma tu correo con el enlace que te enviamos.'
  if (m.includes('already registered')) return 'Ese correo ya tiene una cuenta. Prueba ingresando.'
  if (m.includes('at least')) return 'La contraseña es muy corta. Usa al menos 8 caracteres.'
  if (m.includes('rate limit') || m.includes('security purposes'))
    return 'Demasiados intentos. Espera un momento y vuelve a probar.'
  if (m.includes('not authorized'))
    return 'Los correos de confirmación aún están en pruebas. Escríbenos por WhatsApp.'
  return 'Ocurrió un error. Intenta de nuevo.'
}

export default function AuthModal({ modoInicial = 'login', onClose }) {
  const [modo, setModo] = useState(modoInicial)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const titulos = {
    login: 'Ingresar',
    registro: 'Crear cuenta',
    olvide: 'Recuperar contraseña',
    nueva: 'Nueva contraseña',
  }

  const campo =
    'w-full rounded-xl border border-line bg-bg text-ink px-4 py-3 outline-none focus:border-accent'

  const cambiarModo = (m) => {
    setModo(m)
    setMensaje(null)
  }

  async function enviar(e) {
    e.preventDefault()
    setMensaje(null)
    setCargando(true)
    try {
      if (modo === 'registro') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: clave,
          options: { data: { nombre }, emailRedirectTo: window.location.origin },
        })
        if (error) throw error
        if (data.session) onClose()
        else
          setMensaje({
            tipo: 'ok',
            texto: 'Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja y también el spam.',
          })
      } else if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: clave })
        if (error) throw error
        onClose()
      } else if (modo === 'olvide') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        })
        if (error) throw error
        setMensaje({
          tipo: 'ok',
          texto: 'Si el correo tiene cuenta, te enviamos un enlace para crear una nueva contraseña.',
        })
      } else if (modo === 'nueva') {
        const { error } = await supabase.auth.updateUser({ password: clave })
        if (error) throw error
        setMensaje({ tipo: 'ok', texto: '¡Listo! Tu contraseña fue actualizada.' })
        setTimeout(onClose, 1500)
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: traducir(err.message) })
    } finally {
      setCargando(false)
    }
  }

  const tab = (m, texto) => (
    <button
      type="button"
      onClick={() => cambiarModo(m)}
      className={`rounded-full py-2 transition ${
        modo === m ? 'bg-accent text-on-accent' : 'text-muted hover:text-ink'
      }`}
    >
      {texto}
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-brand">{titulos[modo]}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-muted hover:text-ink text-xl">
            ✕
          </button>
        </div>

        {(modo === 'login' || modo === 'registro') && (
          <div className="mt-4 grid grid-cols-2 rounded-full bg-surface p-1 text-sm font-semibold">
            {tab('login', 'Ingresar')}
            {tab('registro', 'Crear cuenta')}
          </div>
        )}

        <form onSubmit={enviar} className="mt-5 space-y-4">
          {modo === 'registro' && (
            <div>
              <label className="block text-sm text-muted mb-1">Nombre</label>
              <input
                className={campo}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          {modo !== 'nueva' && (
            <div>
              <label className="block text-sm text-muted mb-1">Correo</label>
              <input
                type="email"
                className={campo}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          )}

          {modo !== 'olvide' && (
            <div>
              <label className="block text-sm text-muted mb-1">
                {modo === 'nueva' ? 'Nueva contraseña' : 'Contraseña'}
              </label>
              <input
                type="password"
                className={campo}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                minLength={modo === 'login' ? undefined : 8}
                autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
              />
              {modo !== 'login' && (
                <p className="mt-1 text-xs text-muted">Mínimo 8 caracteres.</p>
              )}
            </div>
          )}

          {mensaje && (
            <p
              className={`rounded-xl px-4 py-3 text-sm ${
                mensaje.tipo === 'ok' ? 'bg-brand-soft text-brand' : 'bg-red-500/10 text-red-500'
              }`}
            >
              {mensaje.texto}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-full bg-accent text-on-accent font-semibold py-3 hover:scale-[1.02] transition disabled:opacity-60"
          >
            {cargando
              ? 'Un momento...'
              : modo === 'login'
              ? 'Ingresar'
              : modo === 'registro'
              ? 'Crear mi cuenta'
              : modo === 'olvide'
              ? 'Enviar enlace'
              : 'Guardar contraseña'}
          </button>
        </form>

        {modo === 'login' && (
          <button
            type="button"
            onClick={() => cambiarModo('olvide')}
            className="mt-4 w-full text-center text-sm text-accent hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}
        {modo === 'olvide' && (
          <button
            type="button"
            onClick={() => cambiarModo('login')}
            className="mt-4 w-full text-center text-sm text-accent hover:underline"
          >
            Volver a ingresar
          </button>
        )}
      </div>
    </div>
  )
}