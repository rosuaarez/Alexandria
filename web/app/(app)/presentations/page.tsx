'use client'

import { useMemo, useState } from 'react'
import type { Protocol } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import {
  usePresentationStore,
  type SavedPresentation,
} from '@/lib/stores/usePresentationStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { EmptyState } from '@/components/ui'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { PresentationViewer } from '@/components/protocols/PresentationViewer'
import { downloadPresentationPptx } from '@/lib/presentation/download'
import { colorShort, templateBackground } from '@/lib/presentation/constants'
import styles from './presentations.module.css'

function formatDate(iso: string): string {
  const d = iso ? new Date(iso) : null
  if (!d || Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function PresentationsPage() {
  const protocols = useProtocolStore((s) => s.protocols)
  const presentations = usePresentationStore((s) => s.presentations)
  const deletePresentation = usePresentationStore((s) => s.deletePresentation)
  const showToast = useUIStore((s) => s.showToast)

  const [viewing, setViewing] = useState<SavedPresentation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SavedPresentation | null>(null)

  const sorted = useMemo(
    () =>
      [...presentations].sort((a, b) =>
        (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
      ),
    [presentations]
  )

  // Protocolo de origen (para regenerar/descargar). Si ya no existe, se usa un
  // stub mínimo — "Ver" igual funciona porque las slides van guardadas.
  const protocolFor = (pres: SavedPresentation): Protocol => {
    const found = protocols.find((p) => p.id === pres.protocolId)
    if (found) return found
    return { id: pres.protocolId, name: pres.name, data: {} } as unknown as Protocol
  }

  const handleDownload = async (pres: SavedPresentation) => {
    showToast('Generando .pptx…', 'info')
    const ok = await downloadPresentationPptx(
      protocolFor(pres),
      pres.template,
      pres.color
    )
    showToast(
      ok ? 'Presentación descargada ✓' : 'No se pudo generar la presentación',
      ok ? 'success' : 'error'
    )
  }

  const handleGoogleSlides = async (pres: SavedPresentation) => {
    showToast(
      'Se descargará el .pptx — súbelo a Google Drive y ábrelo con Google Slides.',
      'info'
    )
    const ok = await downloadPresentationPptx(
      protocolFor(pres),
      pres.template,
      pres.color
    )
    if (ok) window.open('https://slides.google.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-transition" id="view-presentations">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)' }}>
        Presentaciones
      </h1>
      <p style={{ color: 'var(--text-3)', fontSize: 14, margin: '6px 0 24px' }}>
        Genera slides de resultados de investigación a partir de tus protocolos.
      </p>

      {sorted.length === 0 ? (
        <EmptyState
          emoji="🎯"
          title="Aún no hay presentaciones"
          description="Genera una desde cualquier protocolo con el botón “Presentación”."
        />
      ) : (
        <div className={styles.grid}>
          {sorted.map((pres) => (
            <div key={pres.id} className={styles.card}>
              <div
                className={styles.thumb}
                style={{ background: templateBackground(pres.template, pres.color) }}
              >
                <span className={styles.thumbIcon} aria-hidden>
                  🎯
                </span>
              </div>
              <div className={styles.body}>
                <div className={styles.name} title={pres.name}>
                  {pres.name}
                </div>
                <div className={styles.meta}>
                  <span>
                    {colorShort(pres.color)} ·{' '}
                    {pres.template === 'gradient' ? 'Gradient' : 'Minimal'}
                  </span>
                  <span className={styles.metaDot}>{pres.slideCount} slides</span>
                  <span className={styles.metaDot}>{formatDate(pres.createdAt)}</span>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() => setViewing(pres)}
                  >
                    ▶ Ver
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setDeleteTarget(pres)}
                    title="Eliminar presentación"
                    aria-label="Eliminar presentación"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewing && (
        <PresentationViewer
          isOpen
          protocol={protocolFor(viewing)}
          template={viewing.template}
          color={viewing.color}
          slides={viewing.slides}
          title={viewing.name}
          onClose={() => setViewing(null)}
          onDownloadPptx={() => handleDownload(viewing)}
          onGoogleSlides={() => handleGoogleSlides(viewing)}
        />
      )}

      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Eliminar presentación"
        protocolName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            deletePresentation(deleteTarget.id)
            showToast('Presentación eliminada', 'success')
          }
        }}
      />
    </div>
  )
}
