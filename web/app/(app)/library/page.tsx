'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectFolder } from '@/lib/types'
import { useFolderStore } from '@/lib/stores/useFolderStore'
import { FolderCard } from '@/components/library/FolderCard'
import { FolderModal, type FolderModalData } from '@/components/library/FolderModal'

export default function LibraryPage() {
  const router = useRouter()
  const loading = useFolderStore((s) => s.loading)
  const searchQuery = useFolderStore((s) => s.searchQuery)
  const setSearch = useFolderStore((s) => s.setSearch)
  const filteredFolders = useFolderStore((s) => s.filteredFolders)
  // Se recalcula cuando cambian folders o searchQuery (ambos están en el store).
  useFolderStore((s) => s.folders)
  const createFolder = useFolderStore((s) => s.createFolder)
  const updateFolder = useFolderStore((s) => s.updateFolder)
  const deleteFolder = useFolderStore((s) => s.deleteFolder)

  const folders = filteredFolders()

  const [createOpen, setCreateOpen] = useState(false)
  const [editFolder, setEditFolder] = useState<ProjectFolder | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProjectFolder | null>(null)

  const handleCreate = (data: FolderModalData) => {
    void createFolder({
      name: data.name,
      emoji: data.emoji,
      description: data.description,
    })
  }

  const handleEdit = (data: FolderModalData) => {
    if (!editFolder) return
    void updateFolder(editFolder.id, {
      name: data.name,
      emoji: data.emoji,
      description: data.description,
      createdAt: data.createdAt,
    })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    void deleteFolder(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="page-transition" id="view-library">
      <div className="bib-header">
        <div className="bib-title">Biblioteca de protocolos</div>
        <div className="bib-sub">
          Gestiona y organiza todos tus proyectos de investigación
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
            placeholder="Buscar proyectos..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bib-filter-btn" type="button" title="Filtros">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtros
        </button>
        <button
          className="bib-create-btn"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
          Crear carpeta
        </button>
      </div>

      <div className="bib-folders-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bib-folder-card"
              style={{ opacity: 0.5, minHeight: 150 }}
            />
          ))
        ) : (
          folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              count={folder.protocolCount}
              onOpen={(id) => router.push(`/library/${id}`)}
              onEdit={(f) => setEditFolder(f)}
              onDelete={(f) => setDeleteTarget(f)}
              onChangeEmoji={(id, emoji) => void updateFolder(id, { emoji })}
            />
          ))
        )}
      </div>

      <FolderModal
        isOpen={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <FolderModal
        isOpen={editFolder !== null}
        mode="edit"
        folder={editFolder}
        onClose={() => setEditFolder(null)}
        onSubmit={handleEdit}
      />

      {/* Confirmación de borrado (fiel al confirm-box del original). */}
      {deleteTarget && (
        <div className="modal-overlay open" onClick={() => setDeleteTarget(null)}>
          <div
            className="confirm-box"
            role="dialog"
            aria-modal="true"
            aria-label="Eliminar carpeta"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">🗑️</div>
            <div className="confirm-title">Eliminar carpeta</div>
            <div className="confirm-body">
              ¿Estás seguro de que quieres eliminar &ldquo;{deleteTarget.name}&rdquo;?
              <br />
              Los protocolos que contenga quedarán sin carpeta.
            </div>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
