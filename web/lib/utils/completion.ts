import type { ProtocolType } from '@/lib/types'
import type { FormData } from '@/components/protocols/forms/types'

function filled(v: unknown): boolean {
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return Boolean(v)
}

function arrLen(v: unknown): number {
  return Array.isArray(v) ? v.length : 0
}

// Calcula el % de completitud según los campos requeridos por tipo de protocolo.
// - Express: nombre + objetivo + al menos 2 preguntas
// - Completo: nombre + objetivo + proyecto + cliente + al menos 3 preguntas
// - Presentación: título + resumen + al menos 2 hallazgos
export function computeCompletion(
  type: ProtocolType,
  name: string,
  data: FormData
): number {
  const nameOk = name.trim().length > 0
  let checks: boolean[]

  if (type === 'presentation') {
    checks = [
      filled(data.titulo) || nameOk,
      filled(data.resumen),
      arrLen(data.hallazgos) >= 2,
    ]
  } else if (type === 'complete' || type === 'ab') {
    checks = [
      nameOk,
      filled(data.objetivoGeneral) || filled(data.objetivo),
      filled(data.proyecto),
      filled(data.cliente),
      arrLen(data.questions) >= 3,
    ]
  } else {
    checks = [nameOk, filled(data.objetivo), arrLen(data.questions) >= 2]
  }

  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
}
