'use client'

import type { Question, QuestionType } from '@/lib/types'
import styles from './QuestionList.module.css'

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'open', label: 'Abierta' },
  { value: 'closed', label: 'Cerrada' },
  { value: 'scale5', label: 'Escala (1-5)' },
  { value: 'scale7', label: 'Escala (1-7)' },
  { value: 'multiple', label: 'Opción múltiple' },
  { value: 'nps', label: 'NPS' },
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
              {QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
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
