'use client'

import { useEffect, useRef, useState } from 'react'
import { useCopilotStore } from '@/lib/stores/useCopilotStore'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import {
  analyzeProtocol as computeAnalysis,
  calculateQualityScore,
  type AnalysisDimension,
} from '@/lib/gemini/analyzeProtocol'

// Anillo de calidad — radio 16 (mismo SVG que el HTML original).
const RING_RADIUS = 16
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

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

interface QualityRingProps {
  score: number
  dimensions: AnalysisDimension[]
  analyzed: boolean
}

function QualityRing({ score, dimensions, analyzed }: QualityRingProps) {
  const [open, setOpen] = useState(false)
  const tier = qualityTier(score)
  const offset = RING_CIRCUMFERENCE * (1 - score / 100)

  // Al completar un análisis, expande la sección de calidad automáticamente.
  useEffect(() => {
    if (analyzed) setOpen(true)
  }, [analyzed])

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
          <span className="acp-quality-num">{score}</span>
        </div>
        <div className="acp-quality-info">
          <div className="acp-quality-label">Calidad del protocolo</div>
          <div className="acp-quality-sublabel">{tier.sub}</div>
        </div>
        <div className={`acp-quality-badge ${tier.cls}`}>{tier.badge}</div>
        <span className="acp-quality-chevron">▲</span>
      </div>

      <div className="acp-quality-body">
        {dimensions.map((dim) => (
          <div key={dim.label} className="acp-qdim">
            <span className="acp-qdim-label">{dim.label}</span>
            <div className="acp-qdim-bar">
              <div className="acp-qdim-fill" style={{ width: `${dim.value * 10}%` }} />
            </div>
            <span className="acp-qdim-val">{dim.value}</span>
          </div>
        ))}
        <p className="acp-quality-hint">
          {analyzed
            ? 'Análisis completado. Revisa los detalles arriba.'
            : 'Pulsa "Analizar protocolo" para evaluar objetivos, preguntas y completitud.'}
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
  const analyzeProtocol = useCopilotStore((s) => s.analyzeProtocol)
  const hasAnalysis = useCopilotStore((s) => s.hasAnalysis)
  const analysisScores = useCopilotStore((s) => s.analysisScores)

  const protocol = useProtocolStore((s) =>
    currentProtocolId ? s.protocols.find((p) => p.id === currentProtocolId) : undefined
  )

  const [input, setInput] = useState('')
  // Acción destacada del panel. "analizar" queda resaltada por defecto (Dif 6).
  const [activeAction, setActiveAction] = useState<'analizar' | 'preguntas' | 'objetivo'>(
    'analizar'
  )
  const listRef = useRef<HTMLDivElement>(null)

  // Score y dimensiones dinámicos del protocolo actual (Corrección 6).
  const score = calculateQualityScore(protocol)
  const dimensions = computeAnalysis(protocol).dimensions

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

  // Analiza el protocolo vía el store (publica mensaje + scores).
  const handleAnalyze = () => {
    setActiveAction('analizar')
    if (!protocol || isGenerating) return
    void analyzeProtocol(protocol)
  }

  const handleSuggestQuestions = () => {
    setActiveAction('preguntas')
    if (!protocol || isGenerating) return
    void askCopilot('Sugiéreme preguntas adicionales para este protocolo.', protocol)
  }

  const handleImproveObjective = () => {
    setActiveAction('objetivo')
    if (!protocol || isGenerating) return
    void askCopilot('Mejora el objetivo de investigación de este protocolo.', protocol)
  }

  const busy = isGenerating

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
        <button
          type="button"
          className={`acp-action-btn${activeAction === 'analizar' ? ' acp-active' : ''}`}
          onClick={handleAnalyze}
          disabled={!canAsk}
        >
          <span className="acp-action-icon">🔍</span>
          <span className="acp-action-text">Analizar protocolo</span>
          <span className="acp-action-arrow">→</span>
        </button>
        <button
          type="button"
          className={`acp-action-btn${activeAction === 'preguntas' ? ' acp-active' : ''}`}
          onClick={handleSuggestQuestions}
          disabled={!canAsk}
        >
          <span className="acp-action-icon">💡</span>
          <span className="acp-action-text">Sugerir preguntas</span>
          <span className="acp-action-arrow">→</span>
        </button>
        <button
          type="button"
          className={`acp-action-btn${activeAction === 'objetivo' ? ' acp-active' : ''}`}
          onClick={handleImproveObjective}
          disabled={!canAsk}
        >
          <span className="acp-action-icon">🎯</span>
          <span className="acp-action-text">Mejorar objetivo</span>
          <span className="acp-action-arrow">→</span>
        </button>
      </div>

      <div className="acp-chat-label">Ai Copilot</div>

      <div className="acp-chat-area" ref={listRef}>
        {messages.length === 0 && !busy && (
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
            <div className="acp-bubble" style={{ whiteSpace: 'pre-line' }}>
              {m.content}
            </div>
          </div>
        ))}

        {busy && (
          <div className="acp-msg acp-msg-ai">
            <div className="acp-bubble acp-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Barras de score tras un análisis (Objetivos / Preguntas / Completitud). */}
        {hasAnalysis && analysisScores && !busy && (
          <div className="acp-scores">
            {[
              { label: 'Objetivos', score: analysisScores.objetivos },
              { label: 'Preguntas', score: analysisScores.preguntas },
              { label: 'Completitud', score: analysisScores.completitud },
            ].map(({ label, score: s }) => (
              <div key={label} className="acp-score-row">
                <span className="acp-score-label">{label}</span>
                <div className="acp-score-bar">
                  <div className="acp-score-fill" style={{ width: `${s * 10}%` }} />
                </div>
                <span className="acp-score-num">{s}</span>
              </div>
            ))}
            <p className="acp-analysis-done">
              Análisis completado. Revisa los detalles arriba.
            </p>
          </div>
        )}
      </div>

      <QualityRing score={score} dimensions={dimensions} analyzed={hasAnalysis} />

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
