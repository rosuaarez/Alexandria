'use client'

import styles from './EmptyState.module.css'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.emoji} aria-hidden>
        {emoji}
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {action && (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
