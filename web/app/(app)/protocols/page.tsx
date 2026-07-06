'use client'

import { useMemo, useState } from 'react'
import type { Protocol, ProtocolStatus } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { ProtocolCard } from '@/components/protocols/ProtocolCard'
import { CreateProtocolModal } from '@/components/protocols/CreateProtocolModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import styles from './protocols.module.css'

type Filter = 'all' | ProtocolStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'draft', label: 'Borrador' },
  { value: 'in-review', label: 'En revisión' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'ready', label: 'Listo' },
  { value: 'completed', label: 'Completado' },
]

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
        : protocols.filter((p) => p.protoStatus === filter),
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
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            className={`${styles.pill} ${filter === f.value ? styles.pillActive : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="proto-list">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="proto-item" style={{ opacity: 0.5 }} />
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
        <div className="proto-list">
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
