'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Question, QuestionConfig, QuestionType } from '@/lib/types'
import {
  TypeConfigFields,
  hasConfig,
} from '@/components/protocols/TypeConfigFields'
import styles from './QuestionList.module.css'

interface QuestionTypeOption {
  value: QuestionType
  label: string
  description?: string
  recordings?: boolean
  desktopOnly?: boolean
}

interface QuestionTypeGroup {
  label: string
  options: QuestionTypeOption[]
}

// Tipo por defecto de toda pregunta nueva: "Abierta".
const DEFAULT_QUESTION_TYPE: QuestionType = 'open'

// Opciones del dropdown en dos grupos: "Preguntas" y "Técnicas UX".
const QUESTION_TYPE_GROUPS: QuestionTypeGroup[] = [
  {
    label: 'Preguntas',
    options: [
      { value: 'open', label: 'Abierta' },
      { value: 'likert', label: 'Likert' },
      { value: 'multiple', label: 'Opción múltiple' },
      { value: 'yesno', label: 'Sí / No' },
      { value: 'abtest', label: '🧪 A/B Test' },
    ],
  },
  {
    label: 'Técnicas UX',
    options: [
      { value: 'five-second', label: '5 Seconds Test' },
      { value: 'prototype', label: 'Prototype Test' },
      { value: 'context-screen', label: 'Context Screen' },
      { value: 'tree-test', label: 'Tree Test' },
      { value: 'card-sort', label: 'Card Sort' },
    ],
  },
]

const ALL_OPTIONS = QUESTION_TYPE_GROUPS.flatMap((g) => g.options)

// Opción por defecto (fallback para tipos legacy no ofrecidos en el dropdown).
const DEFAULT_OPTION =
  ALL_OPTIONS.find((o) => o.value === DEFAULT_QUESTION_TYPE) ?? ALL_OPTIONS[0]

const MENU_WIDTH = 360
const VIEWPORT_PAD = 8
const MENU_GAP = 6

interface MenuPos {
  top: number
  left: number
  width: number
  maxHeight: number
}

// Dropdown personalizado: título en blanco + descripción en gris debajo, con
// badges "Recordings"/"Desktop only". No se puede lograr con <select> nativo.
// El menú se renderiza en un portal con position:fixed para no quedar recortado
// por el overflow del contenedor y con detección de colisiones con el viewport.
function TypeSelect({
  value,
  onChange,
}: {
  value: QuestionType
  onChange: (value: QuestionType) => void
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPos | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const selected = ALL_OPTIONS.find((o) => o.value === value) ?? DEFAULT_OPTION

  const reposition = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(MENU_WIDTH, vw - VIEWPORT_PAD * 2)

    // Preferencia: borde derecho del menú alineado con el del trigger.
    let left = r.right - width
    if (left + width > vw - VIEWPORT_PAD) left = vw - VIEWPORT_PAD - width
    if (left < VIEWPORT_PAD) left = VIEWPORT_PAD

    const top = r.bottom + MENU_GAP
    const maxHeight = Math.max(180, vh - top - VIEWPORT_PAD)
    setPos({ top, left, width, maxHeight })
  }

  useLayoutEffect(() => {
    if (open) reposition()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onScroll = () => reposition()
    const onResize = () => reposition()
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <div className={styles.select}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.selectTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.selectValue}>{selected.label}</span>
      </button>

      {open &&
        pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            role="listbox"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              right: 'auto',
              width: pos.width,
              maxHeight: pos.maxHeight,
              zIndex: 1000,
            }}
          >
            {QUESTION_TYPE_GROUPS.map((g) => (
              <div key={g.label} className={styles.group}>
                <div className={styles.groupLabel}>{g.label}</div>
                {g.options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={o.value === value}
                    className={`${styles.option} ${
                      o.value === value ? styles.optionActive : ''
                    }`}
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                  >
                    <span className={styles.optionTitleRow}>
                      <span className={styles.optionTitle}>{o.label}</span>
                      {o.recordings && (
                        <span className={styles.badge}>Recordings</span>
                      )}
                      {o.desktopOnly && (
                        <span className={styles.badgeAlt}>Desktop only</span>
                      )}
                    </span>
                    {o.description && (
                      <span className={styles.optionDesc}>{o.description}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  )
}

interface QuestionListProps {
  questions: Question[]
  onChange: (questions: Question[]) => void
}

export function QuestionList({ questions, onChange }: QuestionListProps) {
  const addQuestion = () => {
    onChange([
      ...questions,
      { id: crypto.randomUUID(), text: '', type: DEFAULT_QUESTION_TYPE },
    ])
  }

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  const deleteQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id))
  }

  return (
    <div className={styles.wrap}>
      {questions.length === 0 && (
        <p className={styles.warning}>
          ⚠ Agrega al menos una pregunta (recomendado).
        </p>
      )}

      <div className={styles.list}>
        {questions.map((q, i) => (
          <div key={q.id} className={styles.qItem}>
            {/* Fila principal: número · input · tipo · × */}
            <div className={styles.item}>
              <span className={styles.index}>{i + 1}</span>
              <input
                className={styles.text}
                value={q.text}
                placeholder="Escribe la pregunta aquí..."
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              />
              <TypeSelect
                value={q.type}
                onChange={(type) => updateQuestion(q.id, { type })}
              />
              <button
                type="button"
                className={styles.delete}
                aria-label="Eliminar pregunta"
                onClick={() => deleteQuestion(q.id)}
              >
                ×
              </button>
            </div>

            {/* Bloque de configuración dinámico según el tipo. */}
            {hasConfig(q.type) && (
              <TypeConfigFields
                type={q.type}
                config={q.config ?? {}}
                onChange={(config: QuestionConfig) =>
                  updateQuestion(q.id, { config })
                }
              />
            )}
          </div>
        ))}
      </div>

      <button type="button" className={styles.add} onClick={addQuestion}>
        + Agregar pregunta
      </button>
    </div>
  )
}
