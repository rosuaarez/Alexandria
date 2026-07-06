'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './EmojiPicker.module.css'

// Emojis disponibles para el ícono de carpeta (fieles al original).
export const FOLDER_EMOJIS = [
  '📋', '⚡', '🎨', '🧪', '🔬', '📊', '📌',
  '🚀', '✅', '🔒', '🧩', '💡', '🎯', '🔍',
  '📝', '💬', '🔗', '📣', '🏆', '💼', '🔧',
  '⚙️', '⭐', '🎤', '📱', '💻', '🖥️', '📡',
  '🛡️', '🧠', '🎭', '🗺️', '📐', '🔑', '🌀',
  '📁', '🗂️', '📂', '🗃️', '📦', '🗄️', '📥',
]

interface EmojiPickerProps {
  selected: string
  onSelect: (emoji: string) => void
  onClose: () => void
}

export function EmojiPicker({ selected, onSelect, onClose }: EmojiPickerProps) {
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Click fuera y Escape cierran el picker.
  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const q = query.trim()
  const emojis = q ? FOLDER_EMOJIS.filter((e) => e.includes(q)) : FOLDER_EMOJIS

  return (
    <div
      ref={ref}
      className={styles.picker}
      role="dialog"
      aria-label="Seleccionar emoji"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        className={styles.search}
        type="text"
        autoFocus
        placeholder="Buscar emoji..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {emojis.length === 0 ? (
        <div className={styles.empty}>Sin resultados</div>
      ) : (
        <div className={styles.grid}>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`${styles.cell} ${emoji === selected ? styles.cellActive : ''}`}
              onClick={() => {
                onSelect(emoji)
                onClose()
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
