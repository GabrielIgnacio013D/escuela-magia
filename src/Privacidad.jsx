import { NOMBRE, WA_GABO, wa } from './datos'

const secciones = [
  {
    t: '1. Qué datos guardamos',
    p: [
      'Tu nombre y tu correo electrónico, que nos das al crear tu cuenta.',
      'Tu contraseña, que se guarda de forma cifrada por el servicio de cuentas: nosotros no podemos verla.',
      'Tu actividad en los cursos: lecciones vistas y notas de las pruebas.',
      'Los videos de práctica que subes, con los comentarios que escribes y las correcciones que te enviamos.',
    ],
  },
  {
    t: '2. Para qué los usamos',
    p: [
      'Para darte acceso a los cursos y mostrarte tu progreso.',
      'Para revisar tus videos y enviarte correcciones.',
      'Para contactarte por temas de tu cuenta o de tu inscripción.',
      'No vendemos ni compartimos tus datos con terceros para publicidad.',
    ],
  },
  {
    t: '3. Quién puede ver tu información',
    p: [
      'Tus videos de práctica los ven solo tú y los administradores de la escuela. No se publican.',
      'Tu nombre, correo y notas los ven solo tú y los administradores.',
    ],
  },
  {
    t: '4. Dónde se guardan',
    p: [
      'Usamos proveedores externos para operar el sitio: Supabase (cuentas, base de datos y archivos), Cloudflare (publicación de la página) y YouTube (videos de las lecciones). Esos servicios pueden almacenar datos en servidores fuera de Chile.',
    ],
  },
  {
    t: '5. Menores de edad',
    p: [
      'Si tienes menos de 18 años, necesitas la autorización de tu madre, padre o tutor para crear una cuenta y subir videos.',
    ],
  },
  {
    t: '6. Almacenamiento en tu navegador',
    p: [
      'Guardamos en tu navegador tu sesión y tu preferencia de tema claro u oscuro, para que la página funcione. No usamos cookies de publicidad. Los videos de YouTube se cargan desde YouTube.',
    ],
  },
  {
    t: '7. Cómo borrar o corregir tus datos',
    p: [
      'Escríbenos por WhatsApp y borramos tu cuenta, tus videos y tu información, o corregimos lo que necesites.',
    ],
  },
]

export default function Privacidad() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-40">
      <a href="#inicio" className="text-sm font-semibold text-accent hover:underline">
        ← Volver al inicio
      </a>

      <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-5xl">
        Política de privacidad
      </h1>
      <p className="mt-3 text-sm text-muted">
        {NOMBRE} · Última actualización: noviembre de 2026
      </p>

      <p className="mt-6 text-muted">
        Esta página explica qué información guardamos cuando usas {NOMBRE}, para qué la usamos y
        cómo puedes pedirnos que la borremos.
      </p>

      <div className="mt-10 space-y-8">
        {secciones.map((s) => (
          <section key={s.t}>
            <h2 className="font-display text-xl font-bold text-brand">{s.t}</h2>
            <ul className="mt-3 space-y-2">
              {s.p.map((x) => (
                <li key={x} className="text-sm text-muted">
                  {x}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-surface p-6 text-center">
        <p className="text-ink">¿Tienes dudas sobre tus datos?</p>
        <a
          href={wa(WA_GABO, 'Hola! Tengo una consulta sobre mis datos en la escuela')}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-on-accent transition hover:scale-105"
        >
          Escribirnos por WhatsApp
        </a>
      </div>
    </main>
  )
}