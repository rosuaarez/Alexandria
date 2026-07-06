'use client'

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { FormProps } from '@/components/protocols/forms/types'
import { asArray, asString } from '@/components/protocols/forms/utils'
import { CharCount } from '@/components/protocols/CharCount'
import styles from '@/components/protocols/forms/shared.module.css'

interface Hallazgo {
  titulo: string
  descripcion: string
  severidad: 'alta' | 'media' | 'baja'
}
interface PainPoint {
  texto: string
}
interface Cita {
  texto: string
  autor: string
}
interface Metrica {
  label: string
  valor: string
}
interface Recomendacion {
  texto: string
  prioridad: 'alta' | 'media' | 'baja'
}
interface ProximoPaso {
  texto: string
}

interface PresentationValues {
  titulo: string
  subtitulo: string
  autor: string
  fecha: string
  resumen: string
  hallazgos: Hallazgo[]
  painPoints: PainPoint[]
  citas: Cita[]
  metricas: Metrica[]
  recomendaciones: Recomendacion[]
  proximosPasos: ProximoPaso[]
}

export function PresentationForm({ initialData, onChange }: FormProps) {
  const { register, watch, control } = useForm<PresentationValues>({
    defaultValues: {
      titulo: asString(initialData.titulo),
      subtitulo: asString(initialData.subtitulo),
      autor: asString(initialData.autor),
      fecha: asString(initialData.fecha),
      resumen: asString(initialData.resumen),
      hallazgos: asArray<Hallazgo>(initialData.hallazgos),
      painPoints: asArray<PainPoint>(initialData.painPoints),
      citas: asArray<Cita>(initialData.citas),
      metricas: asArray<Metrica>(initialData.metricas),
      recomendaciones: asArray<Recomendacion>(initialData.recomendaciones),
      proximosPasos: asArray<ProximoPaso>(initialData.proximosPasos),
    },
  })

  const hallazgos = useFieldArray({ control, name: 'hallazgos' })
  const painPoints = useFieldArray({ control, name: 'painPoints' })
  const citas = useFieldArray({ control, name: 'citas' })
  const metricas = useFieldArray({ control, name: 'metricas' })
  const recomendaciones = useFieldArray({ control, name: 'recomendaciones' })
  const proximosPasos = useFieldArray({ control, name: 'proximosPasos' })

  useEffect(() => {
    const sub = watch((values, { name }) => {
      if (name) onChange({ ...values })
    })
    return () => sub.unsubscribe()
  }, [watch, onChange])

  return (
    <div className={styles.form}>
      <p className={styles.sectionTitle}>Portada</p>
      <div className={styles.grid2}>
        <label className={styles.field}>
          <span className={styles.label}>Título del estudio *</span>
          <input className={styles.input} {...register('titulo')} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Subtítulo</span>
          <input className={styles.input} {...register('subtitulo')} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Autor</span>
          <input className={styles.input} {...register('autor')} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Fecha</span>
          <input type="date" className={styles.input} {...register('fecha')} />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Resumen ejecutivo</span>
        <textarea className={styles.textarea} rows={4} {...register('resumen')} />
        <CharCount value={watch('resumen')} max={500} />
      </label>

      <p className={styles.sectionTitle}>Hallazgos clave</p>
      {hallazgos.fields.length === 0 && (
        <p className={styles.empty}>Sin hallazgos aún.</p>
      )}
      {hallazgos.fields.map((f, i) => (
        <div key={f.id} className={styles.listItem}>
          <div className={styles.listBody}>
            <input
              className={styles.input}
              placeholder="Título del hallazgo"
              {...register(`hallazgos.${i}.titulo` as const)}
            />
            <textarea
              className={styles.textarea}
              rows={2}
              placeholder="Descripción"
              {...register(`hallazgos.${i}.descripcion` as const)}
            />
            <select
              className={styles.select}
              {...register(`hallazgos.${i}.severidad` as const)}
            >
              <option value="alta">Severidad: Alta</option>
              <option value="media">Severidad: Media</option>
              <option value="baja">Severidad: Baja</option>
            </select>
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label="Quitar hallazgo"
            onClick={() => hallazgos.remove(i)}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() =>
          hallazgos.append({ titulo: '', descripcion: '', severidad: 'media' })
        }
      >
        + Agregar hallazgo
      </button>

      <p className={styles.sectionTitle}>Pain points</p>
      {painPoints.fields.map((f, i) => (
        <div key={f.id} className={styles.listItem}>
          <div className={styles.listBody}>
            <input
              className={styles.input}
              placeholder="Pain point"
              {...register(`painPoints.${i}.texto` as const)}
            />
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label="Quitar pain point"
            onClick={() => painPoints.remove(i)}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => painPoints.append({ texto: '' })}
      >
        + Agregar pain point
      </button>

      <p className={styles.sectionTitle}>Citas de usuarios</p>
      {citas.fields.map((f, i) => (
        <div key={f.id} className={styles.listItem}>
          <div className={styles.listBody}>
            <textarea
              className={styles.textarea}
              rows={2}
              placeholder="“Cita textual…”"
              {...register(`citas.${i}.texto` as const)}
            />
            <input
              className={styles.input}
              placeholder="Autor / perfil"
              {...register(`citas.${i}.autor` as const)}
            />
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label="Quitar cita"
            onClick={() => citas.remove(i)}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => citas.append({ texto: '', autor: '' })}
      >
        + Agregar cita
      </button>

      <p className={styles.sectionTitle}>Métricas</p>
      {metricas.fields.map((f, i) => (
        <div key={f.id} className={styles.listItem}>
          <div className={styles.listBody}>
            <div className={styles.grid2}>
              <input
                className={styles.input}
                placeholder="Métrica"
                {...register(`metricas.${i}.label` as const)}
              />
              <input
                className={styles.input}
                placeholder="Valor"
                {...register(`metricas.${i}.valor` as const)}
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label="Quitar métrica"
            onClick={() => metricas.remove(i)}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => metricas.append({ label: '', valor: '' })}
      >
        + Agregar métrica
      </button>

      <p className={styles.sectionTitle}>Recomendaciones</p>
      {recomendaciones.fields.map((f, i) => (
        <div key={f.id} className={styles.listItem}>
          <div className={styles.listBody}>
            <textarea
              className={styles.textarea}
              rows={2}
              placeholder="Recomendación"
              {...register(`recomendaciones.${i}.texto` as const)}
            />
            <select
              className={styles.select}
              {...register(`recomendaciones.${i}.prioridad` as const)}
            >
              <option value="alta">Prioridad: Alta</option>
              <option value="media">Prioridad: Media</option>
              <option value="baja">Prioridad: Baja</option>
            </select>
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label="Quitar recomendación"
            onClick={() => recomendaciones.remove(i)}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => recomendaciones.append({ texto: '', prioridad: 'media' })}
      >
        + Agregar recomendación
      </button>

      <p className={styles.sectionTitle}>Próximos pasos</p>
      {proximosPasos.fields.map((f, i) => (
        <div key={f.id} className={styles.listItem}>
          <div className={styles.listBody}>
            <input
              className={styles.input}
              placeholder="Próximo paso"
              {...register(`proximosPasos.${i}.texto` as const)}
            />
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label="Quitar paso"
            onClick={() => proximosPasos.remove(i)}
          >
            🗑
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => proximosPasos.append({ texto: '' })}
      >
        + Agregar paso
      </button>
    </div>
  )
}
