import type { TeamMember } from '@/lib/types'
import styles from './AvatarGroup.module.css'

interface AvatarGroupProps {
  members: Pick<TeamMember, 'initials' | 'avatarColor' | 'name'>[]
  max?: number // por defecto 3; el resto se muestra como "+N"
}

export function AvatarGroup({ members, max = 3 }: AvatarGroupProps) {
  if (members.length === 0) return null

  const visible = members.slice(0, max)
  const overflow = members.length - visible.length

  return (
    <div className={styles.group}>
      {visible.map((m, i) => (
        <span
          key={`${m.initials}-${i}`}
          className={styles.avatar}
          style={{ background: m.avatarColor }}
          title={m.name}
          aria-label={m.name}
        >
          {m.initials}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={`${styles.avatar} ${styles.overflow}`}
          aria-label={`${overflow} más`}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
