'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { Question } from '@/lib/types'
import { QuestionList } from '@/components/protocols/QuestionList'
import { FieldCommentIndicator } from '@/components/protocols/FieldCommentIndicator'
import { CharCount } from '@/components/protocols/CharCount'
import { Accordion } from '@/components/protocols/forms/Accordion'
import type { FormProps } from '@/components/protocols/forms/types'
import { asArray, asQuestions, asString } from '@/components/protocols/forms/utils'
import styles from '@/components/protocols/forms/shared.module.css'

interface TeamMember {
  name: string
  role: string
}

interface CompleteValues {
  proyecto: string
  cliente: string
  tema: string
  fecha: string
  objetivoGeneral: string
  preguntasInvestigacion: string
  perfilParticipantes: string
  criteriosInclusion: string
  numParticipantes: string
  metodologia: string
  plataforma: 'maze' | 'forms'
  duracion: string
  incentivo: string
  team: TeamMember[]
  notas: string
}

export function CompleteForm({ initialData, onChange }: FormProps) {
  const { register, watch, getValues, control } = useForm<CompleteValues>({
    defaultValues: {
      proyecto: asString(initialData.proyecto),
      cliente: asString(initialData.cliente),
      tema: asString(initialData.tema),
      fecha: asString(initialData.fecha),
      objetivoGeneral: asString(initialData.objetivoGeneral),
      preguntasInvestigacion: asString(initialData.preguntasInvestigacion),
      perfilParticipantes: asString(initialData.perfilParticipantes),
      criteriosInclusion: asString(initialData.criteriosInclusion),
      numParticipantes: asString(initialData.numParticipantes),
      metodologia: asString(initialData.metodologia),
      plataforma:
        (asString(initialData.plataforma) as 'maze' | 'forms') || 'maze',
      duracion: asString(initialData.duracion),
      incentivo: asString(initialData.incentivo),
      team: asArray<TeamMember>(initialData.team),
      notas: asString(initialData.notas),
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'team' })

  const [questions, setQuestions] = useState<Question[]>(
    asQuestions(initialData.questions)
  )

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
      <Accordion title="1. Contexto del proyecto" defaultOpen>
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span className={styles.label}>Proyecto</span>
            <input className={styles.input} {...register('proyecto')} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Cliente / Área</span>
            <input className={styles.input} {...register('cliente')} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Tema</span>
            <input className={styles.input} {...register('tema')} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Fecha</span>
            <input type="date" className={styles.input} {...register('fecha')} />
          </label>
        </div>
      </Accordion>

      <Accordion title="2. Objetivos de investigación">
        <label className={styles.field}>
          <span className={styles.labelRow}>
            <span className={styles.label}>Objetivo general</span>
            <FieldCommentIndicator
              fieldKey="objetivo"
              fieldLabel="Objetivo del protocolo"
            />
          </span>
          <textarea
            className={styles.textarea}
            rows={3}
            placeholder="¿Qué buscas responder con este estudio?"
            {...register('objetivoGeneral')}
          />
          <CharCount value={watch('objetivoGeneral')} max={500} />
        </label>
      </Accordion>

      <Accordion title="3. Preguntas de investigación">
        <label className={styles.field}>
          <span className={styles.labelRow}>
            <span className={styles.label}>Preguntas de investigación</span>
            <FieldCommentIndicator
              fieldKey="preguntas"
              fieldLabel="Preguntas del protocolo"
            />
          </span>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="Una por línea"
            {...register('preguntasInvestigacion')}
          />
        </label>
      </Accordion>

      <Accordion title="4. Perfil de participantes">
        <label className={styles.field}>
          <span className={styles.labelRow}>
            <span className={styles.label}>Perfil objetivo</span>
            <FieldCommentIndicator
              fieldKey="perfil_usuario"
              fieldLabel="Perfil del participante"
            />
          </span>
          <textarea
            className={styles.textarea}
            rows={2}
            {...register('perfilParticipantes')}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Criterios de inclusión / exclusión</span>
          <textarea
            className={styles.textarea}
            rows={2}
            {...register('criteriosInclusion')}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Número de participantes</span>
          <input className={styles.input} {...register('numParticipantes')} />
        </label>
      </Accordion>

      <Accordion title="5. Metodología">
        <label className={styles.field}>
          <span className={styles.label}>Descripción de la metodología</span>
          <textarea
            className={styles.textarea}
            rows={3}
            {...register('metodologia')}
          />
        </label>
      </Accordion>

      <Accordion title="6. Logística">
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span className={styles.label}>Plataforma</span>
            <select className={styles.select} {...register('plataforma')}>
              <option value="maze">Maze</option>
              <option value="forms">Google Forms</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Duración estimada</span>
            <input className={styles.input} {...register('duracion')} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Incentivo</span>
            <input className={styles.input} {...register('incentivo')} />
          </label>
        </div>
      </Accordion>

      <Accordion title="7. Guion de preguntas">
        <QuestionList questions={questions} onChange={handleQuestions} />
      </Accordion>

      <Accordion title="8. Equipo y notas">
        {fields.length === 0 && (
          <p className={styles.empty}>Sin miembros del equipo aún.</p>
        )}
        {fields.map((f, i) => (
          <div key={f.id} className={styles.listItem}>
            <div className={styles.listBody}>
              <div className={styles.grid2}>
                <input
                  className={styles.input}
                  placeholder="Nombre"
                  {...register(`team.${i}.name` as const)}
                />
                <input
                  className={styles.input}
                  placeholder="Rol"
                  {...register(`team.${i}.role` as const)}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.remove}
              aria-label="Quitar miembro"
              onClick={() => remove(i)}
            >
              🗑
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => append({ name: '', role: '' })}
        >
          + Agregar miembro
        </button>
        <label className={styles.field}>
          <span className={styles.label}>Notas adicionales</span>
          <textarea
            className={styles.textarea}
            rows={3}
            {...register('notas')}
          />
        </label>
      </Accordion>
    </div>
  )
}
