'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { CreateProtocolModal } from '@/components/protocols/CreateProtocolModal'
import { ServiceStatus } from '@/components/dashboard/ServiceStatus'
import { timeAgo } from '@/lib/utils/date'

// Slug del nombre del protocolo para la meta de cada fila (minúsculas, guiones).
function slugify(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
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
  const loading = useProtocolStore((s) => s.loading)
  const deleteProtocol = useProtocolStore((s) => s.deleteProtocol)
  const currentUser = useAuthStore((s) => s.currentUser)
  const [createOpen, setCreateOpen] = useState(false)

  const firstName = (currentUser?.name ?? 'Ana').split(' ')[0]
  const userInitials = currentUser?.initials ?? (currentUser?.name ?? 'A')[0]
  const userName = currentUser?.name ?? 'Ana Martínez'

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of protocols) c[p.protoStatus] = (c[p.protoStatus] ?? 0) + 1
    return c
  }, [protocols])

  const recent = useMemo(
    () =>
      [...protocols]
        .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
        .slice(0, 5),
    [protocols]
  )

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
        {loading ? (
          <div className="dash-comments-empty">Cargando…</div>
        ) : recent.length === 0 ? (
          <div className="dash-comments-empty">Sin comentarios aún</div>
        ) : (
          recent.map((p) => (
            <div key={p.id} className="dash-comment-item" style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  flex: 1,
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/protocols/${p.id}/edit`)}
              >
                <div
                  className="comment-avatar-sm"
                  style={{ width: 28, height: 28, fontSize: 11, flexShrink: 0, marginTop: 2 }}
                  aria-hidden="true"
                >
                  {userInitials}
                </div>
                <div className="dash-comment-body">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
                  >
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{userName}</span>
                    <span className="comment-loc-tag">
                      📍 {p.proyecto || 'Sin proyecto'}
                    </span>
                  </div>
                  <div className="dash-comment-text">{p.name}</div>
                  <div
                    className="dash-comment-meta"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                  >
                    <StatusPill status={p.protoStatus} size="sm" />
                    <span>· {slugify(p.name)}</span>
                    <span>· {timeAgo(p.updatedAt)}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  void deleteProtocol(p)
                }}
                title="Eliminar protocolo"
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
          ))
        )}
      </div>

      <CreateProtocolModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
