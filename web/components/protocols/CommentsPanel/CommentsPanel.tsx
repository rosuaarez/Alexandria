'use client'

import { useEffect, useState } from 'react'
import type { ProtocolComment } from '@/lib/types'
import { useTeamStore, CURRENT_TEAM_MEMBER } from '@/lib/stores/useTeamStore'
import { Avatar } from '@/components/ui/Avatar'
import { timeAgo } from '@/lib/utils/date'
import styles from './CommentsPanel.module.css'

interface CommentsPanelProps {
  protocolId: string
}

export function CommentsPanel({ protocolId }: CommentsPanelProps) {
  const panel = useTeamStore((s) => s.commentsPanel)
  const comments = useTeamStore((s) => s.comments)
  const closeComments = useTeamStore((s) => s.closeComments)
  const addComment = useTeamStore((s) => s.addComment)
  const resolveComment = useTeamStore((s) => s.resolveComment)

  const [draft, setDraft] = useState('')

  // Cerrar con Escape.
  useEffect(() => {
    if (!panel.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeComments()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [panel.open, closeComments])

  if (!panel.open) return null

  // fieldKey null = mostrar todos los comentarios del protocolo.
  const visible: ProtocolComment[] = panel.fieldKey
    ? comments.filter((c) => c.fieldKey === panel.fieldKey)
    : comments

  // Solo se puede componer cuando hay un campo concreto seleccionado.
  const canCompose = panel.fieldKey !== null

  const handleSubmit = () => {
    const text = draft.trim()
    if (!text || !panel.fieldKey) return
    void addComment({
      protocolId,
      fieldKey: panel.fieldKey,
      fieldLabel: panel.fieldLabel,
      author: CURRENT_TEAM_MEMBER,
      text,
      resolved: false,
      replies: [],
    })
    setDraft('')
  }

  return (
    <aside className={styles.panel} aria-label="Comentarios">
      <header className={styles.header}>
        <span className={styles.title}>
          <span aria-hidden>💬</span> {panel.fieldLabel}
        </span>
        <button
          type="button"
          className={styles.close}
          aria-label="Cerrar comentarios"
          onClick={closeComments}
        >
          ×
        </button>
      </header>

      <div className={styles.list}>
        {visible.length === 0 ? (
          <p className={styles.empty}>Aún no hay comentarios en este campo.</p>
        ) : (
          visible.map((c) => (
            <article
              key={c.id}
              className={`${styles.comment} ${c.resolved ? styles.resolved : ''}`}
            >
              <div className={styles.commentHead}>
                <Avatar
                  initials={c.author.initials}
                  color={c.author.avatarColor}
                  name={c.author.name}
                  size="sm"
                />
                <div className={styles.meta}>
                  <span className={styles.author}>{c.author.name}</span>
                  <span className={styles.time}>{timeAgo(c.createdAt)}</span>
                </div>
              </div>

              {!panel.fieldKey && (
                <span className={styles.fieldTag}>{c.fieldLabel}</span>
              )}

              <p className={styles.text}>{c.text}</p>

              {c.replies.map((r) => (
                <div key={r.id} className={styles.reply}>
                  <div className={styles.commentHead}>
                    <Avatar
                      initials={r.author.initials}
                      color={r.author.avatarColor}
                      name={r.author.name}
                      size="sm"
                    />
                    <div className={styles.meta}>
                      <span className={styles.author}>
                        {r.author.name}
                        {r.author.id === CURRENT_TEAM_MEMBER.id && (
                          <span className={styles.you}> (tú)</span>
                        )}
                      </span>
                      <span className={styles.time}>{timeAgo(r.createdAt)}</span>
                    </div>
                  </div>
                  <p className={styles.text}>{r.text}</p>
                </div>
              ))}

              <button
                type="button"
                className={styles.resolveBtn}
                onClick={() => void resolveComment(c.id)}
              >
                {c.resolved ? 'Reabrir' : 'Resolver ✓'}
              </button>
            </article>
          ))
        )}
      </div>

      {canCompose && (
        <footer className={styles.composer}>
          <Avatar
            initials={CURRENT_TEAM_MEMBER.initials}
            color={CURRENT_TEAM_MEMBER.avatarColor}
            name={CURRENT_TEAM_MEMBER.name}
            size="sm"
          />
          <input
            className={styles.input}
            placeholder="Escribe un comentario…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          <button
            type="button"
            className={styles.send}
            onClick={handleSubmit}
            disabled={!draft.trim()}
          >
            Comentar →
          </button>
        </footer>
      )}
    </aside>
  )
}
