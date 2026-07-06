'use client'

import styles from './ReviewBanner.module.css'

interface ReviewBannerProps {
  commentCount: number
  onViewComments: () => void
  onApprove: () => void
}

export function ReviewBanner({
  commentCount,
  onViewComments,
  onApprove,
}: ReviewBannerProps) {
  return (
    <div className={styles.banner}>
      <span className={styles.text}>
        <span aria-hidden>👥</span> Este protocolo está en revisión
        {commentCount > 0 && (
          <>
            {' · '}
            {commentCount} {commentCount === 1 ? 'comentario' : 'comentarios'}
          </>
        )}
      </span>
      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={onViewComments}>
          Ver comentarios
        </button>
        <button type="button" className={styles.primary} onClick={onApprove}>
          Marcar como aprobado →
        </button>
      </div>
    </div>
  )
}
