import type { Protocol } from '@/lib/types'

// Análisis local (mock) del protocolo, sin llamar a Gemini. Evalúa los campos
// llenados y devuelve dimensiones (0-10) + un resumen para el chat del copiloto.

export interface AnalysisDimension {
  label: string
  value: number // 0-10
}

export interface ProtocolAnalysis {
  score: number // 0-100 (mismo que calculateQualityScore)
  dimensions: AnalysisDimension[]
  summary: string
  note: string
}

function data(p?: Protocol): Record<string, unknown> {
  return (p?.data ?? {}) as Record<string, unknown>
}

function has(v: unknown): boolean {
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return !!v
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

function hasObjetivo(d: Record<string, unknown>): boolean {
  return has(d.objetivo) || has(d.objetivo_general) || has(d.objetivoGeneral)
}

// Score 0-100 basado en los campos llenados (Corrección 6).
export function calculateQualityScore(protocol?: Protocol): number {
  const d = data(protocol)
  let score = 0
  if (hasObjetivo(d)) score += 20
  if (arr(d.questions).length >= 2) score += 20
  if (has(d.proyecto) || has(d.cliente)) score += 15
  if (has(d.tema)) score += 15
  if (has(d.hipotesis)) score += 10
  if (arr(d.kpis).length >= 1) score += 10
  if (has(d.perfil_usuario) || has(d.caracteristicas) || has(d.caracteristica))
    score += 10
  return Math.min(score, 100)
}

// Análisis completo (dimensiones + resumen) mostrado en el panel del copiloto.
export function analyzeProtocol(protocol?: Protocol): ProtocolAnalysis {
  const d = data(protocol)

  const objetivos = Math.min(
    10,
    (hasObjetivo(d) ? 4 : 0) +
      (has(d.hipotesis) ? 3 : 0) +
      (arr(d.kpis).length >= 1 ? 3 : 0)
  )
  const qCount = arr(d.questions).length
  const preguntas = qCount > 0 ? Math.min(10, 3 + qCount) : 0
  const score = calculateQualityScore(protocol)
  const completitud = Math.round(score / 10)

  const summary = [
    'Preguntas de investigación: ¿Qué preguntas específicas se quieren responder?',
    'Criterios de participantes: ¿Quiénes son los usuarios objetivo?',
    'Tareas: ¿Qué acciones realizarán los participantes durante la prueba?',
    'Métricas: ¿Cómo se medirá el éxito o el fracaso?',
    'Logística: ¿Dónde, cuándo y cómo se realizará la prueba?',
  ].join('\n')

  const note =
    !has(d.tema) && !hasObjetivo(d)
      ? 'Coherencia: Sin un "Tema" definido y sin objetivos, es difícil evaluar la coherencia del protocolo.'
      : 'Coherencia: El protocolo tiene una base definida; refina objetivos y preguntas para aumentar su solidez.'

  return {
    score,
    dimensions: [
      { label: 'Objetivos', value: objetivos },
      { label: 'Preguntas', value: preguntas },
      { label: 'Completitud', value: completitud },
    ],
    summary,
    note,
  }
}
