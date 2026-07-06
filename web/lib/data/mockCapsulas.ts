import type { Capsula } from '@/lib/types'

// TODO: reemplazar con llamada a Supabase (tabla capsulas).
export const MOCK_CAPSULAS: Capsula[] = [
  {
    id: 'cap-001',
    title: 'La regla de los 5 usuarios',
    description:
      'Por qué 5 participantes son suficientes para encontrar el 85% de los problemas de usabilidad.',
    content: `## La regla de los 5 usuarios

Jakob Nielsen descubrió que con solo **5 usuarios** se detecta aproximadamente el **85% de los problemas de usabilidad** de una interfaz.

La razón es matemática: los problemas más graves los encuentran los primeros participantes, y cada usuario adicional revela cada vez menos hallazgos nuevos.

**Cuándo aplica:**
- Estudios cualitativos de usabilidad
- Iteración rápida sobre prototipos
- Presupuestos y tiempos ajustados

**Cuándo NO aplica:**
- Cuando necesitas datos cuantitativos (ahí necesitas 20+ por grupo)
- Cuando hay perfiles de usuario muy distintos: usa 5 por cada perfil

La lección clave: es mejor hacer **tres rondas de 5 usuarios** que una sola ronda de 15. Iterar entre rondas multiplica el aprendizaje.`,
    category: 'dato',
    tags: ['usabilidad', 'investigación', 'muestra'],
    emoji: '5️⃣',
    readTime: '3 min',
    isFavorite: true,
    isNew: false,
    author: 'Jakob Nielsen',
    createdAt: '2024-09-01T10:00:00Z',
    relatedProtocolTypes: ['express', 'complete'],
  },
  {
    id: 'cap-002',
    title: 'Pregunta el "por qué" cinco veces',
    description:
      'La técnica de los 5 porqués para llegar a la causa raíz de un comportamiento.',
    content: `## La técnica de los 5 porqués

Cuando un usuario expresa una queja o un deseo, rara vez te dice la verdadera motivación a la primera. La técnica de los **5 porqués** te ayuda a profundizar.

**Ejemplo:**
- "No uso la función de exportar." → ¿Por qué?
- "Es muy lenta." → ¿Por qué te molesta?
- "Necesito el reporte para una reunión." → ¿Por qué corre prisa?
- "Mi jefe lo pide a última hora." → ¿Por qué a última hora?
- "No sabe que ya existe el dato." → Causa raíz: problema de **visibilidad**, no de velocidad.

**Consejos:**
- No lo conviertas en interrogatorio: intercala silencios y reformula
- Para cuando llegues a una motivación emocional o de contexto
- Anota la cadena completa: el camino revela tanto como el destino`,
    category: 'metodo',
    tags: ['entrevistas', 'causa-raíz', 'profundizar'],
    emoji: '❓',
    readTime: '4 min',
    isFavorite: false,
    isNew: true,
    author: 'Sakichi Toyoda',
    createdAt: '2025-01-18T10:00:00Z',
    relatedProtocolTypes: ['complete'],
  },
  {
    id: 'cap-003',
    title: 'No preguntes lo que harían, observa lo que hacen',
    description:
      'Las personas no saben predecir su propio comportamiento. Diseña estudios alrededor de la acción.',
    content: `## Comportamiento sobre opinión

Una de las trampas más comunes en research es confiar en lo que la gente **dice** que haría.

> "Sí, definitivamente pagaría por esa función." — y luego nadie paga.

Las personas son malas prediciendo su comportamiento futuro y tienden a dar respuestas que las hacen quedar bien (sesgo de deseabilidad social).

**Qué hacer en su lugar:**
- Pide que realicen una **tarea real**, no que imaginen una hipotética
- Pregunta por la **última vez** que hicieron algo, no por lo que "suelen" hacer
- Observa fricciones, dudas y atajos en vivo
- Triangula: combina lo que dicen, lo que hacen y los datos de producto

La opinión es una pista; el comportamiento es la evidencia.`,
    category: 'consejo',
    tags: ['comportamiento', 'sesgo', 'observación'],
    emoji: '👀',
    readTime: '3 min',
    isFavorite: false,
    isNew: false,
    author: 'Erika Hall',
    createdAt: '2024-10-12T10:00:00Z',
    relatedProtocolTypes: ['express', 'complete'],
  },
  {
    id: 'cap-004',
    title: 'Cómo Airbnb rediseñó su búsqueda con research',
    description:
      'Un caso real de cómo la investigación cualitativa cambió decisiones de producto a gran escala.',
    content: `## Caso de estudio: la búsqueda de Airbnb

Airbnb notó que muchos usuarios abandonaban sin reservar. Las métricas decían **qué** pasaba, pero no **por qué**.

**El estudio:**
El equipo hizo sesiones moderadas observando a viajeros buscar alojamiento. Descubrieron que la gente no buscaba por ubicación exacta, sino por **experiencias** ("cerca de la playa", "tranquilo", "con vida nocturna").

**El cambio:**
- Introdujeron filtros por tipo de experiencia
- Rediseñaron el mapa para mostrar zonas, no solo pines
- Añadieron categorías visuales en la home

**El resultado:**
Mayor conversión y sesiones más largas. La lección: las métricas te dicen dónde mirar, pero solo el research cualitativo te dice **qué construir**.`,
    category: 'caso-estudio',
    tags: ['caso', 'búsqueda', 'producto', 'conversión'],
    emoji: '🏠',
    readTime: '5 min',
    isFavorite: true,
    isNew: false,
    author: 'Airbnb Design',
    createdAt: '2024-11-08T10:00:00Z',
    relatedProtocolTypes: ['complete', 'presentation'],
  },
  {
    id: 'cap-005',
    title: 'Affinity mapping para sintetizar hallazgos',
    description:
      'Cómo agrupar cientos de notas en temas accionables usando un mapa de afinidad.',
    content: `## Affinity mapping paso a paso

Después de varias sesiones tienes decenas de observaciones sueltas. El **affinity mapping** las convierte en temas.

**El proceso:**
- Escribe **una observación por nota** (post-it físico o digital)
- No las agrupes todavía: primero saca todo
- Empieza a juntar notas que "se sienten relacionadas"
- Cuando un grupo crece, ponle un **título que describa el patrón**
- Los grupos huérfanos también cuentan: pueden ser señales débiles

**Herramientas:**
- FigJam, Miro o Mural para equipos remotos
- Pared y post-its para sesiones presenciales

**Consejo:** hazlo en equipo. El valor no está solo en el mapa final, sino en la **discusión** que surge al agrupar.`,
    category: 'metodo',
    tags: ['síntesis', 'análisis', 'temas', 'colaboración'],
    emoji: '🗺️',
    readTime: '4 min',
    isFavorite: false,
    isNew: false,
    author: 'IDEO',
    createdAt: '2024-12-01T10:00:00Z',
    relatedProtocolTypes: ['complete'],
  },
  {
    id: 'cap-006',
    title: 'Maze: prototipos clicables sin moderador',
    description:
      'Cuándo y cómo usar pruebas no moderadas para validar flujos a escala.',
    content: `## Pruebas no moderadas con Maze

Maze conecta tu prototipo de Figma y mide cómo lo navegan usuarios reales **sin que estés presente**.

**Ventajas:**
- Cientos de participantes en horas, no semanas
- Métricas automáticas: tasa de éxito, tiempo, mapas de calor de clics
- Ideal para validar **una hipótesis concreta**

**Limitaciones:**
- No puedes preguntar "¿por qué hiciste eso?" en vivo
- Funciona mal para exploración abierta o temas sensibles
- Necesitas un prototipo bien construido y tareas claras

**Buenas prácticas:**
- Una tarea por pantalla, con un objetivo medible
- Incluye preguntas de seguimiento tras cada misión
- Combínalo con sesiones moderadas: lo cuantitativo te dice qué falla, lo cualitativo por qué.`,
    category: 'herramienta',
    tags: ['maze', 'no-moderado', 'prototipos', 'escala'],
    emoji: '🧩',
    readTime: '4 min',
    isFavorite: false,
    isNew: true,
    author: 'Maze',
    createdAt: '2025-02-05T10:00:00Z',
    relatedProtocolTypes: ['express', 'ab'],
  },
  {
    id: 'cap-007',
    title: 'El efecto del moderador en los resultados',
    description:
      'Tu presencia influye en lo que ves. Cómo reducir el sesgo del facilitador.',
    content: `## El sesgo del moderador

Como facilitador, tu tono, tus gestos y tus preguntas moldean lo que el participante hace y dice. A veces sin darte cuenta guías hacia la respuesta que esperas.

**Señales de que estás sesgando:**
- Asientes más cuando confirman tu hipótesis
- Reformulas la pregunta hasta obtener "la respuesta correcta"
- Rescatas al usuario apenas duda en una tarea

**Cómo reducirlo:**
- Usa un **guion** y respétalo entre sesiones
- Practica el **silencio activo**: cuenta hasta cinco antes de intervenir
- Haz preguntas abiertas: "¿Qué esperabas que pasara?" en vez de "¿Te confundió esto?"
- Si puedes, que un colega observe y marque tus intervenciones

La neutralidad total es imposible, pero la consciencia reduce el daño.`,
    category: 'consejo',
    tags: ['moderación', 'sesgo', 'facilitación'],
    emoji: '🎭',
    readTime: '3 min',
    isFavorite: false,
    isNew: false,
    author: 'Steve Krug',
    createdAt: '2024-09-25T10:00:00Z',
    relatedProtocolTypes: ['complete'],
  },
  {
    id: 'cap-008',
    title: 'Microsoft y el research que salvó el Ribbon',
    description:
      'Cómo años de datos de uso justificaron uno de los rediseños más arriesgados de Office.',
    content: `## Caso de estudio: el Ribbon de Office

Cuando Microsoft rediseñó la interfaz de Office introduciendo el **Ribbon**, fue una de las apuestas más arriesgadas de su historia.

**El research detrás:**
- Telemetría de millones de usuarios reveló que la gente no encontraba funciones existentes y las pedía como "nuevas"
- Estudios de campo mostraron menús saturados imposibles de escanear
- Pruebas de usabilidad compararon el Ribbon contra los menús clásicos

**La decisión:**
A pesar de la resistencia inicial, los datos mostraron que los usuarios **descubrían más funciones** con el Ribbon una vez superada la curva de aprendizaje.

**La lección:**
Un cambio impopular puede ser correcto si la evidencia lo respalda, pero necesitas **datos longitudinales**, no solo la primera reacción. La gente odia el cambio antes de aprender a quererlo.`,
    category: 'caso-estudio',
    tags: ['caso', 'rediseño', 'telemetría', 'adopción'],
    emoji: '🎀',
    readTime: '5 min',
    isFavorite: false,
    isNew: false,
    author: 'Microsoft Research',
    createdAt: '2024-10-20T10:00:00Z',
    relatedProtocolTypes: ['complete', 'ab'],
  },
  {
    id: 'cap-009',
    title: 'Escribe insights, no observaciones',
    description:
      'La diferencia entre reportar lo que viste y entregar algo accionable.',
    content: `## De la observación al insight

Un error común es entregar reportes llenos de **observaciones** en lugar de **insights**.

**Observación:**
> "3 de 5 usuarios no encontraron el botón de guardar."

**Insight:**
> "Los usuarios asumen que los cambios se guardan solos porque otras apps que usan lo hacen; el guardado manual rompe su modelo mental."

La observación describe; el insight **explica y sugiere una dirección**.

**Fórmula útil:**
- *Observamos que...* (el hecho)
- *Creemos que es porque...* (la interpretación)
- *Lo que sugiere que deberíamos...* (la implicación)

Un buen insight sobrevive fuera de la reunión y guía decisiones meses después.`,
    category: 'consejo',
    tags: ['insights', 'reporte', 'comunicación', 'síntesis'],
    emoji: '💡',
    readTime: '3 min',
    isFavorite: true,
    isNew: false,
    author: 'Tomer Sharon',
    createdAt: '2024-11-22T10:00:00Z',
    relatedProtocolTypes: ['complete', 'presentation'],
  },
  {
    id: 'cap-010',
    title: 'Triangula tus datos para decisiones sólidas',
    description:
      'Combinar métodos cualitativos y cuantitativos hace tus conclusiones mucho más confiables.',
    content: `## Triangulación de datos

Ninguna fuente de datos cuenta la historia completa. La **triangulación** consiste en combinar varias para confirmar un hallazgo desde distintos ángulos.

**Las tres fuentes clásicas:**
- **Cualitativa:** entrevistas y sesiones de usabilidad (el *por qué*)
- **Cuantitativa:** analítica de producto y encuestas (el *cuánto*)
- **Comportamental:** registros de uso reales (el *qué*)

**Por qué importa:**
Si tres métodos independientes apuntan a la misma conclusión, tu confianza sube enormemente. Si se contradicen, has encontrado una **pregunta nueva** que vale la pena investigar.

**Ejemplo:**
La analítica muestra abandono en el paso 3 (cuánto), las sesiones revelan confusión con un campo (por qué), y los logs confirman reintentos repetidos (qué). Juntas, te dan una recomendación a prueba de balas.`,
    category: 'dato',
    tags: ['triangulación', 'métodos', 'rigor', 'análisis'],
    emoji: '📐',
    readTime: '4 min',
    isFavorite: false,
    isNew: true,
    author: 'Nielsen Norman Group',
    createdAt: '2025-02-09T10:00:00Z',
    relatedProtocolTypes: ['complete'],
  },
]
