import type { Protocol } from '@/lib/types'
import { asArray, asString } from '@/components/protocols/forms/utils'
import { questionTypeLabel } from '@/lib/protocols/questionTypeLabels'

type Rec = Record<string, unknown>

interface QuestionScale {
  from: number
  to: number
}

// Formato tipado de cada pregunta para el texto de Lyssna.
export interface LyssnaQuestion {
  n: number
  text: string
  typeLabel: string
  scale: QuestionScale | null
  options: string[]
}

// Escala derivada del tipo (no se guarda en los datos): likert/scale5 = 1–5,
// scale7 = 1–7. El resto no lleva escala.
function scaleForType(type: string): QuestionScale | null {
  if (type === 'scale7') return { from: 1, to: 7 }
  if (type === 'likert' || type === 'scale5') return { from: 1, to: 5 }
  return null
}

// Lee las preguntas reales de data.questions ({ id, text, type[, options] }).
export function parseLyssnaQuestions(v: unknown): LyssnaQuestion[] {
  const out: LyssnaQuestion[] = []
  asArray<unknown>(v).forEach((raw) => {
    const o = (raw ?? {}) as Rec
    const text = asString(o.text)
    if (text.trim() === '') return
    const type = asString(o.type)
    const options = asArray<unknown>(o.options)
      .map((op) => (typeof op === 'string' ? op : asString(((op ?? {}) as Rec).value)))
      .filter((s) => s.trim() !== '')
    out.push({
      n: out.length + 1,
      text,
      typeLabel: questionTypeLabel(type),
      scale: scaleForType(type),
      options,
    })
  })
  return out
}

function questionBlock(q: LyssnaQuestion): string {
  const lines: string[] = [`${q.n}. ${q.text} [${q.typeLabel}]`]
  if (q.scale) {
    const steps: number[] = []
    for (let i = q.scale.from; i <= q.scale.to; i++) steps.push(i)
    lines.push(`   Escala: ${steps.join(' – ')}`)
  }
  if (q.options.length > 0) {
    lines.push('   Opciones:')
    q.options.forEach((opt) => lines.push(`     - ${opt}`))
  }
  return lines.join('\n')
}

// Construye el texto plano para pegar en un estudio nuevo de Lyssna.
// Solo incluye secciones con contenido real del protocolo.
export function buildLyssnaText(protocol: Protocol): string {
  const data = (protocol.data ?? {}) as Rec
  const parts: string[] = []

  const title = asString(data.tema) || protocol.name
  parts.push(title)

  const intro = asString(data.intro)
  if (intro) parts.push(`INTRODUCCIÓN\n${intro}`)

  const questions = parseLyssnaQuestions(data.questions)
  if (questions.length > 0) {
    parts.push(`PREGUNTAS DEL TEST\n${questions.map(questionBlock).join('\n\n')}`)
  }

  const cierre = asString(data.cierre)
  if (cierre) parts.push(`CIERRE\n${cierre}`)

  return parts.join('\n\n')
}
