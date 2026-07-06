'use client'

import type { LibraryResource, LibraryResourceType } from '@/lib/types'
import styles from './ResourceCard.module.css'

export const RESOURCE_TYPE_LABELS: Record<LibraryResourceType, string> = {
  article: 'Artículo',
  video: 'Video',
  template: 'Template',
  guide: 'Guía',
  tool: 'Herramienta',
  book: 'Libro',
}

interface ResourceCardProps {
  resource: LibraryResource
  onToggleFavorite: (id: string) => void
}

export function ResourceCard({ resource, onToggleFavorite }: ResourceCardProps) {
  const handleOpen = () => {
    if (resource.url) window.open(resource.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className={styles.card}>
      {resource.isNew && <span className={styles.newBadge}>Nuevo</span>}

      <div className={styles.top}>
        <span className={styles.emoji} aria-hidden>
          {resource.thumbnailEmoji}
        </span>
        <span className={styles.typeBadge}>{RESOURCE_TYPE_LABELS[resource.type]}</span>
        <button
          type="button"
          className={`${styles.fav} ${resource.isFavorite ? styles.favActive : ''}`}
          onClick={() => onToggleFavorite(resource.id)}
          aria-pressed={resource.isFavorite}
          aria-label={
            resource.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
          }
        >
          {resource.isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <h3 className={styles.title}>{resource.title}</h3>
      <p className={styles.description}>{resource.description}</p>

      <div className={styles.tags}>
        {resource.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <footer className={styles.footer}>
        <span className={styles.meta}>
          {resource.author && <span>{resource.author}</span>}
          {resource.author && resource.readTime && <span> · </span>}
          {resource.readTime && <span>{resource.readTime}</span>}
        </span>
        <button
          type="button"
          className={styles.view}
          onClick={handleOpen}
          disabled={!resource.url}
        >
          Ver →
        </button>
      </footer>
    </article>
  )
}
