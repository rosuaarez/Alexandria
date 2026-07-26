'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { ProtocolStatus } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { asArray, asQuestions, asString } from '@/components/protocols/forms/utils'
import styles from './output.module.css'

type Rec = Record<string, unknown>

const STATUS_OPTIONS: { value: ProtocolStatus; label: string; emoji: string }[] = [
  { value: 'draft', label: 'Borrador', emoji: '📝' },
  { value: 'in-review', label: 'En revisión', emoji: '👀' },
  { value: 'approved', label: 'Aprobado', emoji: '✅' },
  { value: 'ready', label: 'Listo para ejecutar', emoji: '🚀' },
  { value: 'completed', label: 'Completado', emoji: '🎉' },
]

// Orden del flujo de estados; un paso solo se habilita si su destino es el
// estado inmediatamente siguiente al actual.
const STATUS_FLOW: ProtocolStatus[] = [
  'draft',
  'in-review',
  'approved',
  'ready',
  'completed',
]

type PipeVariant = 'primary' | 'approve' | 'dark' | 'lyssna' | 'link'

// Paso del pipeline: emoji/estilo van como data tipada (no sueltos en el JSX).
// 'status' transiciona el protocolo; 'action' ejecuta una acción sin cambiarlo.
type PipeStep =
  | {
      kind: 'status'
      key: string
      label: string
      icon: string
      variant: PipeVariant
      target: ProtocolStatus
    }
  | {
      kind: 'action'
      key: string
      label: string
      icon: string
      variant: PipeVariant
      action: 'lyssna' | 'pdf' | 'presentation'
    }

const FLOW_STEPS: PipeStep[] = [
  { kind: 'status', key: 'review', label: 'Enviar a revisión', icon: '✉️', variant: 'primary', target: 'in-review' },
  { kind: 'status', key: 'approve', label: 'Aprobar', icon: '✅', variant: 'approve', target: 'approved' },
  { kind: 'status', key: 'ready', label: 'Listo para ejecutar', icon: '🚀', variant: 'primary', target: 'ready' },
  { kind: 'action', key: 'lyssna', label: 'Lyssna', icon: '🧊', variant: 'lyssna', action: 'lyssna' },
]

const EXPORT_STEPS: PipeStep[] = [
  { kind: 'action', key: 'pdf', label: 'PDF', icon: '📄', variant: 'dark', action: 'pdf' },
  { kind: 'action', key: 'presentation', label: 'Presentación', icon: '🎨', variant: 'link', action: 'presentation' },
]

interface OutputField {
  label: string
  value: string
}
interface OutputSection {
  title: string
  fields: OutputField[]
}

// Lee un array de items de texto que pueden ser strings u objetos
// ({ value } heredado | { tipo, descripcion } nuevo).
function readTextItems(v: unknown): string[] {
  return asArray<unknown>(v)
    .map((x) => {
      if (typeof x === 'string') return x
      const o = (x ?? {}) as Rec
      if (typeof o.value === 'string') return o.value
      const tipo = asString(o.tipo)
      const desc = asString(o.descripcion)
      return [tipo, desc].filter((s) => s.trim() !== '').join(': ')
    })
    .filter((s) => s.trim() !== '')
}

function joinLines(items: string[]): string {
  return items.filter((s) => s.trim() !== '').join('\n')
}

function joinTokens(v: unknown): string {
  return asArray<unknown>(v)
    .map((s) => (typeof s === 'string' ? s : ''))
    .filter((s) => s.trim() !== '')
    .join(', ')
}

