import type { Question } from '@/lib/types'

export function asString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

export function asQuestions(v: unknown): Question[] {
  if (!Array.isArray(v)) return []
  return v.filter(
    (q): q is Question =>
      typeof q === 'object' &&
      q !== null &&
      typeof (q as Question).id === 'string'
  )
}
