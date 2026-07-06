'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import type { Protocol, ProtocolType } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useEditorStore } from '@/lib/stores/useEditorStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useCopilotStore } from '@/lib/stores/useCopilotStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useTeamStore } from '@/lib/stores/useTeamStore'
import { PROTOCOL_TEMPLATES } from '@/lib/data/templates'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
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
      const tpl = PROTOCOL_TEMPLATES[searchParams.get('template') ?? '']
      const data: FormData = {}
      if (platform) data.platform = platform
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

  const [name, setName] = useState(initial.name)
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
    return () => {
      resetEditor()
      setCurrentProtocol(null)
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

  const handleNameChange = (value: string) => {
    setName(value)
    nameRef.current = value
    markDirty()
    recomputeCompletion()
    scheduleAutosave()
  }

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

  const handleSave = async () => {
    const savedId = await persist()
    if (isNew && savedId) router.replace(`/protocols/${savedId}/edit`)
  }

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

  const renderForm = () => {
    const formProps = { initialData: initial.data, onChange: handleFormChange }
    if (initial.type === 'express') return <ExpressForm {...formProps} />
    if (initial.type === 'presentation') return <PresentationForm {...formProps} />
    return <CompleteForm {...formProps} />
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Mis Protocolos', href: '/protocols' },
          { label: name.trim() || initial.name },
          { label: isNew ? 'Crear' : 'Editar' },
        ]}
      />

      <header className={styles.topbar}>
        <div className={styles.topLeft}>
          <Link href="/protocols" className={styles.back} aria-label="Volver">
            ←
          </Link>
          <input
            className={styles.nameInput}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nombre del protocolo"
          />
          <StatusPill status={initial.status} size="sm" />
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
        </div>
        <div className={styles.topRight}>
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
          <Button
            variant="secondary"
            onClick={handleSave}
            loading={isSaving}
            disabled={isGenerating}
          >
            Guardar
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={isSaving}
            leftIcon={isGenerating ? undefined : '✨'}
          >
            {isGenerating ? 'Generando…' : 'Generar con IA'}
          </Button>
        </div>
      </header>

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
