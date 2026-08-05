import { asQuestions, asString } from '@/components/protocols/forms/utils'
import { questionTypeLabel } from '@/lib/protocols/questionTypeLabels'
import type { FormData } from '@/components/protocols/forms/types'
import type { ABVariant, QuestionConfig, QuestionType } from '@/lib/types'

type Rec = Record<string, unknown>

// Mapeo de los tipos internos (Técnicas UX) → nombre real de la sección de
// Lyssna que se usa en el texto exportado. El agrupado se hace por este nombre.
const LYSSNA_SECTION: Partial<Record<QuestionType, string>> = {
  open: 'Survey questions (Long text)',
  likert: 'Survey questions (Linear scale)',
  multiple: 'Survey questions (Single select / Multi select)',
  yesno: 'Survey questions (Single select con opciones Sí/No)',
  abtest: 'Preference test',
  'five-second': 'Five second test',
  prototype: 'Prototype test',
  'context-screen': 'Instruction',
  'tree-test': 'Tree test',
  'card-sort': 'Card sort',
}

function lyssnaSection(type: QuestionType): string {
  return LYSSNA_SECTION[type] ?? questionTypeLabel(type)
}

const IND = '   ' // sangría de las líneas de configuración bajo cada pregunta

function pushLine(lines: string[], label: string, value?: string) {
  const v = (value ?? '').trim()
  if (v) lines.push(`${IND}${label}: ${v}`)
}

function pushList(lines: string[], label: string, items?: string[]) {
  const clean = (items ?? []).map((s) => s.trim()).filter(Boolean)
  if (clean.length === 0) return
  lines.push(`${IND}${label}:`)
  clean.forEach((it) => lines.push(`${IND}  - ${it}`))
}

// Líneas de detalle (config) que acompañan a cada pregunta en el export, para
// que la persona pueda copiar los datos directo al crear la sección en Lyssna.
function configLines(type: QuestionType, config: QuestionConfig): string[] {
  const lines: string[] = []
  switch (type) {
    case 'likert': {
      const scale = asString(config.scale) || '1 – 5'
      const start = asString(config.startLabel)
      const end = asString(config.endLabel)
      const range = start || end ? ` · "${start}" → "${end}"` : ''
      lines.push(`${IND}Escala: ${scale}${range}`)
      break
    }
    case 'multiple':
      pushList(lines, 'Opciones', config.options)
      break
    case 'yesno':
      lines.push(`${IND}Opciones: Sí / No`)
      break
    case 'abtest': {
      pushLine(lines, 'Criterio', config.criterio)
      const variants: ABVariant[] = config.variants ?? []
      variants.forEach((v, i) => {
        const label = String.fromCharCode(65 + i)
        const desc = asString(v.desc)
        const link = asString(v.link)
        const parts = [desc, link].filter(Boolean).join(' — ')
        if (parts) lines.push(`${IND}Variante ${label}: ${parts}`)
        pushLine(lines, `Imagen ${label}`, v.imageUrl)
      })
      break
    }
    case 'five-second':
      pushLine(lines, 'Duración', config.duration)
      pushLine(lines, 'Estímulo', config.stimulusType)
      pushLine(lines, 'Medir', config.measure)
      pushLine(lines, 'Instrucción', config.instruction)
      break
    case 'prototype':
      pushLine(lines, 'Herramienta', config.tool)
      pushLine(lines, 'Fidelidad', config.fidelity)
      pushLine(lines, 'Tarea', config.task)
      pushLine(lines, 'Métrica', config.metric)
      pushLine(lines, 'URL prototipo', config.prototypeUrl)
      break
    case 'context-screen':
      pushLine(lines, 'Pantalla / flujo', config.screen)
      pushLine(lines, 'Contexto de uso', config.usageContext)
      pushLine(lines, 'Escenario', config.scenario)
      pushList(lines, 'Aspectos a observar', config.aspects)
      break
    case 'tree-test':
      pushLine(lines, 'Herramienta', config.tool)
      pushLine(lines, 'Profundidad', config.depth)
      pushLine(lines, 'Tarea de navegación', config.navTask)
      pushLine(lines, 'Respuesta esperada', config.expectedAnswer)
      pushList(lines, 'Nodos del árbol', config.nodes)
      break
    case 'card-sort':
      pushLine(lines, 'Tipo', config.sortType)
      pushLine(lines, 'Herramienta', config.tool)
      pushLine(lines, 'Instrucción', config.instruction)
      pushList(lines, 'Tarjetas', config.cards)
      break
  }
  return lines
}

// Construye el texto markdown listo para pegar en Lyssna. Agrupa las preguntas
// por tramos *consecutivos* que mapean a la misma sección de Lyssna, e incluye
// los campos de configuración de cada pregunta como parte del texto.
export function buildLyssnaMarkdown(name: string, data: FormData): string {
  const d = data as Rec

  const title = asString(d.tema) || name.trim() || 'Prueba'
  const intro = asString(d.intro).trim()
  const cierre = asString(d.cierre).trim()
  const testUrl = asString(d.testUrl).trim()
  const tool = asString(d.herramientaPrueba).trim()

  const questions = asQuestions(d.questions).filter(
    (q) => asString(q.text).trim() !== ''
  )

  const lines: string[] = []
  lines.push(`# ${title}`)
  lines.push('')
  lines.push('## Welcome screen')
  lines.push(intro || '_(sin introducción)_')
  lines.push('')

  let section = 0
  let i = 0
  while (i < questions.length) {
    const sectionName = lyssnaSection(questions[i].type)
    const group: typeof questions = []
    while (i < questions.length && lyssnaSection(questions[i].type) === sectionName) {
      group.push(questions[i])
      i++
    }
    section++
    lines.push(`## Sección ${section} — ${sectionName}`)
    group.forEach((q, idx) => {
      lines.push(`${idx + 1}. ${asString(q.text).trim()}`)
      configLines(q.type, q.config ?? {}).forEach((l) => lines.push(l))
    })
    lines.push('')
  }

  lines.push('## Thank you screen')
  lines.push(cierre || '_(sin cierre)_')

  if (testUrl || tool) {
    lines.push('')
    lines.push('---')
    if (testUrl) lines.push(`**Link de la prueba:** ${testUrl}`)
    if (tool) lines.push(`**Herramienta:** ${tool}`)
  }

  return lines.join('\n').trim() + '\n'
}
