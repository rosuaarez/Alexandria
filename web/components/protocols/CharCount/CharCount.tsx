'use client'

import styles from './CharCount.module.css'

// Contador de caracteres para textareas largos. Pasa a color de peligro cuando se
// supera el 80% del límite.
export function CharCount({ value, max }: { value?: string; max: number }) {
  const len = (value ?? '').length
  const near = len > max * 0.8
  return (
    <span
      className={`${styles.count} ${near ? styles.near : ''}`}
      aria-live="polite"
    >
      {len} / {max}
    </span>
  )
}
