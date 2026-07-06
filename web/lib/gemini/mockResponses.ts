import type { GeneratedProtocolData, Protocol } from '@/lib/types'

// Respuestas mock realistas para Gemini (Sprint 8). Se usan cuando
// FLAGS.USE_REAL_GEMINI es false, para que todo el flujo de generación,
// vista previa y exportación funcione sin consumir cuota de la API.
// Las claves coinciden con las que lee toMarkdown() en lib/gemini/output.ts.

export const MOCK_EXPRESS_OUTPUT: GeneratedProtocolData = {
  titulo: 'Test de usabilidad express — Flujo de registro',
  objetivo_refinado:
    'Evaluar la facilidad de uso del nuevo flujo de registro y detectar fricciones que impidan a los usuarios completar la creación de su cuenta en menos de 3 minutos.',
  introduccion_participante:
    'Gracias por participar en esta sesión. Vamos a pedirte que realices algunas tareas en un prototipo. No estamos evaluándote a ti, sino al diseño: cualquier dificultad que tengas es información muy valiosa para nosotros.\n\nPor favor, piensa en voz alta mientras navegas: cuéntanos qué esperas que ocurra, qué te confunde y qué te parece intuitivo. No hay respuestas correctas ni incorrectas.',
  tareas: [
    {
      id: 't1',
      numero: 1,
      titulo: 'Crear una cuenta nueva',
      descripcion:
        'Imagina que acabas de descubrir la app y quieres empezar a usarla. Crea una cuenta con tu correo.',
      tiempo_estimado: '3-5 minutos',
      notas_facilitador:
        'Observa si el participante duda ante el campo de contraseña o los requisitos de seguridad.',
    },
    {
      id: 't2',
      numero: 2,
      titulo: 'Verificar el correo electrónico',
      descripcion:
        'Acabas de recibir un correo de verificación. Confirma tu cuenta desde él.',
      tiempo_estimado: '2-3 minutos',
      notas_facilitador:
        'Anota si el usuario entiende que debe revisar su bandeja o spam.',
    },
  ],
  preguntas_generadas: [
    {
      id: 'q1',
      texto: '¿Qué tan claro te resultó el proceso de registro?',
      tipo: 'escala',
      escala: 'Likert 1-5 (1 = muy confuso, 5 = muy claro)',
      objetivo: 'Medir la claridad percibida del flujo.',
    },
    {
      id: 'q2',
      texto: '¿Hubo algún momento en el que no supieras qué hacer?',
      tipo: 'abierta',
      escala: null,
      objetivo: 'Detectar puntos de fricción concretos.',
    },
  ],
  preguntas_cierre: [
    { id: 'c1', texto: '¿Recomendarías este proceso a un amigo? ¿Por qué?' },
    { id: 'c2', texto: '¿Qué cambiarías si pudieras?' },
  ],
  guia_facilitador: {
    duracion_total: '20-25 minutos',
    materiales: ['Prototipo en Figma', 'Guion de tareas', 'Hoja de consentimiento'],
    antes_de_empezar: [
      'Confirmar grabación y consentimiento.',
      'Verificar que el prototipo carga correctamente.',
    ],
    durante_la_sesion: [
      'Recordar al participante que piense en voz alta.',
      'No guiar ni dar pistas ante los bloqueos.',
    ],
    'señales_de_alerta': [
      'El participante abandona una tarea por frustración.',
      'Confusión recurrente en el mismo paso entre varios usuarios.',
    ],
  },
  criterios_exito: [
    'El 80% de los participantes completa el registro sin ayuda.',
    'Tiempo medio de registro por debajo de 3 minutos.',
  ],
  proximos_pasos: [
    'Sintetizar hallazgos en un documento compartido.',
    'Priorizar los 3 problemas más severos con el equipo de producto.',
  ],
}

