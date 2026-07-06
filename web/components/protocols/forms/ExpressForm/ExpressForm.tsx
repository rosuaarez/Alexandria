'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Question } from '@/lib/types'
import { QuestionList } from '@/components/protocols/QuestionList'
import { FieldCommentIndicator } from '@/components/protocols/FieldCommentIndicator'
import { CharCount } from '@/components/protocols/CharCount'
import type { FormProps } from '@/components/protocols/forms/types'
import { asQuestions, asString } from '@/components/protocols/forms/utils'
import styles from './ExpressForm.module.css'

interface ExpressValues {
  objetivo: string
  platform: 'maze' | 'forms'
}

export function ExpressForm({ initialData, onChange }: FormProps) {
  const { register, watch, getValues } = useForm<ExpressValues>({
    defaultValues: {
      objetivo: asString(initialData.objetivo),
      platform: (asString(initialData.platform) as 'maze' | 'forms') || 'maze',
    },
  })

  const [questions, setQuestions] = useState<Question[]>(
    asQuestions(initialData.questions)
  )

  // Propaga solo en cambios reales (name definido) — evita marcar dirty al montar.
  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (name) onChange({ ...values, questions })
    })
    return () => sub.unsubscribe()
  }, [watch, onChange, questions])

  const handleQuestions = (next: Question[]) => {
    setQuestions(next)
    onChange({ ...getValues(), questions: next })
  }

  return (
    <div className={styles.form}>
      <label className={styles.field}>
        <span className={styles.labelRow}>
          <span className={styles.label}>Objetivo / Resumen *</span>
          <FieldCommentIndicator
            fieldKey="objetivo"
            fieldLabel="Objetivo del protocolo"
          />
        </span>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="¿Qué quieres lograr con esta investigación?"
          {...register('objetivo')}
        />
        <CharCount value={watch('objetivo')} max={500} />
      </label>

      <div className={styles.field}>
        <span className={styles.label}>Plataforma</span>
        <div className={styles.radioRow}>
          <label className={styles.radio}>
            <input type="radio" value="maze" {...register('platform')} /> Maze
          </label>
          <label className={styles.radio}>
            <input type="radio" value="forms" {...register('platform')} /> Google
            Forms
          </label>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.labelRow}>
        <span className={styles.label}>Preguntas</span>
        <FieldCommentIndicator
          fieldKey="preguntas"
          fieldLabel="Preguntas del protocolo"
        />
      </div>

      <QuestionList questions={questions} onChange={handleQuestions} />
    </div>
  )
}
