'use client'

import type { Libro } from '@/lib/data/libros'
import { useUIStore } from '@/lib/stores/useUIStore'

interface LibroCardProps {
  libro: Libro
}

export function LibroCard({ libro }: LibroCardProps) {
  const showToast = useUIStore((s) => s.showToast)

  const openPdf = () => window.open(libro.pdfUrl, '_blank', 'noopener,noreferrer')

  const handleLeer = () => {
    if (libro.pdfUrl) openPdf()
    else showToast('Próximamente', 'info')
  }

  const handleDescargar = () => {
    if (libro.pdfUrl) openPdf()
    else showToast('PDF no disponible aún', 'info')
  }

  return (
    <div className="caps-card caps-card-libro visible">
      {/* Portada: imagen real si hay coverUrl; si no, placeholder con el título. */}
      {libro.coverUrl ? (
        <img
          className="caps-book-cover"
          src={libro.coverUrl}
          alt={libro.titulo}
          style={{ width: '100%', height: 180, objectFit: 'cover' }}
        />
      ) : (
        <div
          className="caps-book-cover"
          style={{
            background: 'linear-gradient(135deg,#6D28C7,#8C59FE)',
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'center',
            padding: 16,
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
