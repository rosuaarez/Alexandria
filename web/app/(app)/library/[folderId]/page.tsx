'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Protocol } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useFolderStore, UNCATEGORIZED_ID } from '@/lib/stores/useFolderStore'
import { ProtocolCard } from '@/components/protocols/ProtocolCard'
import { CreateProtocolModal } from '@/components/protocols/CreateProtocolModal'
import { DeleteModal } from '@/components/ui/DeleteModal'

export default function FolderDetailPage() {
  const router = useRouter()
  const params = useParams<{ folderId: string }>()
  const folderId = params.folderId

  const protocols = useProtocolStore((s) => s.protocols)
  const deleteProtocol = useProtocolStore((s) => s.deleteProtocol)
  const folders = useFolderStore((s) => s.folders)

  const isUncategorized = folderId === UNCATEGORIZED_ID
  const folder = folders.find((f) => f.id === folderId)

  const folderName = isUncategorized
    ? 'Protocolos sin carpeta'
    : folder?.name ?? 'Carpeta'
  const folderEmoji = isUncategorized ? '📂' : folder?.emoji ?? '📁'

  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Protocol | null>(null)

  const folderProtocols = useMemo(() => {
    const base = isUncategorized
      ? protocols.filter((p) => !p.folderId)
      : protocols.filter((p) => p.folderId === folderId)
    const q = search.trim().toLowerCase()
    return q ? base.filter((p) => p.name.toLowerCase().includes(q)) : base
  }, [protocols, folderId, isUncategorized, search])

  const count = folderProtocols.length
  const countLabel = `${count} protocolo${count !== 1 ? 's' : ''}`

  return (
    <div className="page-transition bib-folder-detail open">
      <div className="bib-folder-detail-header">
        <button
          type="button"
          className="bib-folder-detail-back"
          onClick={() => router.push('/library')}
        >
          ← Biblioteca
        </button>
        <div className="bib-folder-detail-icon">{folderEmoji}</div>
        <div className="bib-folder-detail-info">
          <div className="bib-folder-detail-name">{folderName}</div>
          <div className="bib-folder-detail-meta">{countLabel}</div>
        </div>
      </div>

      <div className="bib-toolbar">
        <div className="bib-search-wrap">
          <span className="bib-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="bib-search"
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="bib-create-btn"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          + Agregar protocolo
        </button>
      </div>

      {count === 0 ? (
        <div className="bib-empty">
          <div className="bib-empty-icon">📋</div>
          <h3>Aún no hay protocolos en esta carpeta</h3>
          <p>Crea el primer protocolo para empezar a organizar esta carpeta.</p>
          <button
            className="bib-create-btn"
            type="button"
            onClick={() => setCreateOpen(true)}
            style={{ display: 'inline-flex' }}
          >
            + Crear primer protocolo
          </button>
        </div>
      ) : (
        <div className="proto-list">
          {folderProtocols.map((p) => (
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