export const MOCK_COMPLETE_OUTPUT: GeneratedProtocolData = {
  titulo: 'Estudio de investigación — Experiencia de onboarding B2B',
  objetivo_refinado:
    'Comprender cómo los nuevos administradores de cuentas empresariales configuran su espacio de trabajo durante la primera semana, e identificar las barreras que retrasan la activación del equipo.',
  resumen_ejecutivo:
    'Estudio cualitativo con 8 administradores recién incorporados para mapear el journey de onboarding B2B, detectar fricciones críticas y proponer mejoras priorizadas que aceleren el time-to-value.',
  introduccion_participante:
    'Gracias por tu tiempo. En esta sesión exploraremos cómo configuraste tu espacio de trabajo cuando empezaste a usar la plataforma. Nos interesa tu experiencia real: lo que funcionó, lo que te costó y lo que esperabas que fuera distinto.\n\nLa sesión durará alrededor de 60 minutos y será grabada solo con fines de análisis interno. Puedes detenerte en cualquier momento.',
  marco_metodologico:
    'Investigación cualitativa basada en entrevistas semiestructuradas combinadas con un recorrido contextual (contextual inquiry) del producto. Se elige este enfoque para capturar tanto el discurso del usuario como su comportamiento real durante la configuración, triangulando ambas fuentes.',
  screener: {
    descripcion:
      'Administradores de cuentas empresariales que completaron el alta en los últimos 30 días.',
    preguntas_filtro: [
      {
        id: 'f1',
        texto: '¿Cuál es tu rol en la cuenta de tu empresa?',
        criterio: 'Debe ser administrador/owner; descartar usuarios de solo lectura.',
      },
    ],
  },
  tareas: [
    {
      id: 't1',
      numero: 1,
      titulo: 'Recorrido por la configuración inicial',
      descripcion:
        'Muéstranos cómo configuraste tu espacio de trabajo la primera vez que entraste.',
      tiempo_estimado: '15-20 minutos',
      notas_facilitador:
        'Pedir que comparta pantalla; observar dónde se detiene o retrocede.',
    },
    {
      id: 't2',
      numero: 2,
      titulo: 'Invitar a un miembro del equipo',
      descripcion: 'Invita a un compañero ficticio a unirse al espacio de trabajo.',
      tiempo_estimado: '5-8 minutos',
      notas_facilitador: 'Detectar si encuentra la opción de invitación sin ayuda.',
    },
  ],
  preguntas_generadas: [
    {
      id: 'q1',
      texto: '¿Qué fue lo más difícil de configurar la cuenta?',
      tipo: 'abierta',
      escala: null,
      objetivo: 'Identificar barreras principales de activación.',
    },
    {
      id: 'q2',
      texto: '¿Qué tan preparado te sentiste para invitar a tu equipo?',
      tipo: 'escala',
      escala: 'Likert 1-5',
      objetivo: 'Medir confianza percibida en la fase de expansión.',
    },
  ],
  preguntas_cierre: [
    { id: 'c1', texto: 'Si pudieras cambiar una cosa del onboarding, ¿cuál sería?' },
  ],
  guia_facilitador: {
    duracion_total: '60 minutos',
    materiales: ['Guion de entrevista', 'Cuenta de prueba', 'Consentimiento informado'],
    antes_de_empezar: [
      'Validar el entorno de pruebas.',
      'Confirmar consentimiento y grabación.',
    ],
    durante_la_sesion: [
      'Profundizar con preguntas de seguimiento ("¿por qué?").',
      'Evitar inducir respuestas.',
    ],
    'señales_de_alerta': [
      'El participante confunde el entorno de prueba con su cuenta real.',
      'Respuestas socialmente deseables sin sustento en comportamiento.',
    ],
  },
  cronograma: [
    {
      fase: 'Reclutamiento',
      actividad: 'Selección y agenda de participantes',
      fecha_estimada: 'Semana 1',
      responsable: 'Research Ops',
    },
    {
      fase: 'Campo',
      actividad: 'Ejecución de las 8 entrevistas',
      fecha_estimada: 'Semanas 2-3',
      responsable: 'Investigador líder',
    },
  ],
  plan_analisis:
    'Análisis temático sobre las transcripciones usando codificación abierta y axial. Se construirá un mapa de afinidad para agrupar patrones, y se priorizarán los hallazgos por frecuencia y severidad de impacto en la activación.',
  stakeholders_informe:
    'Informe ejecutivo de 1 página con los 3 hallazgos clave, su impacto en el time-to-value y recomendaciones accionables para el equipo de producto.',
  riesgos: [
    {
      riesgo: 'Baja tasa de respuesta en el reclutamiento',
      impacto: 'medio',
      mitigacion: 'Sobre-reclutar un 25% y ofrecer incentivo adecuado.',
    },
    {
      riesgo: 'Sesgo de deseabilidad social',
      impacto: 'medio',
      mitigacion: 'Apoyar las afirmaciones con observación de comportamiento real.',
    },
  ],
  criterios_exito: [
    'Identificar al menos 3 barreras de activación accionables.',
    'Cobertura de los principales perfiles de administrador.',
  ],
  proximos_pasos: [
    'Presentar hallazgos al equipo de producto.',
    'Definir experimentos para las 2 mejoras de mayor impacto.',
  ],
}

