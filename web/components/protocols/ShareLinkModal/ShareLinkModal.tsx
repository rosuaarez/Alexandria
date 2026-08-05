'use client'

import { useEffect, useRef } from 'react'
import styles from './ShareLinkModal.module.css'

export interface ShareLinkModalProps {
  isOpen: boolean
  link: string
  onClose: () => void
  onCopy: () => void
}

// Modal con la liga compartible del protocolo (al enviar a revisión).
export function ShareLinkModal({
  isOpen,
  link,
  onClose,
  onCopy,
}: ShareLinkModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const selectAll = () => {
    const el = inputRef.current
    if (el) {
      el.focus()
      el.select()
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Liga compartible"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Enviado a revisión ✉️</h3>
            <p className={styles.subtitle}>
              Comparte esta liga con los stakeholders para que revisen el
              protocolo.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <input
            ref={inputRef}
            className={styles.link}
            value={link}
            readOnly
            onFocus={selectAll}
          />
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnGhost} onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onCopy}>
            Copiar liga
          </button>
        </div>
      </div>
    </div>
  )
}
