'use client'

import { useEffect } from 'react'
import type { Libro } from '@/lib/data/libros'

interface PdfViewerProps {
  libro: Libro
  onClose: () => void
}

export function PdfViewer({ libro, onClose }: PdfViewerProps) {
  // Cerrar con Escape.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header del modal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'white',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-1)' }}>
          {libro.titulo}
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {libro.pdfUrl && (
            <button
              type="button"
              onClick={() => window.open(libro.pdfUrl, '_blank', 'noopener,noreferrer')}
              style={{
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ⬇ Descargar PDF
            </button>
          )}
          {/* Abrir en nueva pestaña */}
          <button
            type="button"
            onClick={() => window.open(libro.pdfUrl, '_blank', 'noopener,noreferrer')}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            title="Abrir en nueva pestaña"
          >
            ↗
          </button>
          {/* Cerrar */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: 'var(--text-2)',
              padding: '4px 8px',
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      </div>

      {/* Visor del PDF */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <iframe
          src={`${libro.pdfUrl}#toolbar=0`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={libro.titulo}
        />
      </div>
    </div>
  )
}
