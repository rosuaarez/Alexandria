import type { CapsulaCategory, ProtocolType } from '@/lib/types'

export const CAPSULA_CATEGORY_LABELS: Record<CapsulaCategory, string> = {
  metodo: 'Método',
  consejo: 'Consejo',
  'caso-estudio': 'Caso de estudio',
  herramienta: 'Herramienta',
  dato: 'Dato',
}

// Sufijo de clase CSS por categoría (evita el guion de 'caso-estudio').
export const CAPSULA_CATEGORY_CLASS: Record<CapsulaCategory, string> = {
  metodo: 'metodo',
  consejo: 'consejo',
  'caso-estudio': 'caso',
  herramienta: 'herramienta',
  dato: 'dato',
}

export const PROTOCOL_TYPE_META: Record<ProtocolType, { emoji: string; label: string }> = {
  express: { emoji: '⚡', label: 'Express' },
  complete: { emoji: '📋', label: 'Completo' },
  presentation: { emoji: '📊', label: 'Presentación' },
  ab: { emoji: '🔀', label: 'A/B' },
}
