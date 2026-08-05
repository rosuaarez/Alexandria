'use client'

import type { ProtocolStatus } from '@/lib/types'
import styles from './ActionPipeline.module.css'

type PipeVariant = 'primary' | 'approve' | 'dark' | 'lyssna' | 'link'

// Paso del pipeline: emoji/estilo van como data tipada (no sueltos en el JSX).
// 'status' transiciona el protocolo; 'action' ejecuta una acción sin cambiarlo.
type PipeStep =
  | {
      kind: 'status'
      key: string
      label: string
      icon: string
      variant: PipeVariant
      target: ProtocolStatus
    }
  | {
      kind: 'action'
      key: string
      label: string
      icon: string
      variant: PipeVariant
      action: 'lyssna' | 'pdf' | 'presentation'
    }

const FLOW_STEPS: PipeStep[] = [
  { kind: 'status', key: 'review', label: 'Enviar a revisión', icon: '✉️', variant: 'primary', target: 'in-review' },
  { kind: 'status', key: 'approve', label: 'Aprobar', icon: '✅', variant: 'approve', target: 'approved' },
  { kind: 'status', key: 'ready', label: 'Listo para ejecutar', icon: '🚀', variant: 'primary', target: 'ready' },
  { kind: 'action', key: 'lyssna', label: 'Lyssna', icon: '🧊', variant: 'lyssna', action: 'lyssna' },
]

const EXPORT_STEPS: PipeStep[] = [
  { kind: 'action', key: 'pdf', label: 'PDF', icon: '📄', variant: 'dark', action: 'pdf' },
  { kind: 'action', key: 'presentation', label: 'Presentación', icon: '🎨', variant: 'link', action: 'presentation' },
]

const variantClass: Record<PipeVariant, string> = {
  primary: styles.stepPrimary,
  approve: styles.stepApprove,
  dark: styles.stepDark,
  lyssna: styles.stepLyssna,
  link: styles.stepLink,
}

// Progreso del flujo de estado (para marcar pasos completados/actual).
const STATUS_RANK: Partial<Record<ProtocolStatus, number>> = {
  draft: 0,
  'in-review': 1,
  approved: 2,
  ready: 3,
  completed: 4,
}

function rankOf(status: ProtocolStatus): number {
  return STATUS_RANK[status] ?? 0
}

export interface ActionPipelineProps {
  status: ProtocolStatus
  onChangeStatus: (status: ProtocolStatus) => void
  onSendToReview: () => void
  onLyssna: () => void
  onPdf: () => void
  onPresentation: () => void
}

export function ActionPipeline({
  status,
  onChangeStatus,
  onSendToReview,
  onLyssna,
  onPdf,
  onPresentation,
}: ActionPipelineProps) {
  const currentRank = rankOf(status)

  // Índice del primer paso de estado aún no completado = paso "actual".
  const statusTargets = FLOW_STEPS.filter(
    (s): s is Extract<PipeStep, { kind: 'status' }> => s.kind === 'status'
  )
  const activeTarget = statusTargets.find((s) => rankOf(s.target) > currentRank)
    ?.target

  const runStep = (step: PipeStep) => {
    if (step.kind === 'status') {
      if (step.key === 'review') onSendToReview()
      else onChangeStatus(step.target)
      return
    }
    if (step.action === 'lyssna') onLyssna()
    else if (step.action === 'pdf') onPdf()
    else onPresentation()
  }

  const renderStep = (step: PipeStep) => {
    // Estado visual solo para los pasos de estado del flujo.
    let stateClass = variantClass[step.variant]
    let done = false
    let isActive = false
    if (step.kind === 'status') {
      done = rankOf(step.target) <= currentRank
      isActive = step.target === activeTarget
      stateClass = done
        ? styles.stepDone
        : isActive
          ? `${variantClass[step.variant]} ${styles.stepActive}`
          : styles.stepPending
    }

    return (
      <button
        type="button"
        className={`${styles.step} ${stateClass}`}
        onClick={() => runStep(step)}
        aria-current={isActive ? 'step' : undefined}
      >
        <span className={styles.stepIcon} aria-hidden>
          {done ? '✓' : step.icon}
        </span>
        {step.label}
      </button>
    )
  }

  return (
    <div className={styles.pipeline}>
      <div className={styles.pipeFlow}>
        {FLOW_STEPS.map((step, i) => (
          <div key={step.key} className={styles.pipeStepWrap}>
            {i > 0 && (
              <span className={styles.pipeSep} aria-hidden>
                ›
              </span>
            )}
            {renderStep(step)}
          </div>
        ))}
      </div>
      <div className={styles.pipeExports}>
        {EXPORT_STEPS.map((step) => (
          <span key={step.key}>{renderStep(step)}</span>
        ))}
      </div>
    </div>
  )
}
