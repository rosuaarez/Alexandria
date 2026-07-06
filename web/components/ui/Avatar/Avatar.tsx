import styles from './Avatar.module.css'

interface AvatarProps {
  initials: string
  color?: string // hex; por defecto var(--accent)
  size?: 'sm' | 'md' | 'lg' // 28px / 36px / 48px
  name?: string // tooltip en hover
}

export function Avatar({ initials, color, size = 'md', name }: AvatarProps) {
  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background: color ?? 'var(--accent)' }}
      title={name}
      aria-label={name ?? initials}
    >
      {initials}
    </span>
  )
}
