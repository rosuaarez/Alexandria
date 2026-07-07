'use client'

import { useEffect } from 'react'
import type { Metodologia } from '@/lib/data/metodologias'

// Color de texto del pill en el modal (sin fondo — Diferencia 6).
const PILL_TEXT: Record<string, string> = {
  generativa: '#15803d',
  evaluativa: '#6d28d9',
  moderada: '#1d4ed8',
  'no-moderada': '#c2410c',
  presencial: '#be185d',
  remota: '#0f766e',
  content: '#a16207',
  'design-thinking': '#7c3aed',
}

function pillColor(pill: string): string {
  return PILL_TEXT[pill.toLowerCase().replace(/\s+/g, '-')] ?? 'var(--accent)'
}

interface MetodoModalProps {
  metodo: Metodologia | null
  onClose: () => void
}

export function MetodoModal({ metodo, onClose }: MetodoModalProps) {
  useEffect(() => {
    if (!metodo) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [metodo, onClose])

  if (!metodo) return null

  return (
    <div className="metodo-modal-overlay open" onClick={onClose}>
      <div className="metodo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="metodo-modal-header">
          <div className="metodo-modal-num">{metodo.num.toUpperCase()}</div>
          <h2 className="metodo-modal-title">{metodo.title}</h2>
          <div className="metodo-modal-pills">
            {metodo.pills.map((p) => (
              <span
                key={p}
                style={{ color: pillColor(p), fontWeight: 700, fontSize: 12.5 }}
              >
                {p}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="metodo-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="metodo-modal-body">
          <div className="metodo-grid2">
            <div className="metodo-stat-box">
              <div className="metodo-stat-label">📍 Cuándo usarla</div>
              <div className="metodo-stat-val">{metodo.cuando}</div>
            </div>
            <div className="metodo-stat-box">
              <div className="metodo-stat-label">👥 Usuarios recomendados</div>
              <div className="metodo-stat-val">{metodo.usuarios}</div>
            </div>
          </div>

          <div className="metodo-section">
            <div className="metodo-section-label">🎯 Para qué usarla</div>
            <div className="metodo-section-content">{metodo.para}</div>
          </div>

          <div className="metodo-section">
            <div className="metodo-section-label">⚙️ Desarrollo paso a paso</div>
            <ol className="metodo-steps">
              {metodo.pasos.map((paso, i) => (
                <li key={i}>
                  <span className="metodo-step-num">{i + 1}</span>
                  <span>{paso}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="metodo-section">
            <div className="metodo-section-label">💡 Tipo de conclusiones</div>
            <div className="metodo-section-content">{metodo.conclusiones}</div>
          </div>

          <div className="metodo-section">
            <div className="metodo-section-label">🛠 Herramientas sugeridas</div>
            <div className="metodo-tags-row">
              {metodo.tools.map((t) => (
                <span key={t} className="metodo-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
