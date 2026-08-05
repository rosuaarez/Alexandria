'use client'

import type { QuestionConfig } from '@/lib/types'
import styles from './TypeConfigFields.module.css'

// Props comunes a todos los subcomponentes de configuración.
export interface ConfigProps {
  config: QuestionConfig
  patch: (p: Partial<QuestionConfig>) => void
}

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      className={styles.input}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      className={styles.textarea}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <select
      className={styles.select}
      value={value || options[0]}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

// Lista editable reutilizable (Opciones, Aspectos, Nodos, Tarjetas...).
export function EditableList({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[]
  onChange: (next: string[]) => void
  placeholder: (i: number) => string
  addLabel: string
}) {
  const update = (i: number, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? v : it)))
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ''])

  return (
    <div className={styles.list}>
      {items.map((it, i) => (
        <div key={i} className={styles.listRow}>
          <input
            className={styles.input}
            value={it}
            placeholder={placeholder(i)}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            className={styles.listDelete}
            aria-label="Eliminar"
            onClick={() => remove(i)}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={add}>
        + {addLabel}
      </button>
    </div>
  )
}
