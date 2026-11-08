export const NOMBRE = 'Magia Club'
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