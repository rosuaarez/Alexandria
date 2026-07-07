'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

function SortableQuestion({
  question,
  index,
  onText,
  onType,
  onDelete,
}: {
  question: Question
  index: number
  onText: (text: string) => void
  onType: (type: QuestionType) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.item}>
      <button
        type="button"
        className={styles.handle}
        aria-label="Reordenar pregunta"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.index}>{index + 1}</span>
          <input
            className={styles.text}
            value={question.text}
            placeholder="Texto de la pregunta"
            onChange={(e) => onText(e.target.value)}
          />
          <button
            type="button"
            className={styles.delete}
            aria-label="Eliminar pregunta"
            onClick={onDelete}
          >
            🗑
          </button>
        </div>
        <label className={styles.typeRow}>
          <span className={styles.typeLabel}>Tipo:</span>
          <select
            className={styles.typeSelect}
            value={question.type}
            onChange={(e) => onType(e.target.value as QuestionType)}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export function QuestionList({ questions, onChange }: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const addQuestion = () => {
    onChange([...questions, { id: crypto.randomUUID(), text: '', type: 'open' }])
  }

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  const deleteQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)
      onChange(arrayMove(questions, oldIndex, newIndex))
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Preguntas</span>
        <button type="button" className={styles.add} onClick={addQuestion}>
          + Agregar pregunta
        </button>
      </div>

      {questions.length === 0 && (
        <p className={styles.warning}>
          ⚠ Agrega al menos una pregunta (recomendado).
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list}>
            {questions.map((q, i) => (
              <SortableQuestion
                key={q.id}
                question={q}
                index={i}
                onText={(text) => updateQuestion(q.id, { text })}
                onType={(type) => updateQuestion(q.id, { type })}
                onDelete={() => deleteQuestion(q.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
