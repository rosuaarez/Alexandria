'use client'

import type { Metodologia } from '@/lib/data/metodologias'

// Clase de color del pill según su tipo (fiel a globals.css: .pill-generativa, …).
export function pillClass(pill: string): string {
  return 'pill-' + pill.toLowerCase().replace(/\s+/g, '-')
}

interface MetodoCardProps {
  metodo: Metodologia
  onOpen: (metodo: Metodologia) => void
}

export function MetodoCard({ metodo, onOpen }: MetodoCardProps) {
  return (
    <div
      className="caps-card caps-card-metodo"
      onClick={() => onOpen(metodo)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(metodo)
      }}
    >
      <div className="caps-card-accent" style={{ background: metodo.accent }} />
      <div className="caps-card-header-row">
        <div className="caps-card-tag-wrap">
          <div className="caps-card-tag">{metodo.tag}</div>
        </div>
      </div>
      <div className="caps-metodo-pills">
        {metodo.pills.map((p) => (
          <span key={p} className={`caps-metodo-pill ${pillClass(p)}`}>
            {p}
          </span>
        ))}
      </div>
      <h3 className="caps-card-title">{metodo.title}</h3>
      {metodo.sample && (
        <div className="caps-card-sample-below">{metodo.sample}</div>
      )}
      <p className="caps-card-body">{metodo.body}</p>
      <button type="button" className="caps-metodo-btn">
        Ver metodología →
      </button>
    </div>
  )
}
