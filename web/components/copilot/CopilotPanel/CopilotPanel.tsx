'use client'

import { useEffect, useRef, useState } from 'react'
import { useCopilotStore } from '@/lib/stores/useCopilotStore'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'

// Anillo de calidad — radio 16 (mismo SVG que el HTML original).
const RING_RADIUS = 16
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

interface QualityDimension {
  label: string
  value: number
}

// Score y dimensiones mock (75) — fieles a la maqueta del HTML original.
const QUALITY_SCORE = 75
const QUALITY_DIMENSIONS: QualityDimension[] = [
  { label: 'Objetivos', value: 80 },
  { label: 'Preguntas', value: 75 },
  { label: 'Completitud', value: 70 },
]

function qualityTier(score: number): { cls: string; color: string; badge: string; sub: string } {
  if (score >= 70)
    return { cls: 'high', color: '#059669', badge: '● Alto', sub: 'Protocolo sólido y bien definido' }
  if (score >= 40)
    return { cls: 'mid', color: '#D97706', badge: '● Medio', sub: 'Puede mejorarse en algunos puntos' }
  return { cls: 'low', color: '#DC2626', badge: '● Bajo', sub: 'Necesita mejoras importantes' }
}

// Ícono del header del panel (globo con órbitas, igual que el HTML original).
function CopilotGlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function QualityRing() {
  const [open, setOpen] = useState(false)
  const tier = qualityTier(QUALITY_SCORE)
  const offset = RING_CIRCUMFERENCE * (1 - QUALITY_SCORE / 100)

  return (
    <div
      className={`acp-quality-section${open ? ' open' : ''}`}
      aria-label="Calidad del protocolo"
    >
      <div
        className="acp-quality-trigger"
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v)
        }}
      >
        <div className="acp-quality-ring">
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r={RING_RADIUS} fill="none" stroke="var(--border)" strokeWidth="3.5" />
            <circle
              cx="20"
              cy="20"
              r={RING_RADIUS}
              fill="none"
              stroke={tier.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 20 20)"
            />
          </svg>
          <span className="acp-quality-num">{QUALITY_SCORE}</span>
        </div>
        <div className="acp-quality-info">
          <div className="acp-quality-label">Calidad del protocolo</div>
          <div className="acp-quality-sublabel">{tier.sub}</div>
        </div>
        <div className={`acp-quality-badge ${tier.cls}`}>{tier.badge}</div>
        <span className="acp-quality-chevron">▲</span>
      </div>

      <div className="acp-quality-body">
        {QUALITY_DIMENSIONS.map((dim) => (
          <div key={dim.label} className="acp-qdim">
            <span className="acp-qdim-label">{dim.label}</span>
            <div className="acp-qdim-bar">
              <div className="acp-qdim-fill" style={{ width: `${dim.value}%` }} />
            </div>
            <span className="acp-qdim-val">{dim.value}</span>
          </div>
        ))}
        <p className="acp-quality-hint">
          Análisis de demostración — conecta una API para evaluar tu protocolo en
          tiempo real.
        </p>
      </div>
    </div>
  )
}

export function CopilotPanel() {
  const isOpen = useCopilotStore((s) => s.isOpen)
  const messages = useCopilotStore((s) => s.messages)
  const isGenerating = useCopilotStore((s) => s.isGenerating)
  const currentProtocolId = useCopilotStore((s) => s.currentProtocolId)
  const setOpen = useCopilotStore((s) => s.setOpen)
  const askCopilot = useCopilotStore((s) => s.askCopilot)
  const generateProtocol = useCopilotStore((s) => s.generateProtocol)

  const protocol = useProtocolStore((s) =>
    currentProtocolId ? s.protocols.find((p) => p.id === currentProtocolId) : undefined
  )

  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al último mensaje.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, isGenerating])

  const canAsk = !!protocol && !isGenerating

  const handleSend = () => {
    const text = input.trim()
    if (!text || !protocol || isGenerating) return
    setInput('')
    void askCopilot(text, protocol)
  }

  const handleGenerate = () => {
    if (!protocol || isGenerating) return
    void generateProtocol(protocol)
  }

  const handleAnalyze = () => {
    if (!protocol || isGenerating) return
    void askCopilot('Analiza la calidad de este protocolo y dime cómo mejorarlo.', protocol)
  }

  const handleSuggestQuestions = () => {
    if (!protocol || isGenerating) return
    void askCopilot('Sugiéreme preguntas adicionales para este protocolo.', protocol)
  }

  // El panel se renderiza siempre; su visibilidad la controlan #acp-panel.open
  // y body.acp-open (transform slide), igual que el HTML original.
  return (
    <div id="acp-panel" className={isOpen ? 'open' : ''} aria-label="Copiloto Alexandria">
      <div className="acp-panel-header">
        <div className="acp-topbar-icon">
          <CopilotGlobeIcon />
        </div>
        <div className="acp-topbar-info">
          <div className="acp-topbar-title">AI Copilot</div>
          <div className="acp-topbar-sub">Asistente de investigación UX</div>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setOpen(false)}
          aria-label="Cerrar copiloto"
          style={{ marginLeft: 'auto' }}
        >
          ×
        </button>
      </div>

      <div className="acp-actions">
        <button type="button" className="acp-action-btn" onClick={handleGenerate} disabled={!canAsk}>
          <span className="acp-action-icon">✨</span>
          <span className="acp-action-text">Generar protocolo</span>
          <span className="acp-action-arrow">→</span>
        </button>
        <button type="button" className="acp-action-btn" onClick={handleAnalyze} disabled={!canAsk}>
          <span className="acp-action-icon">🔍</span>
          <span className="acp-action-text">Analizar protocolo</span>
          <span className="acp-action-arrow">→</span>
        </button>
        <button type="button" className="acp-action-btn" onClick={handleSuggestQuestions} disabled={!canAsk}>
          <span className="acp-action-icon">💡</span>
          <span className="acp-action-text">Sugerir preguntas</span>
          <span className="acp-action-arrow">→</span>
        </button>
      </div>

      <div className="acp-chat-label">Ai Copilot</div>

      <div className="acp-chat-area" ref={listRef}>
        {messages.length === 0 && !isGenerating && (
          <div className="acp-welcome">
            <p>¡Hola! Soy tu asistente de investigación UX.</p>
            <p>
              Usa los botones de arriba para:
              <br />• <strong>Analizar</strong> tu protocolo completo
              <br />• <strong>Sugerir preguntas</strong> contextuales
              <br />• <strong>Mejorar el objetivo</strong> de investigación
            </p>
            <p>
              O escríbeme directamente:{' '}
              <em>&ldquo;genera preguntas sobre onboarding&rdquo;</em> ✨
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`acp-msg ${m.role === 'user' ? 'acp-msg-user' : 'acp-msg-ai'}`}
          >
            <div className="acp-bubble">{m.content}</div>
          </div>
        ))}

        {isGenerating && (
          <div className="acp-msg acp-msg-ai">
            <div className="acp-bubble acp-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <QualityRing />

      <div className="acp-input-wrap">
        <input
          className="acp-input"
          type="text"
          value={input}
          placeholder={
            protocol
              ? 'Ej: genera preguntas sobre onboarding'
              : 'Abre un protocolo para chatear…'
          }
          disabled={!canAsk}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <button
          type="button"
          className="acp-send-btn"
          onClick={handleSend}
          disabled={!canAsk || !input.trim()}
          aria-label="Enviar"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}