// Construye las secciones a partir de los datos guardados del formulario.
// Los campos vacíos y las secciones sin campos se descartan.
function buildSections(data: Rec): OutputSection[] {
  const team = joinLines(
    asArray<Rec>(data.team).map((m) => {
      const name = asString(m.name) || asString(m.nombre)
      const roles = [asString(m.rolInvestigacion), asString(m.rolPdu)]
        .filter((s) => s.trim() !== '')
        .join(' · ')
      return [name, roles].filter((s) => s.trim() !== '').join(' — ')
    })
  )

  const docs = joinLines(
    asArray<Rec>(data.docs).map((d) => {
      const nombre = asString(d.nombre)
      const link = asString(d.link)
      return [nombre, link].filter((s) => s.trim() !== '').join(' — ')
    })
  )

  const preguntas = joinLines(
    asQuestions(data.questions).map((q, i) => {
      const text = asString(q.text)
      return text ? `${i + 1}. ${text}` : ''
    })
  )

  const fechasAplicacion = [
    asString(data.fechasAplicacionInicio),
    asString(data.fechasAplicacionFin),
  ]
    .filter((s) => s.trim() !== '')
    .join(' – ')

  const raw: OutputSection[] = [
    {
      title: 'Datos del proyecto',
      fields: [
        { label: 'Proyecto', value: asString(data.proyecto) },
        { label: 'Cliente', value: asString(data.cliente) },
        { label: 'Tema', value: asString(data.tema) },
      ],
    },
    {
      title: 'Team y stakeholders',
      fields: [{ label: 'Equipo', value: team }],
    },
    {
      title: 'Propósito',
      fields: [
        { label: 'Objetivo general', value: asString(data.objetivoGeneral) },
        {
          label: 'Objetivos específicos',
          value: joinLines(readTextItems(data.objetivos)),
        },
      ],
    },
    {
      title: 'Hipótesis',
      fields: [{ label: 'Hipótesis', value: asString(data.hipotesis) }],
    },
    {
      title: 'KPIs',
      fields: [{ label: 'Indicadores', value: joinLines(readTextItems(data.kpis)) }],
    },
    {
      title: 'Fechas',
      fields: [
        { label: 'Inicio', value: asString(data.fechaInicio) },
        { label: 'Resultados', value: asString(data.fechaResultados) },
      ],
    },
    {
      title: 'Entregables',
      fields: [{ label: 'Entregables', value: joinTokens(data.entregables) }],
    },
    {
      title: 'Documentación adicional',
      fields: [{ label: 'Documentos', value: docs }],
    },
    {
      title: 'Metodología',
      fields: [
        { label: 'Método', value: asString(data.metodo) },
        { label: 'Enfoque', value: asString(data.enfoque) },
        { label: 'Duración por sesión', value: asString(data.duracion) },
        { label: 'Muestra esperada', value: asString(data.muestra) },
        { label: 'Razón de la muestra', value: asString(data.razonMuestra) },
        { label: 'Herramientas', value: joinTokens(data.herramientas) },
        { label: 'Fechas de aplicación', value: fechasAplicacion },
      ],
    },
    {
      title: 'Perfil del usuario',
      fields: [
        { label: 'Característica', value: asString(data.caracteristica) },
        { label: 'Nivel digital', value: asString(data.nivelDigital) },
        { label: 'Edad', value: asString(data.edad) },
        { label: 'Género', value: asString(data.genero) },
        { label: 'NSE', value: asString(data.nse) },
        { label: 'Ocupación', value: asString(data.ocupacion) },
        { label: 'País', value: asString(data.pais) },
        { label: 'Contexto', value: asString(data.contexto) },
        { label: 'Link Proto Persona', value: asString(data.linkProtoPersona) },
        { label: 'Link User Persona', value: asString(data.linkUserPersona) },
      ],
    },
    {
      title: 'Preguntas de la prueba',
      fields: [
        { label: 'Introducción', value: asString(data.intro) },
        { label: 'Cierre', value: asString(data.cierre) },
        { label: 'Preguntas', value: preguntas },
        { label: 'Link de la prueba', value: asString(data.testUrl) },
        { label: 'Herramienta', value: asString(data.herramientaPrueba) },
      ],
    },
  ]

  return raw
    .map((s) => ({ ...s, fields: s.fields.filter((f) => f.value.trim() !== '') }))
    .filter((s) => s.fields.length > 0)
}

