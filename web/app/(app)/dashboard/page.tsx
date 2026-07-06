'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { CreateProtocolModal } from '@/components/protocols/CreateProtocolModal'
import { ServiceStatus } from '@/components/dashboard/ServiceStatus'
import type { ProtocolType } from '@/lib/types'
import { timeAgo } from '@/lib/utils/date'

const TYPE_ICON: Record<ProtocolType, string> = {
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
  const currentUser = useAuthStore((s) => s.currentUser)
  const [createOpen, setCreateOpen] = useState(false)

  const firstName = (currentUser?.name ?? 'Ana').split(' ')[0]

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
      <div className="wf-pipeline">
        {WF_STEPS.map((step) => (
          <div
            key={step.key}
            className="wf-step"
            data-wf={step.key}
            title={step.label}
          >
            <div className="wf-step-icon">{step.icon}</div>
            <div className="wf-step-count">{counts[step.key] ?? 0}</div>
            <div className="wf-step-label">{step.label}</div>
          </div>
        ))}
      </div>

      <ServiceStatus />

      {/* ── Protocolos recientes ── */}
      <h2 className="section-heading" style={{ marginTop: 28 }}>
        Protocolos recientes <span>de tu espacio</span>
      </h2>
      {loading ? (
        <div className="proto-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="proto-item" style={{ opacity: 0.5 }} />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
          Aún no tienes protocolos. Crea el primero para empezar.
        </p>
      ) : (
        <div className="proto-list">
          {recent.map((p) => (
            <div
              key={p.id}
              className="proto-item"
              onClick={() => router.push(`/protocols/${p.id}/edit`)}
            >
              <div className={`proto-item-icon ${p.type}`}>
                {p.icon || TYPE_ICON[p.type] || '📄'}
              </div>
              <div className="proto-item-body">
                <div className="proto-item-name">{p.name}</div>
                <div className="proto-item-meta">
                  {TYPE_LABEL[p.type] ?? p.type}
                  {' · '}
                  {timeAgo(p.updatedAt)}
                  <StatusPill status={p.protoStatus} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProtocolModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
