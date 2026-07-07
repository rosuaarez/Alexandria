// Libros de referencia de UX research. Las portadas usan un placeholder de
// color hasta que se provean las imágenes reales (Diferencia 7 del Sprint 16).

export interface Libro {
  id: string
  titulo: string
  autor: string
  descripcion: string
  // Gradiente del placeholder de portada.
  accent: string
}

export const LIBROS: Libro[] = [
  {
    id: 'l1',
    titulo: '230 Tips de User Testing',
    autor: 'Steve Krug / Ralf Muehl',
    descripcion:
      'Colección práctica de consejos accionables para planear, moderar y analizar pruebas de usabilidad con usuarios reales.',
    accent: 'linear-gradient(135deg,#6D28C7,#8C59FE)',
  },
  {
    id: 'l2',
    titulo: 'A Project Guide to UX Design',
    autor: 'Russ Unger & Carolyn Chandler',
    descripcion:
      'Guía integral del proceso de diseño UX en proyectos reales, desde la estrategia hasta la entrega, para equipos y consultores.',
    accent: 'linear-gradient(135deg,#0369A1,#0EA5E9)',
  },
  {
    id: 'l3',
    titulo: "Don't Make Me Think",
    autor: 'Steve Krug',
    descripcion:
      'El clásico sobre usabilidad web: principios de diseño intuitivo y por qué la claridad siempre le gana a la inteligencia.',
    accent: 'linear-gradient(135deg,#047857,#10B981)',
  },
  {
    id: 'l4',
    titulo: 'The Design of Everyday Things',
    autor: 'Don Norman',
    descripcion:
      'Fundamentos del diseño centrado en el humano: affordances, señales, mapeos y modelos mentales aplicados a lo cotidiano.',
    accent: 'linear-gradient(135deg,#C2410C,#F59E0B)',
  },
  {
    id: 'l5',
    titulo: 'Observing the User Experience',
    autor: 'Mike Kuniavsky',
    descripcion:
      'Manual de métodos de investigación de usuarios: entrevistas, encuestas, pruebas y análisis para nutrir decisiones de producto.',
    accent: 'linear-gradient(135deg,#1D4ED8,#60A5FA)',
  },
  {
    id: 'l6',
    titulo: 'Just Enough Research',
    autor: 'Erika Hall',
    descripcion:
      'Cómo hacer research pragmático y suficiente: técnicas rápidas y rigurosas que caben en cualquier ritmo de proyecto.',
    accent: 'linear-gradient(135deg,#BE185D,#F472B6)',
  },
  {
    id: 'l7',
    titulo: 'Interviewing Users',
    autor: 'Steve Portigal',
    descripcion:
      'El arte de la entrevista de investigación: preparar guías, generar rapport y extraer insights profundos de los usuarios.',
    accent: 'linear-gradient(135deg,#6D28C7,#A78BFA)',
  },
  {
    id: 'l8',
    titulo: 'Research Methods in Human-Computer Interaction',
    autor: 'Lazar, Feng & Hochheiser',
    descripcion:
      'Referencia académica de métodos de investigación en HCI: experimentos, encuestas, estudios de caso y análisis de datos.',
    accent: 'linear-gradient(135deg,#0F766E,#2DD4BF)',
  },
]
