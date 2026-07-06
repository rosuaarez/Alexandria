'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProjectFolder } from '@/lib/types'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import { UNCATEGORIZED_ID } from '@/lib/stores/useFolderStore'

// Fecha corta es-MX (fiel al formato del original: "15 ene 2024").
function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface FolderCardProps {
  folder: ProjectFolder
  count: number
  onOpen: (id: string) => void
  onEdit: (folder: ProjectFolder) => void
  onDelete: (folder: ProjectFolder) => void
  onChangeEmoji: (id: string, emoji: string) => void
}

export function FolderCard({
  folder,
  count,
  onOpen,
  onEdit,
  onDelete,
  onChangeEmoji,
}: FolderCardProps) {
  const isUncategorized = folder.id === UNCATEGORIZED_ID
  const [menuOpen, setMenuOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  // Cierra el menú ⋯ al hacer click fuera de la tarjeta.
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [menuOpen])

  const countLabel = `${count} protocolo${count !== 1 ? 's' : ''}`
  const dateStr = formatDate(folder.createdAt)

  return (
    <div
      ref={cardRef}
      className="bib-folder-card"
      onClick={() => onOpen(folder.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(folder.id)
      }}
    >
      {!isUncategorized && (
        <>
          <button
            type="button"
            className="bib-folder-menu-btn"
            title="Opciones"
            aria-label="Opciones de carpeta"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
          >
            ⋮
          </button>
          <div className={`bib-folder-dropdown${menuOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="bib-folder-dropdown-item"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onEdit(folder)
              }}
            >
              ✏️ Editar carpeta
            </button>
            <div className="bib-folder-dropdown-sep" />
            <button
              type="button"
              className="bib-folder-dropdown-item danger"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onDelete(folder)
              }}
            >
              🗑️ Eliminar carpeta
            </button>
          </div>
        </>
      )}

      <div className="bib-folder-card-top">
        <div
          ref={iconRef}
          className="bib-folder-icon"
          title={isUncategorized ? undefined : 'Cambiar icono'}
          style={{ cursor: isUncategorized ? 'default' : 'pointer' }}
          onClick={(e) => {
            if (isUncategorized) return
            e.stopPropagation()
            setEmojiOpen((v) => !v)
          }}
        >
          {folder.emoji || '📁'}
        </div>
        {emojiOpen && !isUncategorized && (
          <EmojiPicker
            selected={folder.emoji}
            anchor={iconRef.current}
            onSelect={(emoji) => onChangeEmoji(folder.id, emoji)}
            onClose={() => setEmojiOpen(false)}
          />
        )}
        {isUncategorized && (
          <span className="bib-folder-status-pill activo">Sin carpeta</span>
        )}
      </div>

      <div className="bib-folder-name">{folder.name}</div>
      {folder.description && (
        <div className="bib-folder-desc">{folder.description}</div>
      )}

      <div className="bib-folder-footer">
        <span className="bib-folder-count">{countLabel}</span>
        {dateStr && <span className="bib-folder-date">{dateStr}</span>}
      </div>
    </div>
  )
}
