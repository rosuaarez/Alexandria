'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTeamStore, CURRENT_TEAM_MEMBER } from '@/lib/stores/useTeamStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import styles from './SelectionCommenter.module.css'

interface Pending {
  quote: string
  fieldKey: string
  fieldLabel: string
}

// Envuelve una región de texto de solo lectura y habilita comentar cualquier
// selección: al soltar el mouse sobre texto seleccionado aparece un botón
// flotante "+ Comentar" que abre el modal "Nuevo comentario". Se aplica de forma
// uniforme a TODOS los campos dentro (no campo por campo).
export function SelectionCommenter({
  protocolId,
  children,
}: {
  protocolId: string
  children: ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef<Pending | null>(null)
  const addComment = useTeamStore((s) => s.addComment)
  const showToast = useUIStore((s) => s.showToast)

  const [btn, setBtn] = useState<{ x: number; y: number } | null>(null)
  const [modal, setModal] = useState<Pending | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      // No reaccionar a clics en el propio botón o el modal.
      if (t.closest(`.${styles.floatBtn}`) || t.closest(`.${styles.overlay}`)) {
        return
      }
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ''
      const container = containerRef.current
      if (!sel || sel.rangeCount === 0 || text === '' || !container) {
        setBtn(null)
        return
      }
      const range = sel.getRangeAt(0)
      if (!container.contains(range.commonAncestorContainer)) {
        setBtn(null)
        return
      }
      // Atribución: campo más cercano con data-field-key (fallback: general).
      const anchor = sel.anchorNode
      const el =
        anchor instanceof HTMLElement ? anchor : anchor?.parentElement ?? null
      const fieldEl = el?.closest('[data-field-key]') as HTMLElement | null
      pendingRef.current = {
        quote: text.slice(0, 200),
        fieldKey: fieldEl?.dataset.fieldKey ?? 'general',
        fieldLabel: fieldEl?.dataset.fieldLabel ?? 'Protocolo',
      }
      const rect = range.getBoundingClientRect()
      setBtn({ x: rect.left + rect.width / 2, y: rect.top })
    }
    document.addEventListener('mouseup', onMouseUp)
    return () => document.removeEventListener('mouseup', onMouseUp)
  }, [])

  // Ocultar el botón flotante al hacer scroll.
  useEffect(() => {
    if (!btn) return
    const hide = () => setBtn(null)
    window.addEventListener('scroll', hide, true)
    return () => window.removeEventListener('scroll', hide, true)
  }, [btn])

  const openModal = () => {
    if (!pendingRef.current) return
    setModal(pendingRef.current)
    setDraft('')
    setBtn(null)
  }

  const closeModal = () => {
    setModal(null)
    setDraft('')
  }

  const submit = () => {
    const text = draft.trim()
    if (!text || !modal) return
    void addComment({
      protocolId,
      fieldKey: modal.fieldKey,
      fieldLabel: modal.fieldLabel,
      quote: modal.quote,
      author: CURRENT_TEAM_MEMBER,
      text,
      resolved: false,
      replies: [],
    })
    showToast('💬 Comentario agregado', 'success')
    window.getSelection()?.removeAllRanges()
    closeModal()
  }

  return (
    <div ref={containerRef}>
      {children}

      {btn && (
        <button
          type="button"
          className={styles.floatBtn}
          style={{ left: btn.x, top: btn.y - 44 }}
          // Evita que el mousedown borre la selección antes del click.
          onMouseDown={(e) => e.preventDefault()}
          onClick={openModal}
        >
          <span aria-hidden>＋</span> Comentar
        </button>
      )}

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Nuevo comentario"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <span className={styles.title}>Nuevo comentario</span>
              <button
                type="button"
                className={styles.close}
                onClick={closeModal}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className={styles.quote}>“{modal.quote}”</div>
            <textarea
              className={styles.input}
              autoFocus
              rows={3}
              placeholder="Escribe tu comentario…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
            />
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.cancel}
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="button" className={styles.send} onClick={submit}>
                Comentar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
