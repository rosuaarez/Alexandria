'use client'

import { useMemo, useState } from 'react'
import type { Protocol, ProtocolStatus } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { ProtocolCard } from '@/components/protocols/ProtocolCard'
import { CreateProtocolModal } from '@/components/protocols/CreateProtocolModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import styles from './protocols.module.css'

type Filter = 'all' | 'draft' | 'activo' | 'onhold' | 'finalizado' | 'cerrado'

// Pills de filtro con punto de color por estado (fiel al original).
const FILTERS: { value: Filter; label: string; dot?: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'draft', label: 'Draft', dot: '#9CA3AF' },
  { value: 'activo', label: 'Activo', dot: '#10B981' },
  { value: 'onhold', label: 'On Hold', dot: '#F59E0B' },
  { value: 'finalizado', label: 'Finalizado', dot: '#3B82F6' },
  { value: 'cerrado', label: 'Cerrado', dot: '#6B7280' },
]

// Cada filtro agrupa uno o varios estados internos.
const STATUS_GROUPS: Record<Exclude<Filter, 'all'>, ProtocolStatus[]> = {
  draft: ['draft'],
  activo: ['activo', 'approved', 'ready'],
  onhold: ['onhold'],
  finalizado: ['finalizado', 'completed'],
  cerrado: ['cerrado'],
}

export default function ProtocolsPage() {
  const protocols = useProtocolStore((s) => s.protocols)
  const loading = useProtocolStore((s) => s.loading)
  const deleteProtocol = useProtocolStore((s) => s.deleteProtocol)

  const [filter, setFilter] = useState<Filter>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Protocol | null>(null)

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? protocols
        : protocols.filter((p) => STATUS_GROUPS[filter].includes(p.protoStatus)),
    [protocols, filter]
  )

  return (
    <div className="page-transition" id="view-my-protocols">
      <div
        className="section-heading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)' }}>
          Mis Protocolos
        </h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo protocolo
        </button>
      </div>

      <div className={styles.filters} role="tablist">
        <span className={styles.filterLabel}>Filtrar:</span>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            className={`${styles.pill} ${filter === f.value ? styles.pillActive : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.dot && (
              <span className={styles.pillDot} style={{ background: f.dot }} />
            )}
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📋</span>
          <p className={styles.emptyText}>
            {protocols.length === 0
              ? 'Aún no tienes protocolos.'
              : 'No hay protocolos con este filtro.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCreateOpen(true)}
          >
            + Crear protocolo
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <ProtocolCard
              key={p.id}
              protocol={p}
              onRequestDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <CreateProtocolModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />

      <DeleteModal
        isOpen={deleteTarget !== null}
        protocolName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteProtocol(deleteTarget)
        }}
      />
    </div>
  )
}
