'use client'

import type { ProtocolStatus } from '@/lib/types'
import styles from './WorkflowBanner.module.css'

const STEPS: { status: ProtocolStatus; label: string }[] = [
  { status: 'draft', label: 'Borrador' },
  { status: 'in-review', label: 'En revisión' },
  { status: 'approved', label: 'Aprobado' },
  { status: 'ready', label: 'Listo' },
  { status: 'completed', label: 'Completado' },
]

interface WorkflowBannerProps {
  status: ProtocolStatus
  completion?: number
}

export function WorkflowBanner({ status, completion }: WorkflowBannerProps) {
  // Estados fuera del flujo lineal caen al índice 0 (no resaltan pasos posteriores).
  const activeIndex = STEPS.findIndex((s) => s.status === status)

  return (
    <div className={styles.wrap}>
      <div className={styles.banner}>
      {STEPS.map((step, i) => {
        const state =
          activeIndex < 0
            ? 'future'
            : i < activeIndex
              ? 'done'
              : i === activeIndex
                ? 'active'
                : 'future'
        return (
          <div key={step.status} className={styles.step}>
            <span className={`${styles.dot} ${styles[state]}`}>
              {state === 'done' ? '✓' : i + 1}
            </span>
            <span className={`${styles.label} ${styles[`label_${state}`]}`}>
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`${styles.line} ${i < activeIndex ? styles.lineDone : ''}`}
              />
            )}
          </div>
        )
      })}
      </div>

      {typeof completion === 'number' && (
        <div className={styles.completion}>
          <span className={styles.completionLabel}>Completitud</span>
          <div className={styles.completionTrack}>
            <div
              className={styles.completionFill}
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className={styles.completionValue}>{completion}%</span>
        </div>
      )}
    </div>
  )
}
