'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import type { Protocol, ProtocolType, ProtocolStatus } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useEditorStore } from '@/lib/stores/useEditorStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useCopilotStore } from '@/lib/stores/useCopilotStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useTeamStore } from '@/lib/stores/useTeamStore'
import { PROTOCOL_TEMPLATES } from '@/lib/data/templates'
import { WorkflowBanner } from '@/components/protocols/WorkflowBanner'
import { ReviewBanner } from '@/components/protocols/ReviewBanner'
import { RelatedResources } from '@/components/protocols/RelatedResources'
import { ProtocolOutput } from '@/components/protocols/ProtocolOutput'
import { ExpressForm } from '@/components/protocols/forms/ExpressForm'
import { CompleteForm } from '@/components/protocols/forms/CompleteForm'
import { PresentationForm } from '@/components/protocols/forms/PresentationForm'
import type { FormData } from '@/components/protocols/forms/types'
import { computeCompletion } from '@/lib/utils/completion'
import styles from './editor.module.css'

// Panel pesado cargado solo en cliente cuando el protocolo está en revisión.
const CommentsPanel = dynamic(
  () =>
    import('@/components/protocols/CommentsPanel').then((m) => m.CommentsPanel),
  { ssr: false }
)

type Tab = 'edit' | 'output'

const EDITOR_TYPES: ProtocolType[] = ['express', 'complete', 'presentation', 'ab']

function normalizeType(raw: string | null): ProtocolType {
  return EDITOR_TYPES.includes(raw as ProtocolType)
    ? (raw as ProtocolType)
    : 'express'
}

// Tiempo relativo corto para el indicador de autosave ("hace 2s", "hace 3 min").
function formatAgo(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 60) return `hace ${s}s`
  const m = Math.round(s / 60)
  if (m < 60) return `hace ${m} min`
  const h = Math.round(m / 60)
  return `hace ${h} h`
}

const AUTOSAVE_MS = 30000

// Fecha corta dd-mm-aaaa para la meta del editor.
function formatDMY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

