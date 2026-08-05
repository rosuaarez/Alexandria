'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useTeamStore } from '@/lib/stores/useTeamStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { CreateProtocolModal } from '@/components/protocols/CreateProtocolModal'
import { ServiceStatus } from '@/components/dashboard/ServiceStatus'
import { timeAgo } from '@/lib/utils/date'

// Trunca un fragmento largo con "…".
function truncate(value: string, max = 40): string {
  const s = value.trim()
  return s.length > max ? `${s.slice(0, max)}…` : s
}

// Pasos del workflow — fiel a la pipeline del HTML original.
const WF_STEPS: { key: string; icon: string; label: string }[] = [
  { key: 'draft', icon: '✏️', label: 'Borrador' },
  { key: 'in-review', icon: '👀', label: 'En Revisión' },
  { key: 'approved', icon: '✅', label: 'Aprobado' },
  { key: 'ready', icon: '🚀', label: 'Listo para ejecutar' },
  { key: 'completed', icon: '🏁', label: 'Completado' },
]

export default function DashboardPage() {
  const router = useRouter()
  const protocols = useProtocolStore((s) => s.protocols)
  const comments = useTeamStore((s) => s.comments)
  const deleteComment = useTeamStore((s) => s.deleteComment)
  const currentUser = useAuthStore((s) => s.currentUser)
  const [createOpen, setCreateOpen] = useState(false)

  // Todos los comentarios de cualquier protocolo, del más reciente al más antiguo.
  const recentComments = useMemo(
    () =>
      [...comments]
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        .slice(0, 20),
    [comments]
  )

  const firstName = (currentUser?.name ?? 'Ana').split(' ')[0]

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of protocols) c[p.protoStatus] = (c[p.protoStatus] ?? 0) + 1
    return c
  }, [protocols])

  return (
    <div className="page-transition" id="view-dashboard">
      {/* ── Hero fiel al original: búho + silueta ── */}
      <div className="dash-hero-wrapper">
        <div className="dash-hero">
          <div className="dash-hero-owl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dash/owl.webp" alt="Alexandria owl" />
          </div>
          <div className="dash-hero-content">
            <h1>
              Hola, {firstName} <span aria-hidden="true">👋</span>
            </h1>
            <p>
              Tu espacio de trabajo para protocolos
              <br />
              de investigación UX.
            </p>
            <button
              type="button"
              className="dash-create-btn"
              onClick={() => setCreateOpen(true)}
            >
              + Crear nuevo protocolo
            </button>
          </div>
          <div className="dash-hero-bust">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dash/bust.webp" alt="" />
          </div>
        </div>
      </div>

      {/* ── Workflow pipeline — stepper de estados ── */}
      {/* El estado con count > 0 se resalta (has-items → púrpura/bold, fiel al original). */}
      <div className="wf-pipeline">
        {WF_STEPS.map((step) => {
          const count = counts[step.key] ?? 0
          return (
            <div
              key={step.key}
              className={`wf-step${count > 0 ? ' has-items' : ''}`}
              data-wf={step.key}
              title={step.label}
            >
              <div className="wf-step-icon">{step.icon}</div>
              <div className="wf-step-count">{count}</div>
              <div className="wf-step-label">{step.label}</div>
            </div>
          )
        })}
      </div>

      <ServiceStatus />

      {/* ── Comentarios recientes de tus protocolos (feed fiel al original) ── */}
      <h2 className="section-heading" style={{ marginTop: 28 }}>
        Comentarios recientes <span>de tus protocolos</span>
      </h2>
      <div className="dash-comments-feed">
        {recentComments.length === 0 ? (
          <div className="dash-comments-empty">Sin comentarios aún</div>
        ) : (
          recentComments.map((c) => {
            const proto = protocols.find((p) => p.id === c.protocolId)
            const frag = truncate(c.quote?.trim() || c.fieldLabel || 'Comentario')
            return (
              <div key={c.id} className="dash-comment-item" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                  <div
                    className="comment-avatar-sm"
                    style={{
                      width: 28,
                      height: 28,
                      fontSize: 11,
                      flexShrink: 0,
                      marginTop: 2,
                      background: c.author.avatarColor,
                    }}
                    aria-hidden="true"
                  >
                    {c.author.initials}
                  </div>
                  <div className="dash-comment-body">
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                        {c.author.name}
                      </span>
                      <span className="comment-loc-tag">📍 &ldquo;{frag}&rdquo;</span>
                    </div>
                    <div className="dash-comment-text">{c.text}</div>
                    <div
                      className="dash-comment-meta"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                    >
                      {proto && <StatusPill status={proto.protoStatus} size="sm" />}
                      {proto ? (
                        <span
                          onClick={() => router.push(`/protocols/${proto.id}`)}
                          style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }}
                        >
                          · {proto.name}
                        </span>
                      ) : (
                        <span>· Protocolo eliminado</span>
                      )}
                      <span>· {timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    void deleteComment(c.id)
                  }}
                  title="Eliminar comentario"
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: 5,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-4)',
                    fontSize: 12,
                    display: 'grid',
                    placeItems: 'center',
                    marginTop: 2,
                  }}
                >
                  🗑
                </button>
              </div>
            )
          })
        )}
      </div>

      <CreateProtocolModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