export default function ProtocolOutputPage() {
  const params = useParams<{ id: string }>()
  const protocols = useProtocolStore((s) => s.protocols)
  const loading = useProtocolStore((s) => s.loading)
  const updateProtocol = useProtocolStore((s) => s.updateProtocol)
  const showToast = useUIStore((s) => s.showToast)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  const protocol = protocols.find((p) => p.id === params.id)

  if (!protocol) {
    return (
      <div className={styles.empty}>
        <p>{loading ? 'Cargando protocolo…' : 'Protocolo no encontrado.'}</p>
        {!loading && (
          <Link href="/protocols" className={styles.link}>
            ← Volver a Mis Protocolos
          </Link>
        )}
      </div>
    )
  }

  const data = (protocol.data ?? {}) as Rec
  const sections = buildSections(data)
  const version = protocol.version ?? 1
  const status = protocol.protoStatus
  const currentStatus =
    STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0]

  const changeStatus = (value: ProtocolStatus) => {
    setStatusMenuOpen(false)
    if (value === status) return
    void updateProtocol({ ...protocol, protoStatus: value })
  }

  const handleLyssna = () => {
    const url = asString(data.testUrl)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
    else showToast('Aún no hay link de la prueba (Lyssna)', 'info')
  }

  const handlePresentation = () =>
    showToast('La presentación llega en un próximo sprint', 'info')

  const variantClass: Record<PipeVariant, string> = {
    primary: styles.stepPrimary,
    approve: styles.stepApprove,
    dark: styles.stepDark,
    lyssna: styles.stepLyssna,
    link: styles.stepLink,
  }

  // Habilitado solo si el destino es el estado inmediatamente siguiente.
  const currentIdx = STATUS_FLOW.indexOf(status)
  const isStepDisabled = (step: PipeStep): boolean => {
    if (step.kind === 'status') {
      const targetIdx = STATUS_FLOW.indexOf(step.target)
      return currentIdx < 0 || targetIdx !== currentIdx + 1
    }
    // Lyssna requiere link de prueba; PDF y Presentación siempre disponibles.
    if (step.action === 'lyssna') return asString(data.testUrl) === ''
    return false
  }

  const runStep = (step: PipeStep) => {
    if (step.kind === 'status') {
      changeStatus(step.target)
      return
    }
    if (step.action === 'lyssna') handleLyssna()
    else if (step.action === 'pdf') window.print()
    else handlePresentation()
  }

  const renderStep = (step: PipeStep) => (
    <button
      type="button"
      className={`${styles.step} ${variantClass[step.variant]}`}
      disabled={isStepDisabled(step)}
      onClick={() => runStep(step)}
    >
      <span className={styles.stepIcon} aria-hidden>
        {step.icon}
      </span>
      {step.label}
    </button>
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            Protocolo: {protocol.name} · V{version}
          </h1>
        </div>

        {/* Selector de estado. */}
        <div className={styles.statusWrap}>
          <button
            type="button"
            className={styles.statusBtn}
            title="Cambiar estado"
            aria-haspopup="listbox"
            aria-expanded={statusMenuOpen}
            onClick={() => setStatusMenuOpen((v) => !v)}
          >
            <span className={styles.statusDot} aria-hidden />
            <span className={styles.statusEmoji} aria-hidden>
              {currentStatus.emoji}
            </span>
            <span>{currentStatus.label}</span>
            <span className={styles.statusChevron} aria-hidden>
              ▾
            </span>
          </button>
          {statusMenuOpen && (
            <div className={styles.statusMenu} role="listbox">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === status}
                  className={`${styles.statusOpt}${opt.value === status ? ` ${styles.statusOptActive}` : ''}`}
                  onClick={() => changeStatus(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="editor-tabs">
        <Link href={`/protocols/${protocol.id}/edit`} className="editor-tab">
          Editar protocolo
        </Link>
        <span className="editor-tab active">Resultados</span>
      </div>

      {/* Pipeline de acciones */}
      <div className={styles.pipeline}>
        <div className={styles.pipeFlow}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step.key} className={styles.pipeStepWrap}>
              {i > 0 && (
                <span className={styles.pipeSep} aria-hidden>
                  ›
                </span>
              )}
              {renderStep(step)}
            </div>
          ))}
        </div>
        <div className={styles.pipeExports}>
          {EXPORT_STEPS.map((step) => (
            <span key={step.key}>{renderStep(step)}</span>
          ))}
        </div>
      </div>

      {/* Secciones con los datos guardados */}
      {sections.length === 0 ? (
        <div className={styles.empty}>
          <p>Este protocolo aún no tiene datos.</p>
          <Link href={`/protocols/${protocol.id}/edit`} className={styles.link}>
            Completar en el editor →
          </Link>
        </div>
      ) : (
        <div className={styles.sections}>
          {sections.map((s) => (
            <section key={s.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.title}</h2>
              <div className={styles.fields}>
                {s.fields.map((f) => (
                  <div key={f.label} className={styles.field}>
                    <span className={styles.fieldLabel}>{f.label}</span>
                    <span className={styles.fieldValue}>{f.value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
