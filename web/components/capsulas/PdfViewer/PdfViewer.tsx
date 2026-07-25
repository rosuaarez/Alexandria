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
        background: 'rgba(0,0,0,0.7)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal contenedor */}
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          height: '85vh',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header del modal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'white',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>
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
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
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
                padding: '7px 10px',
                cursor: 'pointer',
                fontSize: '15px',
                color: 'var(--text-2)',
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
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--text-3)',
                padding: '4px 8px',
                lineHeight: 1,
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Visor del PDF */}
        <div style={{ flex: 1, overflow: 'hidden', background: '#404040' }}>
          <iframe
            src={`${libro.pdfUrl}#toolbar=0`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={libro.titulo}
          />
        </div>
      </div>
    </div>
  )
}
