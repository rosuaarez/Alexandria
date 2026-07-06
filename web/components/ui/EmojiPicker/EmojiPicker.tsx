'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

const PICKER_WIDTH = 280
const PICKER_MAX_HEIGHT = 280
const GAP = 8
const MARGIN = 8

interface EmojiPickerProps {
  selected: string
  onSelect: (emoji: string) => void
  onClose: () => void
  // Elemento disparador (ícono). Se usa para anclar el picker con su rect.
  anchor: HTMLElement | null
}

export function EmojiPicker({ selected, onSelect, onClose, anchor }: EmojiPickerProps) {
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Calcula la posición fija a partir del rect del disparador, con flips si se
  // sale por la derecha o por abajo del viewport.
  useLayoutEffect(() => {
    const compute = () => {
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      const width = ref.current?.offsetWidth || PICKER_WIDTH
      const height = ref.current?.offsetHeight || PICKER_MAX_HEIGHT

      let left = rect.left
      let top = rect.bottom + GAP
      if (left + width > window.innerWidth - MARGIN) left = rect.right - width
      if (left < MARGIN) left = MARGIN
      if (top + height > window.innerHeight - MARGIN) top = rect.top - height - GAP
      if (top < MARGIN) top = MARGIN

      setPos({ top, left })
    }

    compute()
    window.addEventListener('scroll', compute, true)
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute, true)
      window.removeEventListener('resize', compute)
    }
  }, [anchor])

  // Click fuera (ignorando el disparador) y Escape cierran el picker.
  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (ref.current?.contains(target)) return
      if (anchor?.contains(target)) return
      onClose()
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
  }, [anchor, onClose])

  if (typeof document === 'undefined') return null

  const q = query.trim()
  const emojis = q ? FOLDER_EMOJIS.filter((e) => e.includes(q)) : FOLDER_EMOJIS

  return createPortal(
    <div
      ref={ref}
      className={styles.picker}
      role="dialog"
      aria-label="Seleccionar emoji"
      style={{
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        visibility: pos ? 'visible' : 'hidden',
      }}
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
    </div>,
    document.body
  )
}
