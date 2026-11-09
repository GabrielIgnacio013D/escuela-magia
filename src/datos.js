export const NOMBRE = 'RG MAGIC'
export const WA_GABO = '56940533981'
export const WA_XINO = '56975457092'

export const wa = (numero, texto) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`

export const CURSOS = [
  {
    id: 'inicial',
    icono: '🃏',
    titulo: 'Cartomagia Inicial',
    corto: 'Inicial',
    nivel: 'Principiante',
    precio: 'Gratis',
    gratis: true,
    desc: 'Entra al mundo de la cartomagia sin tecnicismos: técnicas básicas y trucos en video que podrás lograr desde el primer día.',
    descLarga:
      'Un curso pensado para quien parte de cero. Aprenderás las técnicas más usadas de la cartomagia explicadas de forma simple, y las aplicarás en trucos completos que podrás mostrar a tu familia y amigos.',
    aprenderas: [
      'Cómo sostener y manejar la baraja con naturalidad',
      'Tus primeras técnicas, explicadas sin tecnicismos',
      'Trucos completos que podrás hacer desde la primera semana',
      'Cómo practicar y presentar un efecto ante otras personas',
    ],
    requisitos: [
      'Una baraja de cartas común',
      'Ganas de practicar un rato cada día',
      'No necesitas experiencia previa',
    ],
    duracion: 'A tu propio ritmo',
    mensaje: 'Hola! Quiero empezar el curso gratuito de Cartomagia Inicial',
  },
  {
    id: 'avanzada',
    icono: '♠️',
    titulo: 'Cartomagia Avanzada',
    corto: 'Avanzada',
    nivel: 'Intermedio',
    precio: '$4.500',
    gratis: false,
    desc: 'Lleva tus técnicas al siguiente nivel con manipulaciones, controles y rutinas completas explicadas paso a paso.',
    descLarga:
      'Para quienes ya dominan lo básico y quieren dar un salto. Trabajaremos técnicas más finas y rutinas completas, con foco en que todo se vea natural y sorprendente.',
    aprenderas: [
      'Controles, forzajes y manipulaciones más finas',
      'Rutinas completas de principio a fin',
      'Cómo mejorar tu presentación y el manejo del público',
      'Cómo corregir errores comunes en tu práctica',
    ],
    requisitos: [
      'Haber hecho el curso inicial o manejar las técnicas básicas',
      'Una baraja de cartas común',
      'Disposición para practicar con constancia',
    ],
    duracion: 'A tu propio ritmo',
    mensaje: 'Hola! Quiero inscribirme en Cartomagia Avanzada ($4.500)',
  },
  {
    id: 'escenica',
    icono: '🎩',
    titulo: 'Magia Escénica y Mentalismo',
    corto: 'Escénica',
    nivel: 'Avanzado',
    precio: '$20.000',
    gratis: false,
    desc: 'Presentación, psicología y efectos para escenario. Aprende a crear momentos que nadie olvida.',
    descLarga:
      'El nivel más completo: aprenderás a construir un número, a dominar el escenario y a trabajar efectos de mentalismo que dejan al público sin palabras.',
    aprenderas: [
      'Presentación y manejo del escenario',
      'Fundamentos del mentalismo',
      'Cómo estructurar un número de principio a fin',
      'Cómo conectar con el público y sostener su atención',
    ],
    requisitos: [
      'Experiencia previa en cartomagia',
      'Ganas de crear tu propio estilo',
      'Disposición para practicar y recibir correcciones',
    ],
    duracion: 'A tu propio ritmo',
    mensaje: 'Hola! Quiero inscribirme en Magia Escénica y Mentalismo ($20.000)',
  },
]

// Para poner una foto: guarda la imagen en la carpeta "public" (por ejemplo public/gabo.jpg)
// y cambia foto: null por foto: '/gabo.jpg'
export const FUNDADORES = [
  {
    nombre: 'Gabo',
    rol: 'Fundador e instructor',
    foto: null,
    bio: 'Escribe aquí tu historia: cuándo empezaste con la magia, qué te apasiona y por qué quieres enseñarla.',
  },
  {
    nombre: 'Xino',
    rol: 'Fundador e instructor',
    foto: null,
    bio: 'Escribe aquí su historia: cómo se metió en la magia y qué le gusta enseñar.',
  },
]

export const FAQ = [
  {
    p: '¿Necesito experiencia previa?',
    r: 'No. El curso inicial parte desde cero y está pensado para quien nunca ha hecho magia.',
  },
  {
    p: '¿Qué necesito para empezar?',
    r: 'Una baraja de cartas común y un celular o computador para ver las clases.',
  },
  {
    p: '¿Cuánto cuesta?',
    r: `El curso inicial es ${CURSOS[0].precio.toLowerCase()}. ${CURSOS[1].titulo} cuesta ${CURSOS[1].precio} y ${CURSOS[2].titulo} cuesta ${CURSOS[2].precio}.`,
  },
  {
    p: '¿Cómo pago y cuándo se abre mi acceso?',
    r: 'Por ahora el pago se coordina por WhatsApp con Gabo o con el Xino. Cuando confirmamos el pago, abrimos tu acceso al curso.',
  },
  {
    p: '¿Cómo funcionan las pruebas y las correcciones?',
    r: 'Cada nivel tiene una prueba escrita con nota. Además puedes subir un video corto de tu práctica en la pestaña Tutoriales: nosotros lo revisamos y verás la corrección en tu cuenta.',
  },
  {
    p: '¿Quién puede ver mis videos?',
    r: 'Solo tú y los administradores de la escuela. Tus videos de práctica no se publican.',
  },
  {
    p: '¿Puedo participar si soy menor de edad?',
    r: 'Si tienes menos de 18 años, necesitas la autorización de tu madre, padre o tutor para crear tu cuenta.',
  },
  {
    p: 'Olvidé mi contraseña, ¿qué hago?',
    r: 'Escríbenos por WhatsApp y te ayudamos a recuperar tu cuenta.',
  },
]