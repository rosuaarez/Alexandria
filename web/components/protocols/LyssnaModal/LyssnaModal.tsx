'use client'

import { useEffect, useRef } from 'react'
import styles from './LyssnaModal.module.css'

export interface LyssnaModalProps {
  isOpen: boolean
  text: string
  onClose: () => void
  onCopy: () => void
}

// Muestra el contenido formateado del protocolo para pegar en Lyssna.
// El texto siempre es visible/seleccionable, así sirve de fallback si el
// portapapeles falla por permisos.
export function LyssnaModal({ isOpen, text, onClose, onCopy }: LyssnaModalProps) {
  const areaRef = useRef<HTMLTextAreaElement>(null)

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
    const el = areaRef.current
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
      aria-label="Contenido para Lyssna"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Contenido para Lyssna</h3>
            <p className={styles.subtitle}>
              Copiado al portapapeles. Pégalo en tu nuevo estudio de Lyssna. Si no se
              copió, selecciona el texto y cópialo manualmente.
            </p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <textarea
            ref={areaRef}
            className={styles.preview}
            value={text}
            readOnly
            onFocus={selectAll}
            spellCheck={false}
          />
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnGhost} onClick={selectAll}>
            Seleccionar todo
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onCopy}>
            Copiar de nuevo
          </button>
        </div>
      </div>
    </div>
  )
}
