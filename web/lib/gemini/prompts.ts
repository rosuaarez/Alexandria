import type { Protocol } from '@/lib/types'

export type GeminiAction = 'generate' | 'improve' | 'suggest'

function str(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

function field(data: Protocol['data'], key: string): string {
  return data ? str((data as Record<string, unknown>)[key]) : ''
}

const COMMON_RULES = `
REGLAS DE SALIDA (obligatorias):
- Responde SIEMPRE en español.
- Tono profesional pero accesible, orientado a equipos de producto.
- Devuelve EXCLUSIVAMENTE JSON válido. Sin texto antes ni después, sin markdown, sin bloques \`\`\`.
- No inventes datos sensibles; cuando falte información, propón contenido razonable y genérico.
- Todos los textos deben ser claros, accionables y listos para usar.`

export function buildPrompt(protocol: Protocol, action: GeminiAction): string {
  switch (protocol.type) {
    case 'express':
      return buildExpressPrompt(protocol, action)
    case 'complete':
      return buildCompletePrompt(protocol, action)
    case 'presentation':
      return buildPresentationPrompt(protocol, action)
    default:
      return buildExpressPrompt(protocol, action)
  }
}

function buildExpressPrompt(protocol: Protocol, _action: GeminiAction): string {
  return `Eres un experto en investigación UX y diseño de protocolos de usabilidad.
Basándote en la información proporcionada por el investigador, genera un protocolo de investigación completo y profesional.

INFORMACIÓN DEL PROTOCOLO:
- Nombre: ${protocol.name}
- Objetivo: ${field(protocol.data, 'objetivo')}
- Plataforma: ${field(protocol.data, 'platform')}
- Preguntas base: ${field(protocol.data, 'questions')}

INSTRUCCIONES:
Genera un protocolo Express completo con EXACTAMENTE esta estructura JSON (no incluyas markdown, solo el JSON puro):
{
  "titulo": "string — título profesional del protocolo",
  "objetivo_refinado": "string — objetivo mejorado y más preciso",
  "introduccion_participante": "string — texto de bienvenida para el participante (2-3 párrafos)",
  "tareas": [
    {
      "id": "string",
      "numero": number,
      "titulo": "string",
      "descripcion": "string — instrucción clara para el participante",
      "tiempo_estimado": "string — ej: 3-5 minutos",
      "notas_facilitador": "string — tips para quien modera"
    }
  ],
  "preguntas_generadas": [
    {
      "id": "string",
      "texto": "string — pregunta mejorada y profesional",
      "tipo": "string",
      "escala": "string | null — descripción de la escala si aplica",
      "objetivo": "string — qué mide esta pregunta"
    }
  ],
  "preguntas_cierre": [
    { "id": "string", "texto": "string" }
  ],
  "guia_facilitador": {
    "duracion_total": "string",
    "materiales": ["string"],
    "antes_de_empezar": ["string"],
    "durante_la_sesion": ["string"],
    "señales_de_alerta": ["string"]
  },
  "criterios_exito": ["string"],
  "proximos_pasos": ["string"]
}
${COMMON_RULES}`
}

function buildCompletePrompt(protocol: Protocol, _action: GeminiAction): string {
  return `Eres un experto senior en investigación UX, metodologías de investigación y diseño de estudios.
Basándote en la información proporcionada, genera un protocolo de investigación COMPLETO, profundo y metodológicamente riguroso.

INFORMACIÓN DEL PROTOCOLO:
- Nombre: ${protocol.name}
- Proyecto: ${field(protocol.data, 'proyecto')}
- Cliente / Área: ${field(protocol.data, 'cliente')}
- Tema: ${field(protocol.data, 'tema')}
- Objetivo general: ${field(protocol.data, 'objetivoGeneral')}
- Preguntas de investigación: ${field(protocol.data, 'preguntasInvestigacion')}
- Perfil de participantes: ${field(protocol.data, 'perfilParticipantes')}
- Criterios de inclusión/exclusión: ${field(protocol.data, 'criteriosInclusion')}
- Número de participantes: ${field(protocol.data, 'numParticipantes')}
- Metodología: ${field(protocol.data, 'metodologia')}
- Plataforma: ${field(protocol.data, 'plataforma')}
- Duración: ${field(protocol.data, 'duracion')}
- Incentivo: ${field(protocol.data, 'incentivo')}
- Preguntas base (guion): ${field(protocol.data, 'questions')}

INSTRUCCIONES:
Genera un protocolo COMPLETO con EXACTAMENTE esta estructura JSON (solo JSON puro, sin markdown):
{
  "titulo": "string",
  "objetivo_refinado": "string",
  "introduccion_participante": "string (2-3 párrafos)",
  "marco_metodologico": "string — descripción del enfoque metodológico, justificación y técnicas",
  "screener": {
    "descripcion": "string — criterios de selección de participantes",
    "preguntas_filtro": [
      { "id": "string", "texto": "string", "criterio": "string — qué respuesta clasifica/descarta" }
    ]
  },
  "tareas": [
    { "id": "string", "numero": number, "titulo": "string", "descripcion": "string", "tiempo_estimado": "string", "notas_facilitador": "string" }
  ],
  "preguntas_generadas": [
    { "id": "string", "texto": "string", "tipo": "string", "escala": "string | null", "objetivo": "string" }
  ],
  "preguntas_cierre": [ { "id": "string", "texto": "string" } ],
  "guia_facilitador": {
    "duracion_total": "string",
    "materiales": ["string"],
    "antes_de_empezar": ["string"],
    "durante_la_sesion": ["string"],
    "señales_de_alerta": ["string"]
  },
  "cronograma": [
    { "fase": "string", "actividad": "string", "fecha_estimada": "string", "responsable": "string" }
  ],
  "plan_analisis": "string — cómo se analizarán los datos (técnicas, herramientas, criterios)",
  "stakeholders_informe": "string — resumen ejecutivo para stakeholders",
  "riesgos": [
    { "riesgo": "string", "impacto": "alto|medio|bajo", "mitigacion": "string" }
  ],
  "criterios_exito": ["string"],
  "proximos_pasos": ["string"]
}
${COMMON_RULES}`
}

function buildPresentationPrompt(protocol: Protocol, _action: GeminiAction): string {
  return `Eres un experto en comunicación de resultados de investigación UX y storytelling para equipos de producto.
Basándote en la información proporcionada, genera una PRESENTACIÓN de resultados en formato de slides.

INFORMACIÓN DEL PROTOCOLO:
- Nombre: ${protocol.name}
- Título del estudio: ${field(protocol.data, 'titulo')}
- Subtítulo: ${field(protocol.data, 'subtitulo')}
- Autor: ${field(protocol.data, 'autor')}
- Resumen ejecutivo: ${field(protocol.data, 'resumen')}
- Hallazgos: ${field(protocol.data, 'hallazgos')}
- Pain points: ${field(protocol.data, 'painPoints')}
- Citas de usuarios: ${field(protocol.data, 'citas')}
- Métricas: ${field(protocol.data, 'metricas')}
- Recomendaciones: ${field(protocol.data, 'recomendaciones')}
- Próximos pasos: ${field(protocol.data, 'proximosPasos')}

INSTRUCCIONES:
Genera una presentación con EXACTAMENTE esta estructura JSON (solo JSON puro, sin markdown):
{
  "titulo_presentacion": "string",
  "subtitulo": "string",
  "slides": [
    {
      "id": "string",
      "tipo": "portada | resumen | hallazgo | metrica | cita | recomendacion | cierre",
      "titulo": "string",
      "contenido": "string | string[] | object — contenido del slide según su tipo",
      "notas_presentador": "string"
    }
  ],
  "resumen_ejecutivo": "string",
  "hallazgos_principales": [
    { "titulo": "string", "descripcion": "string", "severidad": "alta|media|baja" }
  ],
  "recomendaciones_priorizadas": [
    { "titulo": "string", "descripcion": "string", "prioridad": "alta|media|baja", "esfuerzo": "alto|medio|bajo" }
  ]
}
Genera entre 8 y 14 slides coherentes (portada, agenda/resumen, hallazgos, métricas, citas, recomendaciones y cierre).
${COMMON_RULES}`
}
