'use client'

import { useEffect, useRef, useState } from 'react'
import type { TeamMember, TeamRole } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import {
  ROLE_CLASS,
  ROLE_LABELS,
  STATUS_CLASS,
  STATUS_LABELS,
} from '@/lib/data/teamMeta'
import styles from './MemberRow.module.css'

const ALL_ROLES: TeamRole[] = ['leader', 'researcher', 'stakeholder']

interface MemberRowProps {
  member: TeamMember
  isCurrentUser: boolean
  onChangeRole: (role: TeamRole) => void
  onRemove: () => void
  onSelect?: () => void
}

export function MemberRow({
  member,
  isCurrentUser,
  onChangeRole,
  onRemove,
  onSelect,
}: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [changingRole, setChangingRole] = useState(false)
  const menuRef = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setChangingRole(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setChangingRole(false)
  }

  return (
    <tr className={styles.row}>
      <td className={styles.avatarCell}>
        <Avatar
          initials={member.initials}
          color={member.avatarColor}
          name={member.name}
          size="md"
        />
      </td>
      <td className={styles.nameCell}>
        <button
          type="button"
          className={styles.name}
          onClick={onSelect}
          title="Ver estadísticas"
        >
          {member.name}
          {isCurrentUser && <span className={styles.you}> (tú)</span>}
        </button>
      </td>
      <td className={styles.emailCell}>{member.email}</td>
      <td>
        <span className={`${styles.roleBadge} ${styles[ROLE_CLASS[member.role]]}`}>
          {ROLE_LABELS[member.role]}
        </span>
      </td>
      <td className={styles.countCell}>{member.protocolsCount}</td>
      <td>
        <span className={styles.status}>
          <span className={`${styles.dot} ${styles[STATUS_CLASS[member.status]]}`} />
          {STATUS_LABELS[member.status]}
        </span>
      </td>
      <td className={styles.actionsCell} ref={menuRef}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Acciones"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ⋯
        </button>
        {menuOpen && (
          <div className={styles.dropdown} role="menu">
            {changingRole ? (
              <>
                <span className={styles.dropdownLabel}>Asignar rol</span>
                {ALL_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`${styles.menuItem} ${member.role === r ? styles.menuItemActive : ''}`}
                    onClick={() => {
                      onChangeRole(r)
                      closeMenu()
                    }}
                  >
                    {ROLE_LABELS[r]}
                    {member.role === r && <span className={styles.check}>✓</span>}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => setChangingRole(true)}
                >
                  Cambiar rol
                </button>
                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.danger}`}
                  disabled={isCurrentUser}
                  title={
                    isCurrentUser
                      ? 'No puedes eliminarte del equipo'
                      : undefined
                  }
                  onClick={() => {
                    closeMenu()
                    onRemove()
                  }}
                >
                  Eliminar del equipo
                </button>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}
