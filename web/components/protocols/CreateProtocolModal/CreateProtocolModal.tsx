'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProtocolType } from '@/lib/types'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

interface TemplateOption {
  value: string
  icon: string
  title: string
  desc: string
  // Metodología derivada (fiel al map del HTML original).
  metodologia: string
  // Tipo de protocolo que crea este template.
  type: ProtocolType
}

// Templates fieles al modal original (grid 2x3, con icono/título/descripción).
const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    value: 'usabilidad',
    icon: '🎯',
    title: 'Prueba de Usabilidad',
    desc: 'Evalúa la facilidad de uso de un producto o servicio',
    metodologia: 'pdu',
    type: 'express',
  },
  {
    value: 'ab',
    icon: '⚖️',
    title: 'A/B Testing',
    desc: 'Compara dos versiones para determinar cuál funciona mejor',
    metodologia: 'ab-testing',
    type: 'ab',
  },
  {
    value: 'entrevistas',
    icon: '💬',
    title: 'Entrevistas de Profundidad',
    desc: 'Conversaciones detalladas para entender necesidades y comportamientos',
    metodologia: 'entrevistas',
    type: 'complete',
  },
  {
    value: 'cardsorting',
    icon: '🗂️',
    title: 'Card Sorting',
    desc: 'Organiza información basándose en modelos mentales de usuarios',
    metodologia: 'card-sorting',
    type: 'complete',
  },
  {
    value: 'treetesting',
    icon: '🌲',
    title: 'Tree Testing',
    desc: 'Evalúa la navegación y arquitectura de información',
    metodologia: 'tree-testing',
    type: 'complete',
  },
  {
    value: 'encuestas',
    icon: '📊',
    title: 'Encuestas',
    desc: 'Recopila datos cuantitativos de un grupo amplio',
    metodologia: 'encuestas',
    type: 'express',
  },
]

const TEMPLATE_BY_VALUE: Record<string, TemplateOption> = Object.fromEntries(
  TEMPLATE_OPTIONS.map((t) => [t.value, t])
)

// Opciones de versión 1..10 (fiel al <select> del original).
const VERSION_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1))

// Mocks vacíos por ahora (se poblarán con datos reales más adelante).
const CLIENTE_OPTIONS: { value: string; label: string }[] = []
const PROYECTO_OPTIONS: { value: string; label: string }[] = []
const FOLDER_OPTIONS: { value: string; label: string }[] = []

// Slug fiel al original: espacios→guion, minúsculas, solo [a-z0-9-], recorte.
function slugify(value: string, max: number): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, max)
}

