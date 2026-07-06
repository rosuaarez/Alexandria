'use client'

import { useEffect } from 'react'
import type { TeamMember } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import { ROLE_CLASS, ROLE_LABELS, STATUS_LABELS } from '@/lib/data/teamMeta'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'
import styles from './MemberStats.module.css'

interface MemberStatsProps {
  member: TeamMember
  onClose: () => void
}

// Formatea una fecha ISO a "mes año" en español (sin librerías).
function formatJoined(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export function MemberStats({ member, onClose }: MemberStatsProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={trapRef}
        className={styles.popover}
        role="dialog"
        aria-modal="true"
        aria-label={`Estadísticas de ${member.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <header className={styles.header}>
          <Avatar
            initials={member.initials}
            color={member.avatarColor}
            name={member.name}
            size="lg"
          />
          <div className={styles.headerText}>
            <h2 className={styles.name}>{member.name}</h2>
            <span className={styles.email}>{member.email}</span>
            <span className={`${styles.roleBadge} ${styles[ROLE_CLASS[member.role]]}`}>
              {ROLE_LABELS[member.role]}
            </span>
          </div>
        </header>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{member.protocolsCount}</span>
            <span className={styles.statLabel}>Protocolos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{STATUS_LABELS[member.status]}</span>
            <span className={styles.statLabel}>Estado</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatJoined(member.joinedAt)}</span>
            <span className={styles.statLabel}>Miembro desde</span>
          </div>
        </div>
      </div>
    </div>
  )
}
