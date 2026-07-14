'use client'

import { useState } from 'react'
import type { Libro } from '@/lib/data/libros'
import { useUIStore } from '@/lib/stores/useUIStore'

interface LibroCardProps {
  libro: Libro
  onRead: (libro: Libro) => void
}

export function LibroCard({ libro, onRead }: LibroCardProps) {
  const showToast = useUIStore((s) => s.showToast)
  // Si la imagen de portada falla al cargar, se cae al placeholder púrpura.
  const [imgFailed, setImgFailed] = useState(false)
  const showCover = !!libro.coverUrl && !imgFailed

  const openPdf = () => window.open(libro.pdfUrl, '_blank', 'noopener,noreferrer')

  const handleLeer = () => {
    if (libro.pdfUrl) onRead(libro)
    else showToast('PDF no disponible aún', 'info')
  }

  const handleDescargar = () => {
    if (libro.pdfUrl) openPdf()
    else showToast('PDF no disponible aún', 'info')
  }

  return (
    <div className="caps-card caps-card-libro visible">
      {/* Portada: imagen de coverUrl; si falla o no hay, placeholder púrpura. */}
      {showCover ? (
        <img
          src={libro.coverUrl}
          alt={`Portada de ${libro.titulo}`}
          onError={() => setImgFailed(true)}
          style={{
            width: '100%',
            height: '220px',
            objectFit: 'cover',
            borderRadius: 'var(--radius) var(--radius) 0 0',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '220px',
            background: 'linear-gradient(135deg, #6D28C7, #8C59FE)',
            borderRadius: 'var(--radius) var(--radius) 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '15px',
            fontWeight: 600,
            textAlign: 'center',
            padding: '20px',
          }}
        >
          {libro.titulo}
        </div>
      )}
      <div className="caps-card-tag">LIBRO</div>
      <h3 className="caps-card-title">{libro.titulo}</h3>
      <p className="caps-card-body">{libro.descripcion}</p>
      <div className="caps-card-author">{libro.autor}</div>
      <div className="caps-book-actions">
        <button
          type="button"
          className="caps-book-btn caps-book-read"
          onClick={handleLeer}
        >
          ▶ Leer ahora
        </button>
        <button
          type="button"
          className="caps-book-btn caps-book-dl"
          onClick={handleDescargar}
        >
          ⬇ Descargar PDF
        </button>
      </div>
    </div>
  )
}
