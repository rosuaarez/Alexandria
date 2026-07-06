'use client'

import { useEffect, useState, type ReactNode, type UIEvent } from 'react'
import type { Capsula } from '@/lib/types'
import {
  CAPSULA_CATEGORY_CLASS,
  CAPSULA_CATEGORY_LABELS,
  PROTOCOL_TYPE_META,
} from '@/lib/data/capsulaMeta'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'
import styles from './CapsulaModal.module.css'

interface CapsulaModalProps {
  capsula: Capsula | null
  onClose: () => void
  onToggleFavorite: (id: string) => void
}

// Resalta **negritas** en una línea de texto, sin librerías de markdown.
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// Parser markdown simple: ##, **, listas con "-", citas con ">" y párrafos.
function renderMarkdown(content: string): ReactNode[] {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let list: string[] = []
  let key = 0

  const flushList = () => {
    if (list.length === 0) return
    const items = list
    blocks.push(
      <ul key={`ul-${key++}`} className={styles.list}>
        {items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    )
    list = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') {
      flushList()
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      blocks.push(
        <h2 key={`h-${key++}`} className={styles.h2}>
          {renderInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('- ')) {
      list.push(line.slice(2))
    } else if (line.startsWith('> ')) {
      flushList()
      blocks.push(
        <blockquote key={`q-${key++}`} className={styles.quote}>
          {renderInline(line.slice(2))}
        </blockquote>
      )
    } else {
      flushList()
      blocks.push(
        <p key={`p-${key++}`} className={styles.paragraph}>
          {renderInline(line)}
        </p>
      )
    }
  }
  flushList()
  return blocks
}

export function CapsulaModal({ capsula, onClose, onToggleFavorite }: CapsulaModalProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(!!capsula)

  useEffect(() => {
    if (!capsula) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [capsula, onClose])

  if (!capsula) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={trapRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={capsula.title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* key={capsula.id} remonta el lector en cada cápsula → progreso a 0 */}
        <CapsulaReader
          key={capsula.id}
          capsula={capsula}
          onClose={onClose}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  )
}

// Cuerpo desplazable de la cápsula con barra de progreso de lectura.
function CapsulaReader({ capsula, onClose, onToggleFavorite }: CapsulaModalProps & { capsula: Capsula }) {
  const [progress, setProgress] = useState(0)

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const max = el.scrollHeight - el.clientHeight
    setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
  }

  return (
    <>
      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.scroller} onScroll={handleScroll}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.emoji} aria-hidden>
              {capsula.emoji}
            </span>
            <div>
              <h1 className={styles.title}>{capsula.title}</h1>
              <p className={styles.subtitle}>
                {capsula.author} · {capsula.readTime} ·{' '}
                <span
                  className={`${styles.badge} ${styles[`cat_${CAPSULA_CATEGORY_CLASS[capsula.category]}`]}`}
                >
                  {CAPSULA_CATEGORY_LABELS[capsula.category]}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.content}>{renderMarkdown(capsula.content)}</div>

        <footer className={styles.footer}>
          {capsula.relatedProtocolTypes && capsula.relatedProtocolTypes.length > 0 && (
            <div className={styles.related}>
              <span className={styles.relatedLabel}>Relacionado con:</span>
              {capsula.relatedProtocolTypes.map((t) => (
                <span key={t} className={styles.relatedPill}>
                  {PROTOCOL_TYPE_META[t].emoji} {PROTOCOL_TYPE_META[t].label}
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            className={`${styles.save} ${capsula.isFavorite ? styles.saveActive : ''}`}
            onClick={() => onToggleFavorite(capsula.id)}
          >
            {capsula.isFavorite ? '♥ Guardada' : '♡ Guardar'}
          </button>
        </footer>
      </div>
    </>
  )
}
