'use client'

import type { Capsula } from '@/lib/types'
import { CAPSULA_CATEGORY_CLASS, CAPSULA_CATEGORY_LABELS } from '@/lib/data/capsulaMeta'
import styles from './CapsulaCard.module.css'

interface CapsulaCardProps {
  capsula: Capsula
  onOpen: (capsula: Capsula) => void
  onToggleFavorite: (id: string) => void
}

export function CapsulaCard({ capsula, onOpen, onToggleFavorite }: CapsulaCardProps) {
  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(capsula.id)
  }

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(capsula)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(capsula)
        }
      }}
    >
      <div className={styles.top}>
        <span className={styles.emoji} aria-hidden>
          {capsula.emoji}
        </span>
        <div className={styles.topRight}>
          <button
            type="button"
            className={`${styles.fav} ${capsula.isFavorite ? styles.favActive : ''}`}
            onClick={handleFav}
            aria-pressed={capsula.isFavorite}
            aria-label={
              capsula.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
            }
          >
            {capsula.isFavorite ? '♥' : '♡'}
          </button>
          <span
            className={`${styles.badge} ${styles[`cat_${CAPSULA_CATEGORY_CLASS[capsula.category]}`]}`}
          >
            {CAPSULA_CATEGORY_LABELS[capsula.category]}
          </span>
        </div>
      </div>

      <h3 className={styles.title}>{capsula.title}</h3>
      <p className={styles.description}>{capsula.description}</p>

      <div className={styles.tags}>
        {capsula.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <footer className={styles.footer}>
        {capsula.author} · {capsula.readTime}
      </footer>
    </article>
  )
}