// Pill del template en el header del editor (label + colores por template).
interface TemplateTag {
  icon: string
  label: string
  bg: string
  color: string
  border: string
}
const TEMPLATE_TAG: Record<string, TemplateTag> = {
  usabilidad: { icon: '🎯', label: 'Prueba de Usabilidad', bg: '#FDF4FF', color: '#7C3AED', border: '#E9D5FF' },
  ab: { icon: '⚖️', label: 'A/B Testing', bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  entrevistas: { icon: '💬', label: 'Entrevistas', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  cardsorting: { icon: '🗂️', label: 'Card Sorting', bg: 'var(--accent-lt)', color: 'var(--accent)', border: 'transparent' },
  treetesting: { icon: '🌲', label: 'Tree Testing', bg: 'var(--accent-lt)', color: 'var(--accent)', border: 'transparent' },
  encuestas: { icon: '📊', label: 'Encuestas', bg: 'var(--accent-lt)', color: 'var(--accent)', border: 'transparent' },
  presentacion: { icon: '🎯', label: 'Presentación', bg: 'var(--accent-lt)', color: 'var(--accent)', border: 'transparent' },
}

// Fallback por tipo cuando no hay template (protocolos antiguos).
const TYPE_FALLBACK_LABEL: Record<ProtocolType, string> = {
  express: 'Express',
  complete: 'Completo',
  presentation: 'Presentación',
  ab: 'A/B Testing',
}

// Templates que usan el formulario Completo (Corrección 3).
const COMPLETE_TEMPLATES = ['usabilidad', 'entrevistas', 'cardsorting', 'treetesting', 'ab']

// Opciones del badge de estado del editor (dropdown "Borrador ▾" del original).
const EDITOR_STATUS_OPTIONS: { value: ProtocolStatus; label: string; dot: string }[] = [
  { value: 'draft', label: 'Borrador', dot: '#9CA3AF' },
  { value: 'in-review', label: 'En revisión', dot: '#D97706' },
  { value: 'approved', label: 'Aprobado', dot: '#10B981' },
  { value: 'ready', label: 'Listo para ejecutar', dot: '#5B21B6' },
  { value: 'completed', label: 'Completado', dot: '#2563EB' },
]

interface EditorInitial {
  type: ProtocolType
  platform?: 'maze' | 'forms'
  name: string
  status: Protocol['protoStatus']
  data: FormData
}

export default function ProtocolEditorPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const id = params.id
  const isNew = id === 'new'

  // Suscribirse al array hace que el componente re-renderice al terminar la carga.
  const protocols = useProtocolStore((s) => s.protocols)
  const loading = useProtocolStore((s) => s.loading)
  const existing = isNew ? undefined : protocols.find((p) => p.id === id)

  const initial: EditorInitial = useMemo(() => {
    if (isNew) {
      const type = normalizeType(searchParams.get('type'))
      const platform = searchParams.get('platform') as 'maze' | 'forms' | null
      const templateKey = searchParams.get('template') ?? ''
      const tpl = PROTOCOL_TEMPLATES[templateKey]
      const data: FormData = {}
      if (platform) data.platform = platform
      // Se guarda el template en data.template para el pill del header y para
      // decidir qué formulario mostrar (independiente del tipo).
      if (templateKey) data.template = templateKey
      if (tpl) {
        data.objetivo = tpl.objetivo
        data.questions = tpl.questions
      }
      return {
        type,
        platform: platform ?? undefined,
        name: searchParams.get('name') ?? tpl?.name ?? 'Nuevo protocolo',
        status: 'draft',
        data,
      }
    }
    return {
      type: (existing?.type ?? 'express') as ProtocolType,
      platform: existing?.platform,
      name: existing?.name ?? 'Protocolo',
      status: existing?.protoStatus ?? 'draft',
      data: (existing?.data ?? {}) as FormData,
    }
  }, [isNew, searchParams, existing])

  if (!isNew && !existing) {
    if (loading) {
      return <div className={styles.notFound}>Cargando protocolo…</div>
    }
    return (
      <div className={styles.notFound}>
        <p>Protocolo no encontrado.</p>
        <Link href="/protocols" className={styles.backLink}>
          ← Volver a Mis Protocolos
        </Link>
      </div>
    )
  }

  // key remonta la vista cuando carga el registro real → re-inicializa estado local
  // sin necesidad de setState en un efecto.
  return (
    <EditorView
      key={isNew ? 'new' : existing!.id}
      id={id}
      isNew={isNew}
      initial={initial}
      protocol={existing}
    />
  )
}

interface EditorViewProps {
  id: string
  isNew: boolean
  initial: EditorInitial
  protocol?: Protocol
}

function EditorView({ id, isNew, initial, protocol }: EditorViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentUser = useAuthStore((s) => s.currentUser)
  const createProtocol = useProtocolStore((s) => s.createProtocol)
  const updateProtocol = useProtocolStore((s) => s.updateProtocol)
  // Versión viva del protocolo en el store (incluye generatedData tras generar).
  const liveProtocol = useProtocolStore((s) => s.protocols.find((p) => p.id === id))
  const showToast = useUIStore((s) => s.showToast)
  const generateProtocol = useCopilotStore((s) => s.generateProtocol)
  const isGenerating = useCopilotStore((s) => s.isGenerating)
  const setCurrentProtocol = useCopilotStore((s) => s.setCurrentProtocol)
  const setCopilotOpen = useCopilotStore((s) => s.setOpen)

  // Colaboración: comentarios por campo cuando el protocolo está en revisión.
  const loadComments = useTeamStore((s) => s.loadComments)
  const clearComments = useTeamStore((s) => s.clearComments)
  const openAllComments = useTeamStore((s) => s.openAllComments)
  const closeComments = useTeamStore((s) => s.closeComments)
  const comments = useTeamStore((s) => s.comments)
  const isInReview = initial.status === 'in-review'
  const unresolvedCount = comments.filter((c) => !c.resolved).length

  const setEditorType = useEditorStore((s) => s.setType)
  const setEditorPlatform = useEditorStore((s) => s.setPlatform)
  const setEditingProtocol = useEditorStore((s) => s.setEditingProtocol)
  const setDirty = useEditorStore((s) => s.setDirty)
  const resetEditor = useEditorStore((s) => s.resetEditor)
  const isDirty = useEditorStore((s) => s.isDirty)
  const isSaving = useEditorStore((s) => s.isSaving)
  const setSaving = useEditorStore((s) => s.setSaving)

  const [name] = useState(initial.name)
  const [status, setStatus] = useState<ProtocolStatus>(initial.status)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  // Fecha de la meta: se captura tras el montaje para no llamar new Date() en render.
  const [metaDate, setMetaDate] = useState('')
  const [tab, setTab] = useState<Tab>(
    searchParams.get('tab') === 'output' ? 'output' : 'edit'
  )
  const dataRef = useRef<FormData>(initial.data)
  const nameRef = useRef<string>(initial.name)

  // Completitud reactiva del protocolo (campos requeridos según el tipo).
  const [completion, setCompletion] = useState(() =>
    computeCompletion(initial.type, initial.name, initial.data)
  )
  // Marca de tiempo del último guardado + etiqueta "hace Ns" ya formateada.
  // El reloj (Date.now) se lee solo en handlers/efectos, nunca en render
  // (mantiene el render puro para el React Compiler).
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const [agoLabel, setAgoLabel] = useState<string | null>(null)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Ref a persist para que el autosave no dependa del orden de declaración.
  const persistRef = useRef<(() => Promise<string | null>) | null>(null)

  const recomputeCompletion = useCallback(() => {
    setCompletion(
      computeCompletion(initial.type, nameRef.current, dataRef.current)
    )
  }, [initial.type])

  useEffect(() => {
    setEditorType(initial.type === 'ab' ? 'complete' : initial.type)
    setEditorPlatform(initial.platform ?? null)
    setEditingProtocol(isNew ? null : id)
    setCurrentProtocol(isNew ? null : id)
    // El AI Copilot está siempre visible en el editor (fiel al original):
    // se abre al entrar y se cierra al salir.
    setCopilotOpen(true)
    return () => {
      resetEditor()
      setCurrentProtocol(null)
      setCopilotOpen(false)
    }
  }, [
    id,
    isNew,
    initial.type,
    initial.platform,
    setEditorType,
    setEditorPlatform,
    setEditingProtocol,
    setCurrentProtocol,
    setCopilotOpen,
    resetEditor,
  ])

  // Carga los comentarios del protocolo en revisión y limpia al salir, para que
  // los indicadores por campo no se filtren a otro protocolo.
  useEffect(() => {
    if (!isNew && isInReview) {
      void loadComments(id)
    } else {
      clearComments()
    }
    return () => {
      closeComments()
      clearComments()
    }
  }, [id, isNew, isInReview, loadComments, clearComments, closeComments])

  // Fecha de la meta: createdAt del protocolo, o hoy para uno nuevo.
  useEffect(() => {
    const base = protocol?.createdAt ? new Date(protocol.createdAt) : new Date()
    setMetaDate(formatDMY(base))
  }, [protocol?.createdAt])

  const markDirty = useCallback(() => {
    if (!useEditorStore.getState().isDirty) setDirty(true)
  }, [setDirty])

  // Reinicia el temporizador de autosave en cada cambio: guarda 30s después del
  // último cambio manual (solo registros existentes).
  const scheduleAutosave = useCallback(() => {
    if (isNew) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      if (useEditorStore.getState().isDirty) void persistRef.current?.()
    }, AUTOSAVE_MS)
  }, [isNew])

  const handleFormChange = useCallback(
    (data: FormData) => {
      dataRef.current = { ...dataRef.current, ...data }
      markDirty()
      recomputeCompletion()
      scheduleAutosave()
    },
    [markDirty, recomputeCompletion, scheduleAutosave]
  )

  const persist = useCallback(async (): Promise<string | null> => {
    if (!currentUser) return null
    setSaving(true)
    try {
      if (isNew) {
        const created = await createProtocol(
          {
            name: nameRef.current.trim() || 'Nuevo protocolo',
            type: initial.type,
            protoStatus: 'draft',
            ...(initial.platform ? { platform: initial.platform } : {}),
            data: dataRef.current,
          },
          currentUser.id
        )
        setDirty(false)
        setLastSavedAt(Date.now())
        setAgoLabel(formatAgo(0))
        return created.id
      }
      if (protocol) {
        await updateProtocol({
          ...protocol,
          name: nameRef.current.trim() || protocol.name,
          data: dataRef.current,
        })
        setDirty(false)
        setLastSavedAt(Date.now())
        setAgoLabel(formatAgo(0))
        return protocol.id
      }
      return null
    } catch {
      // El store ya muestra el toast de error.
      return null
    } finally {
      setSaving(false)
    }
  }, [
    currentUser,
    isNew,
    protocol,
    initial.type,
    initial.platform,
    createProtocol,
    updateProtocol,
    setDirty,
    setSaving,
  ])

  // Mantiene el ref de persist actualizado para el autosave por temporizador.
  useEffect(() => {
    persistRef.current = persist
  }, [persist])

  // Refresca el "Guardado hace Ns" mientras hay una marca de guardado.
  // El setState ocurre en el callback async del intervalo (no en el cuerpo del
  // efecto), por lo que no viola react-hooks/set-state-in-effect.
  useEffect(() => {
    if (lastSavedAt == null) return
    const interval = setInterval(() => {
      setAgoLabel(formatAgo(Date.now() - lastSavedAt))
    }, 10000)
    return () => clearInterval(interval)
  }, [lastSavedAt])

  // Limpia el temporizador de autosave al desmontar.
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [])

  const handleGenerate = async () => {
    // 1. Guardar primero
    const savedId = await persist()
    if (!savedId) return
    const fresh = useProtocolStore.getState().getProtocolById(savedId)
    if (!fresh) return
    // 2. Generar con IA (el store maneja el estado de carga global)
    const result = await generateProtocol(fresh)
    if (result) {
      showToast('Protocolo generado con IA ✨', 'success')
      // 3. Activar tab Output
      if (isNew) router.replace(`/protocols/${savedId}/edit?tab=output`)
      else setTab('output')
    }
  }

  const handleStatusChange = async (value: ProtocolStatus) => {
    setStatus(value)
    setStatusMenuOpen(false)
    if (isNew) return
    const fresh = useProtocolStore.getState().getProtocolById(id) ?? protocol
    if (!fresh) return
    await updateProtocol({ ...fresh, protoStatus: value })
  }

  const handleApprove = async () => {
    const fresh = useProtocolStore.getState().getProtocolById(id) ?? protocol
    if (!fresh) return
    await updateProtocol({ ...fresh, protoStatus: 'approved' })
    closeComments()
    showToast('Protocolo aprobado ✓', 'success')
  }

  // Autosave al desmontar (solo registros existentes, evita creaciones sorpresa).
  useEffect(() => {
    return () => {
      const s = useEditorStore.getState()
      if (s.isDirty && !isNew) void persist()
    }
  }, [isNew, persist])

  const outputProtocol = liveProtocol ?? protocol

  // Template del protocolo (guardado en data.template o en protocol.template).
  const templateKey =
    (typeof initial.data.template === 'string' ? initial.data.template : '') ||
    protocol?.template ||
    ''

  // El formulario depende del TEMPLATE, no del tipo (Corrección 3).
  const renderForm = () => {
    const formProps = { initialData: initial.data, onChange: handleFormChange }
    if (COMPLETE_TEMPLATES.includes(templateKey)) return <CompleteForm {...formProps} />
    if (initial.type === 'presentation') return <PresentationForm {...formProps} />
    if (initial.type === 'complete' || initial.type === 'ab')
      return <CompleteForm {...formProps} />
    return <ExpressForm {...formProps} />
  }

  const currentStatus =
    EDITOR_STATUS_OPTIONS.find((o) => o.value === status) ?? EDITOR_STATUS_OPTIONS[0]

  const versionLabel = `V${protocol?.version ?? 1}`
  const templateTag: TemplateTag = TEMPLATE_TAG[templateKey] ?? {
    icon: '🎯',
    label: TYPE_FALLBACK_LABEL[initial.type] ?? 'Protocolo',
    bg: 'var(--accent-lt)',
    color: 'var(--accent)',
    border: 'transparent',
  }

  return (
    <div className={styles.page}>
      {/* Topbar del editor fiel al original: [← Volver] [nombre] [estado ▾]. */}
      <div className="editor-header-wrap">
        <div className="editor-topbar">
          <div className="editor-topbar-left">
            <button
              type="button"
              className="editor-back-btn"
              onClick={() => router.push('/protocols')}
            >
              ← Volver
            </button>
            <div>
              <h2 className="editor-proto-name">{name || 'Nuevo protocolo'}</h2>
              {/* Subtítulo + pill del template inline (Correcciones 1 y 2). */}
              <div
                className="editor-proto-subtitle"
                style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
              >
                Completa la siguiente información de tu protocolo
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: templateTag.bg,
                    color: templateTag.color,
                    border: `1px solid ${templateTag.border}`,
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {templateTag.icon} {templateTag.label}
                </span>
              </div>
              <div className="editor-proto-meta">
                <span>
                  <strong>Fecha:</strong> {metaDate || '—'}
                </span>
                <span className="editor-proto-meta-sep">|</span>
                <span>
                  <strong>Versión:</strong> {versionLabel}
                </span>
              </div>
            </div>
          </div>

          <div
            id="editor-action-btns"
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
              flexShrink: 0,
              marginLeft: 'auto',
            }}
          >
            <span className={styles.saveStatus}>
              {isSaving ? (
                <>
                  <span className={styles.savingDot} aria-hidden /> Guardando…
                </>
              ) : isDirty ? (
                <span className={styles.dirty}>● Sin guardar</span>
              ) : agoLabel != null ? (
                <span className={styles.saved}>✓ Guardado {agoLabel}</span>
              ) : null}
            </span>

            {isInReview && unresolvedCount > 0 && (
              <button
                type="button"
                className={styles.commentBadge}
                onClick={openAllComments}
                title="Ver todos los comentarios"
              >
                💬 {unresolvedCount}
              </button>
            )}

            {/* Badge de estado con dropdown (Borrador ▾). */}
            <div
              className={`editor-status-badge ${status}`}
              onClick={() => setStatusMenuOpen((v) => !v)}
              title="Cambiar estado"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setStatusMenuOpen((v) => !v)
                }
              }}
              style={{ position: 'relative' }}
            >
              <span className="editor-status-badge-dot" />
              <span>{currentStatus.label}</span>
              <span className="editor-status-badge-chevron">▾</span>
              <div className={`editor-status-dropdown${statusMenuOpen ? ' open' : ''}`}>
                {EDITOR_STATUS_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={`editor-status-opt${opt.value === status ? ' active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      void handleStatusChange(opt.value)
                    }}
                  >
                    <span
                      className="editor-status-opt-dot"
                      style={{ background: opt.dot }}
                    />
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isInReview && (
        <ReviewBanner
          commentCount={unresolvedCount}
          onViewComments={openAllComments}
          onApprove={handleApprove}
        />
      )}

      <WorkflowBanner status={initial.status} completion={completion} />

      <nav className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'edit' ? styles.tabActive : ''}`}
          onClick={() => setTab('edit')}
        >
          Editar
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'output' ? styles.tabActive : ''}`}
          onClick={() => setTab('output')}
        >
          Output
        </button>
      </nav>

      <section className={styles.content}>
        {tab === 'edit' ? (
          <>
            {renderForm()}
            <RelatedResources type={initial.type} />
            {/* Botón principal al final del formulario (centrado, con separador
                superior, fiel al original). */}
            <div
              style={{
                textAlign: 'center',
                padding: '32px 0',
                borderTop: '1px solid var(--border)',
                marginTop: 8,
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={isSaving || isGenerating}
                style={{ padding: '14px 40px', fontSize: 16 }}
              >
                {isGenerating ? 'Generando…' : '✦ Generar protocolo'}
              </button>
            </div>
          </>
        ) : outputProtocol ? (
          <ProtocolOutput protocol={outputProtocol} />
        ) : (
          <p className={styles.outputText}>
            Guarda el protocolo y genera el output con IA para verlo aquí.
          </p>
        )}
      </section>

      {isInReview && <CommentsPanel protocolId={id} />}
    </div>
  )
}
