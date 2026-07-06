'use client'

import { useTeamStore } from '@/lib/stores/useTeamStore'
import styles from './FieldCommentIndicator.module.css'

interface FieldCommentIndicatorProps {
  fieldKey: string
  fieldLabel: string
}

// Indicador [💬 N] que aparece junto a un campo del formulario cuando tiene
// comentarios. Al hacer click abre el CommentsPanel filtrado por ese campo.
export function FieldCommentIndicator({
  fieldKey,
  fieldLabel,
}: FieldCommentIndicatorProps) {
  const comments = useTeamStore((s) => s.comments)
  const openFieldComments = useTeamStore((s) => s.openFieldComments)

  const fieldComments = comments.filter((c) => c.fieldKey === fieldKey)
  if (fieldComments.length === 0) return null

  const hasUnresolved = fieldComments.some((c) => !c.resolved)

  return (
    <button
      type="button"
      className={`${styles.indicator} ${hasUnresolved ? styles.unresolved : ''}`}
      onClick={() => openFieldComments(fieldKey, fieldLabel)}
      title={`${fieldComments.length} comentario(s) en "${fieldLabel}"`}
    >
      <span aria-hidden>💬</span>
      {fieldComments.length}
    </button>
  )
}
