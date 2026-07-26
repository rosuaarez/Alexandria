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

export interface ActionPipelineProps {
  onChangeStatus: (status: ProtocolStatus) => void
  onLyssna: () => void
  onPdf: () => void
  onPresentation: () => void
}

export function ActionPipeline({
  onChangeStatus,
  onLyssna,
  onPdf,
  onPresentation,
}: ActionPipelineProps) {
  // Todos los pasos están siempre activos: cada clic ejecuta su acción o
  // cambia el estado del protocolo (sin flujo por pasos).
  const runStep = (step: PipeStep) => {
    if (step.kind === 'status') {
      onChangeStatus(step.target)
      return
    }
    if (step.action === 'lyssna') onLyssna()
    else if (step.action === 'pdf') onPdf()
    else onPresentation()
  }

  const renderStep = (step: PipeStep) => (
    <button
      type="button"
      className={`${styles.step} ${variantClass[step.variant]}`}
      onClick={() => runStep(step)}
    >
      <span className={styles.stepIcon} aria-hidden>
        {step.icon}
      </span>
      {step.label}
    </button>
  )

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
