'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Protocol, ProtocolType } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { AvatarGroup } from '@/components/ui/AvatarGroup'
import { ShareModal } from '@/components/protocols/ShareModal'
import { sharedUsersToAvatars } from '@/lib/utils/avatar'
import { timeAgo } from '@/lib/utils/date'
import styles from './ProtocolCard.module.css'

const DEFAULT_ICON: Record<ProtocolType, string> = {
  express: '⚡',
  complete: '📋',
  presentation: '🎯',
  ab: '🔀',
}

const TYPE_LABEL: Record<ProtocolType, string> = {
  express: 'Express',
  complete: 'Completo',
  presentation: 'Presentación',
  ab: 'A/B',
}

interface ProtocolCardProps {
  protocol: Protocol
  onRequestDelete: (protocol: Protocol) => void
}

export function ProtocolCard({ protocol, onRequestDelete }: ProtocolCardProps) {
  const router = useRouter()
  const duplicateProtocol = useProtocolStore((s) => s.duplicateProtocol)
  const updateProtocol = useProtocolStore((s) => s.updateProtocol)
  const currentUser = useAuthStore((s) => s.currentUser)

  const [menuOpen, setMenuOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(false)
  const [linkValue, setLinkValue] = useState(protocol.findingsLink ?? '')
  const [shareOpen, setShareOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar el dropdown al hacer click fuera.
  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setEditingLink(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  const icon = protocol.icon || DEFAULT_ICON[protocol.type] || '📄'
  const openEditor = () => router.push(`/protocols/${protocol.id}/edit`)

  const platformLabel =
    protocol.platform === 'maze'
      ? 'Maze'
      : protocol.platform === 'forms'
        ? 'Google Forms'
        : null

  const handleDuplicate = () => {
    setMenuOpen(false)
    if (currentUser) duplicateProtocol(protocol, currentUser.id)
  }

  const handleSaveLink = () => {
    updateProtocol({ ...protocol, findingsLink: linkValue.trim() })
    setEditingLink(false)
    setMenuOpen(false)
  }

  return (
    <div className="proto-item" onClick={openEditor}>
      <div className={`proto-item-icon ${protocol.type}`}>{icon}</div>

      <div className="proto-item-body">
        <div className="proto-item-name">{protocol.name}</div>
        <div className="proto-item-meta">
          {TYPE_LABEL[protocol.type] ?? protocol.type}
          {platformLabel ? ` · ${platformLabel}` : ''}
          {protocol.folderId ? ` · 📁 ${protocol.folderId}` : ''}
          {' · '}
          {timeAgo(protocol.updatedAt)}
          <StatusPill status={protocol.protoStatus} size="sm" />
        </div>
      </div>

      <div className="proto-item-actions" onClick={(e) => e.stopPropagation()}>
        {protocol.sharedWith && protocol.sharedWith.length > 0 && (
          <AvatarGroup members={sharedUsersToAvatars(protocol.sharedWith)} />
        )}
        <button
          type="button"
          className="icon-btn"
          onClick={openEditor}
          title="Editar"
          aria-label="Editar"
        >
          ✏️
        </button>
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label="Acciones"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ⋯
          </button>
          {menuOpen && (
            <div className={styles.dropdown} role="menu">
              <button type="button" className={styles.menuItem} onClick={openEditor}>
                ✏️ Editar
              </button>
              <button
                type="button"
                className={styles.menuItem}
                onClick={handleDuplicate}
              >
                📋 Duplicar
              </button>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => {
                  setMenuOpen(false)
                  setShareOpen(true)
                }}
              >
                ↗ Compartir
              </button>
              {editingLink ? (
                <div className={styles.linkRow}>
                  <input
                    className={styles.linkInput}
                    value={linkValue}
                    placeholder="https://…"
                    autoFocus
                    onChange={(e) => setLinkValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveLink()
                    }}
                  />
                  <button
                    type="button"
                    className={styles.linkSave}
                    onClick={handleSaveLink}
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => setEditingLink(true)}
                >
                  🔗 Link de hallazgos
                </button>
              )}
              <button
                type="button"
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => {
                  setMenuOpen(false)
                  onRequestDelete(protocol)
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        protocol={protocol}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  )
}
