'use client'

import type { LibraryCategory, ProtocolType } from '@/lib/types'
import { MOCK_LIBRARY_RESOURCES } from '@/lib/data/mockLibrary'
import { RESOURCE_TYPE_LABELS } from '@/components/library/ResourceCard'
import styles from './RelatedResources.module.css'

// Categoría de biblioteca sugerida según el tipo de protocolo.
const CATEGORY_BY_TYPE: Record<ProtocolType, LibraryCategory> = {
  express: 'usabilidad',
  complete: 'metodologia',
  ab: 'metodologia',
  presentation: 'investigacion',
}

export function RelatedResources({ type }: { type: ProtocolType }) {
  const category = CATEGORY_BY_TYPE[type]
  const resources = MOCK_LIBRARY_RESOURCES.filter(
    (r) => r.category === category
  ).slice(0, 2)

  if (resources.length === 0) return null

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>
        📚 Recursos recomendados para este protocolo
      </h3>
      <hr className={styles.divider} />
      <div className={styles.grid}>
        {resources.map((r) => (
          <a
            key={r.id}
            className={styles.card}
            href={r.url || undefined}
            target={r.url ? '_blank' : undefined}
            rel="noopener noreferrer"
          >
            <span className={styles.emoji} aria-hidden="true">
              {r.thumbnailEmoji}
            </span>
            <div className={styles.body}>
              <span className={styles.cardTitle}>{r.title}</span>
              <span className={styles.meta}>
                <span className={styles.typeBadge}>
                  {RESOURCE_TYPE_LABELS[r.type]}
                </span>
                {r.readTime && (
                  <span className={styles.readTime}>{r.readTime}</span>
                )}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
