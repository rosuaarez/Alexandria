'use client'

import { useEffect, useState } from 'react'
import type { ProjectFolder } from '@/lib/types'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'
import { EmojiPicker } from '@/components/ui/EmojiPicker'

// ISO → yyyy-mm-dd para el <input type="date">.
function toDateInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export interface FolderModalData {
  name: string
  emoji: string
  description?: string
  createdAt: string
}

interface FolderModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  folder?: ProjectFolder | null
  onClose: () => void
  onSubmit: (data: FolderModalData) => void
}

export function FolderModal({
  isOpen,
  mode,
  folder,
  onClose,
  onSubmit,
}: FolderModalProps) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📁')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen)

  // Sincroniza los campos al abrir (pre-rellenado en edición, defaults en creación).
  useEffect(() => {
    if (!isOpen) return
    setName(folder?.name ?? '')
    setEmoji(folder?.emoji ?? '📁')
    setDescription(folder?.description ?? '')
    setDate(toDateInput(folder?.createdAt) || toDateInput(new Date().toISOString()))
    setEmojiOpen(false)
  }, [isOpen, folder])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isEdit = mode === 'edit'
  const canSubmit = name.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      emoji,
      description: description.trim() || undefined,
      createdAt: date ? new Date(date).toISOString() : new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        ref={trapRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Editar carpeta' : 'Nueva carpeta'}
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            {/* Ícono clickeable → EmojiPicker. */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="modal-title-icon"
                title="Cambiar icono"
                aria-label="Cambiar icono"
                onClick={() => setEmojiOpen((v) => !v)}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {emoji}
              </button>
              {emojiOpen && (
                <EmojiPicker
                  selected={emoji}
                  onSelect={setEmoji}
                  onClose={() => setEmojiOpen(false)}
                />
              )}
            </div>
            {isEdit ? 'Editar carpeta' : 'Nueva carpeta'}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Nombre del proyecto *</label>
            <input
              type="text"
              autoFocus
              placeholder="Ej. Botón de Pago"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Fecha de creación</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Descripción del proyecto</label>
            <textarea
              placeholder="Describe el proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={!canSubmit ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            {isEdit ? 'Guardar cambios' : 'Crear carpeta'}
          </button>
        </div>
      </div>
    </div>
  )
}
