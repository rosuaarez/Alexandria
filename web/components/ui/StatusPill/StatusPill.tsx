import type { ProtocolStatus } from '@/lib/types'
import styles from './StatusPill.module.css'

interface StatusStyle {
  label: string
  bg: string
  color: string
}

// Colores definidos por la spec del Sprint 2 (migración 1:1 del HTML original).
// Donde existe token CSS se usa la variable; los estados con color propio del
// diseño original conservan su hex exacto.
const STATUS_CONFIG: Record<ProtocolStatus, StatusStyle> = {
  draft: { label: 'Borrador', bg: 'var(--surface-2)', color: 'var(--text-3)' },
  'in-review': { label: 'En revisión', bg: '#FEF3C7', color: '#92400E' },
  approved: { label: 'Aprobado', bg: '#D1FAE5', color: '#065F46' },
  ready: { label: 'Listo', bg: '#D1FAE5', color: '#065F46' },
  activo: { label: 'Activo', bg: '#D1FAE5', color: '#065F46' },
  completed: { label: 'Completado', bg: '#EDE9FE', color: 'var(--accent)' },
  finalizado: { label: 'Finalizado', bg: '#EDE9FE', color: 'var(--accent)' },
  onhold: { label: 'En pausa', bg: '#FEE2E2', color: 'var(--danger)' },
  cerrado: { label: 'Cerrado', bg: 'var(--surface-2)', color: 'var(--text-4)' },
  changes_requested: { label: 'Con cambios', bg: '#FEF3C7', color: '#92400E' },
}

interface StatusPillProps {
  status: ProtocolStatus
  size?: 'sm' | 'md'
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span
      className={`${styles.pill} ${styles[size]}`}
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  )
}
