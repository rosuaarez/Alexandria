'use client'

import { useEffect, useState } from 'react'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

interface DeleteModalProps {
  isOpen: boolean
  protocolName: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export function DeleteModal({
  isOpen,
  protocolName,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false)
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay open"
      onClick={() => {
        if (!loading) onClose()
      }}
    >
      <div
        ref={trapRef}
        className="confirm-box"
        role="dialog"
        aria-modal="true"
        aria-label="Eliminar protocolo"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-icon">🗑️</div>
        <div className="confirm-title">Eliminar protocolo</div>
        <div className="confirm-body">
          ¿Estás seguro de que quieres eliminar &ldquo;{protocolName}&rdquo;?
          <br />
          Esta acción no se puede deshacer.
        </div>
        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
