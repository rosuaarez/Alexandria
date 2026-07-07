'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Protocol, ProtocolStatus, ProtocolType } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useFolderStore } from '@/lib/stores/useFolderStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { StatusPill } from '@/components/ui/StatusPill'
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

// Nombre legible del template (fiel al header del editor).
const TEMPLATE_LABEL: Record<string, string> = {
  usabilidad: 'Prueba de Usabilidad',
  ab: 'A/B Testing',
  entrevistas: 'Entrevistas',
  cardsorting: 'Card Sorting',
  treetesting: 'Tree Testing',
  encuestas: 'Encuestas',
}

// Color del borde izquierdo de la card según el estado.
const STATUS_BORDER: Record<ProtocolStatus, string> = {
  draft: '#9CA3AF',
  'in-review': '#F59E0B',
  approved: '#10B981',
  ready: '#8B5CF6',
  completed: '#3B82F6',
  activo: '#10B981',
  finalizado: '#3B82F6',
  onhold: '#F59E0B',
  cerrado: '#6B7280',
  changes_requested: '#F59E0B',
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function DuplicateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
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
  const folders = useFolderStore((s) => s.folders)

  const [editingLink, setEditingLink] = useState(false)
  const [linkValue, setLinkValue] = useState(protocol.findingsLink ?? '')

  const icon = protocol.icon || DEFAULT_ICON[protocol.type] || '📄'
  const openEditor = () => router.push(`/protocols/${protocol.id}/edit`)

  const templateKey =
    protocol.template ||
    (typeof protocol.data?.template === 'string' ? protocol.data.template : '')
  const templateLabel = TEMPLATE_LABEL[templateKey] ?? TYPE_LABEL[protocol.type]

  const folder = protocol.folderId
    ? folders.find((f) => f.id === protocol.folderId)
    : undefined

  const handleDuplicate = () => {
    if (currentUser) void duplicateProtocol(protocol, currentUser.id)
  }

  const handleSaveLink = () => {
    void updateProtocol({ ...protocol, findingsLink: linkValue.trim() })
    setEditingLink(false)
  }

  return (
    <div
      className={styles.card}
      style={{ borderLeft: `3px solid ${STATUS_BORDER[protocol.protoStatus] ?? '#9CA3AF'}` }}
      onClick={openEditor}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') openEditor()
      }}
    >
      <div className={styles.top}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.name}>{protocol.name}</span>
        <StatusPill status={protocol.protoStatus} size="sm" />
      </div>

      <div className={styles.meta}>
        {templateLabel}
        {folder ? ` · 📂 ${folder.name}` : ''}
      </div>

      {protocol.generatedData && (
        <div>
          <span className={styles.genBadge}>+ Generado</span>
        </div>
      )}

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={openEditor}
          title="Editar"
          aria-label="Editar"
        >
          <EditIcon />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleDuplicate}
          title="Duplicar"
          aria-label="Duplicar"
        >
          <DuplicateIcon />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setEditingLink((v) => !v)}
          title="Link de hallazgos"
          aria-label="Link de hallazgos"
        >
          <LinkIcon />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onRequestDelete(protocol)}
          title="Eliminar"
          aria-label="Eliminar"
        >
          <TrashIcon />
        </button>
      </div>

      {editingLink && (
        <div className={styles.linkRow} onClick={(e) => e.stopPropagation()}>
          <input
            className={styles.linkInput}
            value={linkValue}
            placeholder="https://… (link de hallazgos)"
            autoFocus
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveLink()
            }}
          />
          <button type="button" className={styles.linkSave} onClick={handleSaveLink}>
            Guardar
          </button>
        </div>
      )}
    </div>
  )
}
