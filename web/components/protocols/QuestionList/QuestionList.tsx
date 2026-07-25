'use client'

import type { Question, QuestionType } from '@/lib/types'
import styles from './QuestionList.module.css'

interface QuestionTypeOption {
  value: QuestionType
  label: string
}

interface QuestionTypeGroup {
  label: string
  options: QuestionTypeOption[]
}

// Opciones del dropdown agrupadas (headers no seleccionables vía <optgroup>).
// El primer valor ('open' — Abierta) es el tipo por defecto.
const QUESTION_TYPE_GROUPS: QuestionTypeGroup[] = [
  {
    label: 'Preguntas',
    options: [
      { value: 'open', label: 'Abierta' },
      { value: 'likert', label: 'Likert' },
      { value: 'multiple', label: 'Opción múltiple' },
      { value: 'yesno', label: 'Sí / No' },
      { value: 'abtest', label: 'A/B Test' },
    ],
  },
  {
    label: 'Tipos de sección Lyssna',
    options: [
      { value: 'prototype', label: 'Prototype test' },
      { value: 'instruction', label: 'Instruction' },
      { value: 'first-click', label: 'First click' },
      { value: 'five-second', label: 'Five second test' },
      { value: 'survey', label: 'Survey questions' },
      { value: 'design-survey', label: 'Design survey' },
      { value: 'preference', label: 'Preference test' },
      { value: 'navigation', label: 'Navigation test' },
      { value: 'card-sort', label: 'Card sort' },
      { value: 'tree-test', label: 'Tree test' },
      { value: 'live-website', label: 'Live website test' },
    ],
  },
]

interface QuestionListProps {
  questions: Question[]
  onChange: (questions: Question[]) => void
}

export function QuestionList({ questions, onChange }: QuestionListProps) {
  const addQuestion = () => {
    onChange([...questions, { id: crypto.randomUUID(), text: '', type: 'open' }])
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
          // Cada pregunta en UNA fila: número · input · tipo · ×
          <div key={q.id} className={styles.item}>
            <span className={styles.index}>{i + 1}</span>
            <input
              className={styles.text}
              value={q.text}
              placeholder="Escribe la pregunta aquí..."
              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
            />
            <select
              className={styles.typeSelect}
              value={q.type}
              onChange={(e) =>
                updateQuestion(q.id, { type: e.target.value as QuestionType })
              }
            >
              {QUESTION_TYPE_GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              type="button"
              className={styles.delete}
              aria-label="Eliminar pregunta"
              onClick={() => deleteQuestion(q.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className={styles.add} onClick={addQuestion}>
        + Agregar pregunta
      </button>
    </div>
  )
}
