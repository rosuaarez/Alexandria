'use client'

import { useEffect, useState } from 'react'
import type { TeamRole } from '@/lib/types'
import { INVITABLE_ROLES, ROLE_LABELS } from '@/lib/data/teamMeta'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'
import styles from './InviteModal.module.css'

interface InviteModalProps {
  onClose: () => void
  onInvite: (email: string, role: TeamRole) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// El padre monta este componente solo cuando el modal debe estar abierto, por lo
// que el estado local arranca limpio en cada apertura (sin reset en efecto).
export function InviteModal({ onClose, onInvite }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamRole>('researcher')
  const [touched, setTouched] = useState(false)
  const trapRef = useFocusTrap<HTMLDivElement>(true)

  // Cerrar con Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const valid = EMAIL_RE.test(email.trim())

  const handleSubmit = () => {
    setTouched(true)
    if (!valid) return
    onInvite(email.trim(), role)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={trapRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Invitar colaborador"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Invitar colaborador</h2>
          <button
            type="button"
            className={styles.close}
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          <label className={styles.field}>
            <span className={styles.label}>Email *</span>
            <input
              className={styles.input}
              type="email"
              placeholder="colaborador@empresa.com"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
              }}
            />
            {touched && !valid && (
              <span className={styles.error}>Ingresa un email válido.</span>
            )}
          </label>

          <div className={styles.field}>
            <span className={styles.label}>Rol</span>
            <div className={styles.radios}>
              {INVITABLE_ROLES.map((r) => (
                <label key={r} className={styles.radio}>
                  <input
                    type="radio"
                    name="invite-role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  {ROLE_LABELS[r]}
                </label>
              ))}
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.submit}
            onClick={handleSubmit}
            disabled={!valid}
          >
            Enviar invitación
          </button>
        </footer>
      </div>
    </div>
  )
}