export const MOCK_PRESENTATION_OUTPUT: GeneratedProtocolData = {
  titulo_presentacion: 'Resultados de investigación — Rediseño del checkout',
  subtitulo: 'Hallazgos y recomendaciones priorizadas · Q2 2026',
  resumen_ejecutivo:
    'Evaluamos el checkout con 12 usuarios. El 60% abandonó por falta de claridad en los costos de envío. Proponemos 4 mejoras priorizadas que estiman reducir el abandono en un 15%.',
  slides: [
    {
      id: 's1',
      tipo: 'portada',
      titulo: 'Rediseño del checkout',
      contenido: 'Estudio de usabilidad · 12 participantes · Junio 2026',
      notas_presentador: 'Presentar el contexto y el objetivo en 1 minuto.',
    },
    {
      id: 's2',
      tipo: 'resumen',
      titulo: 'Resumen ejecutivo',
      contenido: [
        '12 usuarios evaluados en sesiones moderadas.',
        '60% de abandono por costos de envío poco claros.',
        '4 recomendaciones priorizadas.',
      ],
      notas_presentador: 'Enfatizar el dato del 60% de abandono.',
    },
    {
      id: 's3',
      tipo: 'hallazgo',
      titulo: 'Hallazgo principal: costos ocultos',
      contenido:
        'Los usuarios descubren el costo de envío demasiado tarde, lo que genera desconfianza y abandono.',
      notas_presentador: 'Acompañar con la cita del slide siguiente.',
    },
    {
      id: 's4',
      tipo: 'cita',
      titulo: 'La voz del usuario',
      contenido: '"Pensé que era gratis y al final me cobraron envío. Cerré la página."',
      notas_presentador: 'Dejar un par de segundos de silencio tras leer la cita.',
    },
    {
      id: 's5',
      tipo: 'recomendacion',
      titulo: 'Recomendaciones',
      contenido: {
        prioridad_alta: 'Mostrar el costo total desde el primer paso.',
        prioridad_media: 'Añadir una barra de progreso del checkout.',
      },
      notas_presentador: 'Conectar cada recomendación con su hallazgo.',
    },
    {
      id: 's6',
      tipo: 'cierre',
      titulo: 'Próximos pasos',
      contenido: ['Validar el rediseño con un test A/B.', 'Medir abandono tras el cambio.'],
      notas_presentador: 'Cerrar con el impacto esperado (-15% de abandono).',
    },
  ],
  hallazgos_principales: [
    {
      titulo: 'Costos de envío poco claros',
      descripcion: 'Se revelan demasiado tarde en el flujo.',
      severidad: 'alta',
    },
    {
      titulo: 'Falta de feedback de progreso',
      descripcion: 'Los usuarios no saben cuántos pasos faltan.',
      severidad: 'media',
    },
  ],
  recomendaciones_priorizadas: [
    {
      titulo: 'Mostrar costo total desde el inicio',
      descripcion: 'Incluir envío e impuestos en el primer resumen.',
      prioridad: 'alta',
      esfuerzo: 'medio',
    },
    {
      titulo: 'Añadir indicador de progreso',
      descripcion: 'Barra de pasos para reducir la incertidumbre.',
      prioridad: 'media',
      esfuerzo: 'bajo',
    },
  ],
}

// Devuelve el output mock acorde al tipo de protocolo.
export function getMockGeminiResponse(protocol: Protocol): GeneratedProtocolData {
  switch (protocol.type) {
    case 'complete':
      return MOCK_COMPLETE_OUTPUT
    case 'presentation':
      return MOCK_PRESENTATION_OUTPUT
    case 'express':
    case 'ab':
    default:
      return MOCK_EXPRESS_OUTPUT
  }
}

// Respuesta mock del copiloto (acción 'suggest'): texto plano contextualizado.
export function getMockSuggestAnswer(protocol: Protocol, question: string): string {
  const q = question.trim()
  return `Buena pregunta sobre "${protocol.name}". (Respuesta simulada — IA en modo mock)

${q ? `Respecto a "${q}": ` : ''}Te sugiero enfocarte en tres puntos:

1. Define un objetivo único y medible para la sesión; evita mezclar varias hipótesis.
2. Redacta las tareas en lenguaje del usuario, sin pistas que revelen la solución esperada.
3. Cierra siempre con una pregunta abierta para capturar percepciones que no anticipaste.

Cuando se active la integración real de Gemini (NEXT_PUBLIC_USE_REAL_GEMINI=true) esta respuesta vendrá del modelo.`
}