interface CreateProtocolModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProtocolModal({ isOpen, onClose }: CreateProtocolModalProps) {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [cliente, setCliente] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [tema, setTema] = useState('')
  const [folder, setFolder] = useState('')
  const [version, setVersion] = useState('1')
  const [template, setTemplate] = useState<string | null>(null)
  // La fecha se captura tras el montaje para no llamar a new Date() en render.
  const [dateStr, setDateStr] = useState('')
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen)

  useEffect(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setDateStr(`${yyyy}-${mm}-${dd}`)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Nombre auto-generado: proyecto-metodologia-tema-yyyy-mm-dd-vN (fiel al original).
  const autoName = useMemo(() => {
    const parts: string[] = []
    const proyectoSlug = slugify(proyecto, 20)
    const temaSlug = slugify(tema, 30)
    const metodologia = template ? TEMPLATE_BY_VALUE[template]?.metodologia ?? '' : ''
    if (proyectoSlug) parts.push(proyectoSlug)
    if (metodologia) parts.push(metodologia)
    if (temaSlug) parts.push(temaSlug)
    if (dateStr) parts.push(dateStr)
    parts.push(`v${version || '1'}`)
    return parts.join('-')
  }, [proyecto, tema, template, dateStr, version])

  if (!isOpen) return null

  const resetAndClose = () => {
    onClose()
    setStep(1)
  }

  // No se crea el protocolo aún: se navega al editor (id 'new'), que persiste al Guardar.
  const handleCreate = () => {
    if (!tema.trim() || !template) return
    const type = TEMPLATE_BY_VALUE[template]?.type ?? 'express'
    const params = new URLSearchParams({ type, template, name: autoName })
    resetAndClose()
    router.push(`/protocols/new/edit?${params.toString()}`)
  }

  return (
    <div className="modal-overlay open" onClick={resetAndClose}>
      {step === 1 && (
        <div
          ref={trapRef}
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Nuevo protocolo"
          style={{ maxWidth: 580 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title">
              <div className="modal-title-icon">✦</div>Nuevo protocolo
            </div>
            <button className="modal-close" onClick={resetAndClose} aria-label="Cerrar">
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                marginBottom: 14,
              }}
            >
              <div>
                <label style={{ marginBottom: 6, display: 'block' }}>Cliente</label>
                <select
                  style={{ width: '100%' }}
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                >
                  <option value="">Ninguno</option>
                  {CLIENTE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ marginBottom: 6, display: 'block' }}>Proyecto</label>
                <select
                  style={{ width: '100%' }}
                  value={proyecto}
                  onChange={(e) => setProyecto(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {PROYECTO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ marginBottom: 6, display: 'block' }}>Tema de investigación</label>
              <input
                type="text"
                autoFocus
                placeholder="Ej. Usabilidad onboarding, prueba de navegación..."
                style={{ width: '100%' }}
                value={tema}
                onChange={(e) => setTema(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginTop: 12,
              }}
            >
              <div>
                <label style={{ marginBottom: 6, display: 'block' }}>Carpeta del proyecto</label>
                <select
                  style={{ width: '100%' }}
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                >
                  <option value="">Sin carpeta</option>
                  {FOLDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ marginBottom: 6, display: 'block' }}>Versión</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'var(--surface)',
                  }}
                >
                  <span
                    style={{
                      padding: '0 10px',
                      background: 'var(--surface-2)',
                      borderRight: '1px solid var(--border)',
                      color: 'var(--text-3)',
                      fontSize: 14,
                      fontWeight: 600,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    v
                  </span>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    style={{
                      border: 'none',
                      borderRadius: 0,
                      flex: 1,
                      height: 36,
                      padding: '0 8px',
                      background: 'transparent',
                      fontFamily: 'var(--font)',
                      fontSize: 14,
                      color: 'var(--text-1)',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {VERSION_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Nombre auto-generado de solo lectura con badge ✦ Auto e ícono 🔒. */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: '1px solid var(--border)',
              }}
            >
              <label
                style={{
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Nombre del protocolo
                <span
                  style={{
                    fontSize: 10,
                    background: '#F3F0FF',
                    color: 'var(--accent)',
                    border: '1px solid #DDD9F5',
                    borderRadius: 999,
                    padding: '2px 8px',
                    fontWeight: 600,
                    letterSpacing: '.02em',
                  }}
                >
                  ✦ Auto
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  placeholder="Se generará al completar los campos…"
                  value={autoName}
                  aria-label="Nombre generado automáticamente"
                  style={{
                    width: '100%',
                    background: '#F7F5FD',
                    color: 'var(--text-3)',
                    borderColor: 'var(--border)',
                    cursor: 'default',
                    fontStyle: 'italic',
                    paddingRight: 38,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 11,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 15,
                    color: 'var(--text-4)',
                    pointerEvents: 'none',
                  }}
                >
                  🔒
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-4)',
                  marginTop: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>📐</span> Naming automático:
                proyecto-metodologia-tema-aaaa-mm-dd-version
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={resetAndClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={!tema.trim()}
              style={!tema.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div
          ref={trapRef}
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Elige un template de investigación"
          style={{ maxWidth: 580 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title">
              <div className="modal-title-icon">📐</div>Elige un Template de Investigación
            </div>
            <button className="modal-close" onClick={resetAndClose} aria-label="Cerrar">
              ✕
            </button>
          </div>

          <div className="modal-body">
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18 }}>
              Selecciona la metodología que mejor se adapte a tus objetivos
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {TEMPLATE_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  role="button"
                  tabIndex={0}
                  className={`template-card${template === opt.value ? ' selected' : ''}`}
                  onClick={() => setTemplate(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setTemplate(opt.value)
                    }
                  }}
                >
                  <div className="template-card-icon">{opt.icon}</div>
                  <div className="template-card-title">{opt.title}</div>
                  <div className="template-card-desc">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Volver
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={!template}
              style={!template ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
