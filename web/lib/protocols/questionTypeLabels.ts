import type { QuestionType } from '@/lib/types'

// Etiquetas legibles por tipo de pregunta (todas las del modelo actual).
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  open: 'Abierta',
  likert: 'Escala Likert',
  multiple: 'Opción múltiple',
  yesno: 'Sí / No',
  abtest: 'A/B Test',
  prototype: 'Prototype test',
  instruction: 'Instruction',
  'first-click': 'First click',
  'five-second': 'Five second test',
  survey: 'Survey questions',
  'design-survey': 'Design survey',
  preference: 'Preference test',
  navigation: 'Navigation test',
  'card-sort': 'Card sort',
  'tree-test': 'Tree test',
  'live-website': 'Live website test',
  closed: 'Cerrada',
  scale5: 'Escala (1-5)',
  scale7: 'Escala (1-7)',
  nps: 'NPS',
}

// Etiqueta legible para un tipo (con fallback al valor crudo).
export function questionTypeLabel(type: string): string {
  return QUESTION_TYPE_LABELS[type as QuestionType] ?? type ?? 'Pregunta'
}
