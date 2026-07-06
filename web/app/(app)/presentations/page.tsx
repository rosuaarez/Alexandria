'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { EmptyState } from '@/components/ui'
import { timeAgo } from '@/lib/utils/date'

export default function PresentationsPage() {
  const router = useRouter()
  const protocols = useProtocolStore((s) => s.protocols)

  // Solo protocolos de tipo presentación (fiel a la sección "Presentaciones" del original).
  const presentations = useMemo(
    () =>
      protocols
        .filter((p) => p.type === 'presentation')
        .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')),
    [protocols]
  )

  return (
    <div className="page-transition" id="view-presentations">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)' }}>
        Presentaciones
      </h1>
      <p style={{ color: 'var(--text-3)', fontSize: 14, margin: '6px 0 24px' }}>
        Genera slides de resultados de investigación a partir de tus protocolos.
      </p>

      {presentations.length === 0 ? (
        <EmptyState
          emoji="🎯"
          title="Aún no hay presentaciones"
          description="Crea un protocolo de tipo Presentación para generar slides de resultados."
        />
      ) : (
        <div className="proto-list">
          {presentations.map((p) => (
            <div
              key={p.id}
              className="proto-item"
              onClick={() => router.push(`/protocols/${p.id}/edit`)}
            >
              <div className={`proto-item-icon ${p.type}`}>{p.icon || '🎯'}</div>
              <div className="proto-item-body">
                <div className="proto-item-name">{p.name}</div>
                <div className="proto-item-meta">
                  Presentación
                  {' · '}
                  {timeAgo(p.updatedAt)}
                  <StatusPill status={p.protoStatus} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
