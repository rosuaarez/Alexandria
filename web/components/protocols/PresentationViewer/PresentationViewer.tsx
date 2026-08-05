'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Protocol } from '@/lib/types'
import { buildSlides, type Slide } from '@/lib/presentation/presentationData'
import { colorHex, type PresentationTemplate } from '@/lib/presentation/constants'
import styles from './PresentationViewer.module.css'

export interface PresentationViewerProps {
  isOpen: boolean
  protocol: Protocol
  template: PresentationTemplate
  color: string
  onClose: () => void
  onDownloadPptx: () => void
  onGoogleSlides: () => void
  // Guardar es opcional: al VER una presentación ya guardada no se muestra.
  onSave?: () => void
  // Slides ya generadas (para "Ver" sin regenerar). Si no vienen, se construyen.
  slides?: Slide[]
  // Título del deck (por defecto el nombre del protocolo).
  title?: string
}

// Aclara un color hex mezclándolo con blanco (para el segundo stop del degradado).
function lighten(hex: string, amount: number): string {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

// Variables de tema según la plantilla elegida.
function themeVars(
  template: PresentationTemplate,
  hex: string
): React.CSSProperties {
  if (template === 'gradient') {
    return {
      '--bg': `linear-gradient(135deg, #${hex} 0%, ${lighten(hex, 0.38)} 100%)`,
      '--fg': '#ffffff',
      '--muted': 'rgba(255,255,255,.75)',
      '--accent': '#ffffff',
      '--card': 'rgba(255,255,255,.12)',
      '--line': 'rgba(255,255,255,.24)',
      '--chip': 'rgba(255,255,255,.16)',
    } as React.CSSProperties
  }
  return {
    '--bg': '#ffffff',
    '--fg': '#1e293b',
    '--muted': '#64748b',
    '--accent': `#${hex}`,
    '--card': '#f8fafc',
    '--line': '#e2e8f0',
    '--chip': '#f1f5f9',
  } as React.CSSProperties
}

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'cover':
      return (
        <div className={styles.cover}>
          <span className={styles.kicker}>{slide.kicker}</span>
          <h1 className={styles.coverTitle}>{slide.title}</h1>
          <p className={styles.subtitle}>{slide.subtitle}</p>
          <div className={styles.metaRow}>
            {slide.meta.map((m) => (
              <div key={m.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.label}</span>
                <span className={styles.metaValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'fields':
      return (
        <>
          <span className={styles.kicker}>{slide.kicker}</span>
          <h2 className={styles.title}>{slide.title}</h2>
          <dl className={styles.fields}>
            {slide.fields.map((f) => (
              <div key={f.label} className={styles.field}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )
    case 'tools':
      return (
        <>
          <span className={styles.kicker}>{slide.kicker}</span>
          <h2 className={styles.title}>{slide.title}</h2>
          <p className={styles.body}>{slide.body}</p>
          {slide.chips.length > 0 && (
            <div className={styles.chips}>
              {slide.chips.map((c) => (
                <span key={c} className={styles.chip}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </>
      )
    case 'metrics':
      return (
        <>
          <span className={styles.kicker}>{slide.kicker}</span>
          <h2 className={styles.title}>{slide.title}</h2>
          <div className={styles.stats}>
            {slide.stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
          {slide.note && <p className={styles.body}>{slide.note}</p>}
          {slide.kpis.length > 0 && (
            <dl className={styles.fields}>
              {slide.kpis.map((k) => (
                <div key={k.label} className={styles.field}>
                  <dt>{k.label}</dt>
                  <dd>{k.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </>
      )
    case 'questions':
      return (
        <>
          <span className={styles.kicker}>{slide.kicker}</span>
          <h2 className={styles.title}>{slide.title}</h2>
          <ul className={styles.questions}>
            {slide.items.map((q) => (
              <li key={q.n} className={styles.question}>
                <span className={styles.qNum}>{q.n}</span>
                <div>
                  <span className={styles.qLabel}>{q.label}</span>
                  <span className={styles.qText}>{q.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )
    case 'list':
      return (
        <>
          <span className={styles.kicker}>{slide.kicker}</span>
          <h2 className={styles.title}>{slide.title}</h2>
          <ul className={styles.bullets}>
            {slide.items.map((it, i) => (
              <li key={`${i}-${it}`}>{it}</li>
            ))}
          </ul>
        </>
      )
    case 'closing':
      return (
        <div className={styles.cover}>
          <h1 className={styles.coverTitle}>{slide.title}</h1>
          <p className={styles.subtitle}>{slide.subtitle}</p>
        </div>
      )
  }
}

export function PresentationViewer({
  isOpen,
  protocol,
  template,
  color,
  onClose,
  onDownloadPptx,
  onGoogleSlides,
  onSave,
  slides: slidesProp,
  title,
}: PresentationViewerProps) {
  const slides = useMemo(
    () => slidesProp ?? buildSlides(protocol),
    [slidesProp, protocol]
  )
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) setCurrent(0)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight')
        setCurrent((c) => Math.min(slides.length - 1, c + 1))
      else if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1))
    }
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDocClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [isOpen, onClose, slides.length])

  if (!isOpen) return null

  const safeIndex = Math.min(current, slides.length - 1)
  const vars = themeVars(template, colorHex(color))

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.shell}>
        {/* Barra superior */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <span className={styles.deckTitle}>{title ?? protocol.name}</span>
            <span className={styles.deckTag}>
              {template === 'gradient' ? 'Gradient' : 'Minimal'}
            </span>
          </div>
          <div className={styles.toolbarRight}>
            {onSave && (
              <button type="button" className={styles.btnGhost} onClick={onSave}>
                Guardar
              </button>
            )}
            <div className={styles.menuWrap} ref={menuRef}>
              <button
                type="button"
                className={styles.btnPrimary}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                Descargar ▾
              </button>
              {menuOpen && (
                <div className={styles.menu} role="menu">
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      setMenuOpen(false)
                      onDownloadPptx()
                    }}
                  >
                    <span className={styles.menuIcon}>📄</span>
                    <span>
                      <span className={styles.menuTitle}>Descargar .pptx</span>
                      <span className={styles.menuDesc}>
                        PowerPoint / Keynote
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      setMenuOpen(false)
                      onGoogleSlides()
                    }}
                  >
                    <span className={styles.menuIcon}>🟡</span>
                    <span>
                      <span className={styles.menuTitle}>
                        Abrir en Google Slides
                      </span>
                      <span className={styles.menuDesc}>
                        Descarga el .pptx y súbelo a Drive
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Lienzo de la diapositiva */}
        <div className={styles.stage}>
          <div className={styles.slide} style={vars}>
            <div className={styles.slideInner}>
              <SlideBody slide={slides[safeIndex]} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.brand} src="/uix-logo.svg" alt="UiX" />
          </div>
        </div>

        {/* Navegación */}
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={safeIndex === 0}
            aria-label="Anterior"
          >
            ‹
          </button>
          <span className={styles.counter}>
            {safeIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
            disabled={safeIndex === slides.length - 1}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
