'use client'

import type { Libro } from '@/lib/data/libros'

interface LibroCardProps {
  libro: Libro
}

export function LibroCard({ libro }: LibroCardProps) {
  return (
    <div className="caps-card caps-card-libro">
      {/* Portada placeholder de color (Diferencia 7): se sustituye por <img>
          cuando se provean las imágenes reales. */}
      <div
        className="caps-book-cover"
        style={{
          background: libro.accent,
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
      <div className="caps-card-tag">LIBRO</div>
      <h3 className="caps-card-title">{libro.titulo}</h3>
      <p className="caps-card-body">{libro.descripcion}</p>
      <div className="caps-card-author">{libro.autor}</div>
      <div className="caps-book-actions">
        <button type="button" className="caps-book-btn caps-book-read">
          ▶ Leer ahora
        </button>
        <button type="button" className="caps-book-btn caps-book-dl">
          ⬇ Descargar PDF
        </button>
      </div>
    </div>
  )
}
