'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { ProtocolStatus } from '@/lib/types'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { usePresentationStore } from '@/lib/stores/usePresentationStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { asArray, asString } from '@/components/protocols/forms/utils'
import { ActionPipeline } from '@/components/protocols/ActionPipeline'
import { LyssnaModal } from '@/components/protocols/LyssnaModal'
import { ShareLinkModal } from '@/components/protocols/ShareLinkModal'
import { PresentationModal } from '@/components/protocols/PresentationModal'
import { PresentationViewer } from '@/components/protocols/PresentationViewer'
import { printProtocolPdf } from '@/lib/pdf/protocolPdf'
import { buildLyssnaText } from '@/lib/lyssna/formatProtocol'
import type { PresentationTemplate } from '@/lib/presentation/constants'
import { downloadPresentationPptx } from '@/lib/presentation/download'
import { buildSlides } from '@/lib/presentation/presentationData'
import styles from './output.module.css'

type Rec = Record<string, unknown>

// Mensaje del banner de estado (arriba de la vista).
const STATUS_BANNER: Record<ProtocolStatus, string> = {
  draft: 'Borrador — completa y envía a revisión para continuar',
  'in-review': 'En revisión — esperando la aprobación de los stakeholders',
  approved: 'Aprobado — márcalo como listo para ejecutar cuando corresponda',
  ready: 'Listo para ejecutar — puedes lanzar la prueba en Lyssna',
  completed: 'Completado — la prueba ha finalizado',
  onhold: 'En pausa — retomarás este protocolo más adelante',
  cerrado: 'Cerrado',
  finalizado: 'Finalizado',
  changes_requested: 'Cambios solicitados — revisa los comentarios',
  activo: 'Activo',
}

const STATUS_OPTIONS: { value: ProtocolStatus; label: string; emoji: string }[] = [
  { value: 'draft', label: 'Borrador', emoji: '📝' },
  { value: 'in-review', label: 'En revisión', emoji: '👀' },
  { value: 'approved', label: 'Aprobado', emoji: '✅' },
  { value: 'ready', label: 'Listo para ejecutar', emoji: '🚀' },
  { value: 'completed', label: 'Completado', emoji: '🎉' },
]

// --- Campos (label MAYÚSCULAS + valor). Los vacíos se descartan. ---
interface FieldItem {
  label: string
  value: string
  full?: boolean
}

function pickFields(
  entries: ReadonlyArray<readonly [string, string, boolean?]>
): FieldItem[] {
  return entries
    .filter((e) => e[1].trim() !== '')
    .map((e) => ({ label: e[0], value: e[1], full: e[2] ?? false }))
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

// Renombre de herramientas heredadas: el proyecto pasó de "Maze" a "Lyssna".
// Se aplica solo al mostrar, sin reescribir los datos guardados.
const TOOL_RENAME: Record<string, string> = { Maze: 'Lyssna' }

function joinTools(v: unknown): string {
  return asArray<unknown>(v)
    .map((s) => (typeof s === 'string' ? TOOL_RENAME[s] ?? s : ''))
    .filter((s) => s.trim() !== '')
    .join(', ')
}

// --- Preguntas del test como unión discriminada por tipo. ---
type RenderQuestion =
  | { id: string; n: number; kind: 'open'; text: string }
  | { id: string; n: number; kind: 'likert'; text: string }
  | { id: string; n: number; kind: 'multiple'; text: string; options: string[] }
  | { id: string; n: number; kind: 'other'; text: string; badge: string }

function questionBadge(q: RenderQuestion): string {
  return q.kind === 'other' ? q.badge : q.kind
}

// Normaliza las preguntas guardadas ({ id, text, type }) a RenderQuestion.
// Las opciones de 'multiple' se leen si existen; hoy no se guardan (queda []).
function parseQuestions(v: unknown): RenderQuestion[] {
  const out: RenderQuestion[] = []
  asArray<unknown>(v).forEach((raw, i) => {
    const o = (raw ?? {}) as Rec
    const text = asString(o.text)
    if (text.trim() === '') return
    const id = asString(o.id) || `q-${i}`
    const type = asString(o.type)
    const n = out.length + 1
    if (type === 'likert' || type === 'scale5' || type === 'scale7') {
      out.push({ id, n, kind: 'likert', text })
    } else if (type === 'multiple') {
      const options = asArray<unknown>(o.options)
        .map((op) => (typeof op === 'string' ? op : asString(((op ?? {}) as Rec).value)))
        .filter((s) => s.trim() !== '')
      out.push({ id, n, kind: 'multiple', text, options })
    } else if (type === '' || type === 'open') {
      out.push({ id, n, kind: 'open', text })
    } else {
      out.push({ id, n, kind: 'other', text, badge: type })
    }
  })
  return out
}

// --- Componentes de presentación ---

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {children}
    </section>
  )
}

function FieldGrid({ fields }: { fields: FieldItem[] }) {
  return (
    <div className={styles.grid2}>
      {fields.map((f) => (
        <div
          key={f.label}
          className={`${styles.field}${f.full ? ` ${styles.full}` : ''}`}
        >
          <span className={styles.fieldLabel}>{f.label}</span>
          <span className={styles.fieldValue}>{f.value}</span>
        </div>
      ))}
    </div>
  )
}

function ArrowList({ items }: { items: string[] }) {
  return (
    <ul className={styles.arrowList}>
      {items.map((it, i) => (
        <li key={`${i}-${it}`} className={styles.arrowItem}>
          <span className={styles.arrow} aria-hidden>
            →
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function KpiTable({ rows }: { rows: { kpi: string; metrica: string }[] }) {
  return (
    <div className={styles.kpiTable}>
      <div className={`${styles.kpiRow} ${styles.kpiHead}`}>
        <span className={styles.kpiCell}>KPI</span>
        <span className={styles.kpiCell}>Métrica</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className={styles.kpiRow}>
          <span className={styles.kpiCell}>{r.kpi || '—'}</span>
          <span className={styles.kpiCell}>{r.metrica || '—'}</span>
        </div>
      ))}
    </div>
  )
}

function QuestionItem({ q }: { q: RenderQuestion }) {
  return (
    <div className={styles.qItem}>
      <span className={styles.qNum}>{q.n}</span>
      <div className={styles.qBody}>
        <div className={styles.qHead}>
          <span className={styles.qText}>{q.text}</span>
          <span className={styles.qBadge}>{questionBadge(q)}</span>
        </div>
        {q.kind === 'likert' && (
          <div className={styles.likert} aria-hidden>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={styles.likertBtn}>
                {n}
              </span>
            ))}
          </div>
        )}
        {q.kind === 'multiple' && q.options.length > 0 && (
          <ul className={styles.options}>
            {q.options.map((o, i) => (
              <li key={`${i}-${o}`} className={styles.option}>
                <span className={styles.checkbox} aria-hidden />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function ProtocolOutputPage() {
  const params = useParams<{ id: string }>()
  const protocols = useProtocolStore((s) => s.protocols)
  const loading = useProtocolStore((s) => s.loading)
  const updateProtocol = useProtocolStore((s) => s.updateProtocol)
  const addPresentation = usePresentationStore((s) => s.addPresentation)
  const showToast = useUIStore((s) => s.showToast)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [lyssnaOpen, setLyssnaOpen] = useState(false)
  const [lyssnaText, setLyssnaText] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [presentationOpen, setPresentationOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerCfg, setViewerCfg] = useState<{
    template: PresentationTemplate
    color: string
  }>({ template: 'minimal', color: 'Morado (predeterminado)' })

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
  const version = protocol.version ?? 1
  const status = protocol.protoStatus
  const currentStatus =
    STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0]

  // Ajustes de presentación guardados (plantilla + color) para reabrir con ellos.
  const savedPresentationRaw = (data.presentation ?? {}) as Rec
  const savedPresentation = {
    template: (asString(savedPresentationRaw.template) === 'gradient'
      ? 'gradient'
      : 'minimal') as PresentationTemplate,
    color: asString(savedPresentationRaw.color) || undefined,
  }

  // --- Datos derivados (leídos de lo ya guardado; se ocultan los vacíos). ---
  const datosFields = pickFields([
    ['Proyecto', asString(data.proyecto)],
    ['Tema', asString(data.tema)],
    ['Inicio', asString(data.fechaInicio)],
    ['Presentación de resultados', asString(data.fechaResultados)],
  ])

  const fechasApp = [
    asString(data.fechasAplicacionInicio),
    asString(data.fechasAplicacionFin),
  ]
    .filter((s) => s.trim() !== '')
    .join(' – ')

  const metodFields = pickFields([
    ['Método', asString(data.metodo)],
    ['Enfoque', asString(data.enfoque)],
    ['Herramientas', joinTools(data.herramientas)],
    ['Duración', asString(data.duracion)],
    ['Muestra', asString(data.muestra)],
    ['Fechas de aplicación', fechasApp],
    ['¿Por qué?', asString(data.razonMuestra), true],
  ])

  const team = asArray<unknown>(data.team)
    .map((m) => {
      const o = (m ?? {}) as Rec
      const name = asString(o.name) || asString(o.nombre)
      return [name, asString(o.rolInvestigacion), asString(o.rolPdu)]
        .filter((s) => s.trim() !== '')
        .join(' — ')
    })
    .filter((s) => s.trim() !== '')

  const objetivo = asString(data.objetivoGeneral)
  const objetivoItems = objetivo
    ? [objetivo, ...readTextItems(data.objetivos)]
    : readTextItems(data.objetivos)
  const kpis = asArray<unknown>(data.kpis)
    .map((k) => {
      const o = (k ?? {}) as Rec
      return { kpi: asString(o.tipo), metrica: asString(o.descripcion) }
    })
    .filter((r) => r.kpi.trim() !== '' || r.metrica.trim() !== '')
  const hasDefinicion = objetivoItems.length > 0 || kpis.length > 0

  // ProtoPersona: "Tipificación" mapea al campo nse (no existe uno propio).
  const protoFields = pickFields([
    ['Tipificación', asString(data.nse)],
    ['Edad', asString(data.edad)],
    ['Nivel digital', asString(data.nivelDigital)],
    ['Género', asString(data.genero)],
    ['Ocupación', asString(data.ocupacion)],
    ['Características', asString(data.caracteristica)],
  ])

  const devFields = pickFields([
    ['Introducción', asString(data.intro), true],
    ['Cierre', asString(data.cierre), true],
    ['Link de la prueba', asString(data.testUrl)],
    ['Herramienta', asString(data.herramientaPrueba)],
  ])
  const questions = parseQuestions(data.questions)
  const hasDesarrollo = devFields.length > 0 || questions.length > 0

  const entregables = asArray<unknown>(data.entregables)
    .map((e) => (typeof e === 'string' ? e : ''))
    .filter((s) => s.trim() !== '')

  const docs = asArray<unknown>(data.docs)
    .map((d) => {
      const o = (d ?? {}) as Rec
      return [asString(o.nombre), asString(o.link)]
        .filter((s) => s.trim() !== '')
        .join(' — ')
    })
    .filter((s) => s.trim() !== '')

  const anyContent =
    datosFields.length > 0 ||
    metodFields.length > 0 ||
    team.length > 0 ||
    hasDefinicion ||
    protoFields.length > 0 ||
    hasDesarrollo ||
    entregables.length > 0 ||
    docs.length > 0

  const changeStatus = (value: ProtocolStatus) => {
    setStatusMenuOpen(false)
    if (value === status) return
    void updateProtocol({ ...protocol, protoStatus: value })
  }

  // Enfoque semi-automático: Lyssna no expone API pública de creación de
  // estudios. Se formatea el protocolo, se copia al portapapeles y se abre
  // Lyssna en una pestaña nueva; el modal muestra el texto como respaldo.
  const copyLyssnaText = (text: string) => {
    if (!navigator.clipboard) {
      showToast('Copia el contenido desde el cuadro (portapapeles no disponible).', 'info')
      return
    }
    navigator.clipboard.writeText(text).then(
      () => showToast('Contenido copiado. Pégalo en tu nuevo estudio de Lyssna.', 'success'),
      () => showToast('Copia el contenido desde el cuadro (permiso denegado).', 'info')
    )
  }

  const handleLyssna = () => {
    const text = buildLyssnaText(protocol)
    setLyssnaText(text)
    setLyssnaOpen(true)
    copyLyssnaText(text)
    window.open('https://app.lyssna.com', '_blank', 'noopener,noreferrer')
  }

  // Enviar a revisión: genera la liga compartible, la muestra y marca el
  // protocolo como "en revisión".
  const copyShareLink = (link: string) => {
    if (!navigator.clipboard) {
      showToast('Copia la liga desde el cuadro (portapapeles no disponible).', 'info')
      return
    }
    navigator.clipboard.writeText(link).then(
      () => showToast('Liga copiada al portapapeles ✓', 'success'),
      () => showToast('Copia la liga desde el cuadro (permiso denegado).', 'info')
    )
  }

  const handleSendToReview = () => {
    const link = `${window.location.origin}/protocols/${protocol.id}`
    setShareLink(link)
    setShareOpen(true)
    copyShareLink(link)
    if (status !== 'in-review') {
      void updateProtocol({ ...protocol, protoStatus: 'in-review' })
    }
  }

  const handlePresentation = () => setPresentationOpen(true)

  // "Generar presentación" abre el visualizador in-app con la plantilla elegida.
  const handleGeneratePresentation = (
    template: PresentationTemplate,
    color: string
  ) => {
    setViewerCfg({ template, color })
    setPresentationOpen(false)
    setViewerOpen(true)
  }

  const handleDownloadPptx = async () => {
    showToast('Generando .pptx…', 'info')
    const ok = await downloadPresentationPptx(
      protocol,
      viewerCfg.template,
      viewerCfg.color
    )
    showToast(
      ok ? 'Presentación descargada ✓' : 'No se pudo generar la presentación',
      ok ? 'success' : 'error'
    )
  }

  // Google Slides: sin API/OAuth. Se descarga el .pptx y se abre Google Slides
  // para que el usuario lo suba a Drive y lo abra ahí.
  const handleGoogleSlides = async () => {
    showToast(
      'Se descargará el .pptx — súbelo a Google Drive y ábrelo con Google Slides.',
      'info'
    )
    const ok = await downloadPresentationPptx(
      protocol,
      viewerCfg.template,
      viewerCfg.color
    )
    if (ok) window.open('https://slides.google.com', '_blank', 'noopener,noreferrer')
  }

  // Guardar: crea un registro de la presentación (asociado al protocolo) con su
  // contenido de slides, y recuerda plantilla+color para reabrir el modal así.
  const handleSavePresentation = () => {
    const slides = buildSlides(protocol)
    addPresentation({
      protocolId: protocol.id,
      name: protocol.name,
      template: viewerCfg.template,
      color: viewerCfg.color,
      slideCount: slides.length,
      slides,
    })
    const prevData = (protocol.data ?? {}) as Rec
    void updateProtocol({
      ...protocol,
      data: {
        ...prevData,
        presentation: { template: viewerCfg.template, color: viewerCfg.color },
      },
    })
    showToast('Presentación guardada ✓', 'success')
  }

  const handlePdf = () => {
    const ok = printProtocolPdf(protocol)
    if (!ok) showToast('Permite ventanas emergentes para exportar el PDF', 'info')
  }

  return (
    <div className={styles.page}>
      {/* Banner de estado */}
      <div className={styles.banner}>{STATUS_BANNER[status]}</div>

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

      {/* Pipeline de acciones (componente reutilizable) */}
      <ActionPipeline
        status={status}
        onChangeStatus={changeStatus}
        onSendToReview={handleSendToReview}
        onLyssna={handleLyssna}
        onPdf={handlePdf}
        onPresentation={handlePresentation}
      />

      {/* Tarjetas agrupadas (solo las que tienen contenido) */}
      {!anyContent ? (
        <div className={styles.empty}>
          <p>Este protocolo aún no tiene datos.</p>
          <Link href={`/protocols/${protocol.id}/edit`} className={styles.link}>
            Completar en el editor →
          </Link>
        </div>
      ) : (
        <div className={styles.cards}>
          {datosFields.length > 0 && (
            <Card title="Datos del proyecto">
              <FieldGrid fields={datosFields} />
            </Card>
          )}

          {metodFields.length > 0 && (
            <Card title="Metodología">
              <FieldGrid fields={metodFields} />
            </Card>
          )}

          {team.length > 0 && (
            <Card title="Equipo">
              <ArrowList items={team} />
            </Card>
          )}

          {hasDefinicion && (
            <Card title="Definición">
              {objetivoItems.length > 0 && <ArrowList items={objetivoItems} />}
              {kpis.length > 0 && <KpiTable rows={kpis} />}
            </Card>
          )}

          {protoFields.length > 0 && (
            <Card title="ProtoPersona">
              <FieldGrid fields={protoFields} />
            </Card>
          )}

          {hasDesarrollo && (
            <Card title="Desarrollo de prueba">
              {devFields.length > 0 && <FieldGrid fields={devFields} />}
              {questions.length > 0 && (
                <>
                  <p className={styles.subLabel}>Preguntas del test</p>
                  <div className={styles.qList}>
                    {questions.map((q) => (
                      <QuestionItem key={q.id} q={q} />
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}

          {entregables.length > 0 && (
            <Card title="Entregables">
              <ArrowList items={entregables} />
            </Card>
          )}

          {docs.length > 0 && (
            <Card title="Documentación">
              <ArrowList items={docs} />
            </Card>
          )}
        </div>
      )}

      <LyssnaModal
        isOpen={lyssnaOpen}
        text={lyssnaText}
        onClose={() => setLyssnaOpen(false)}
        onCopy={() => copyLyssnaText(lyssnaText)}
      />

      <ShareLinkModal
        isOpen={shareOpen}
        link={shareLink}
        onClose={() => setShareOpen(false)}
        onCopy={() => copyShareLink(shareLink)}
      />

      <PresentationModal
        isOpen={presentationOpen}
        onClose={() => setPresentationOpen(false)}
        onGenerate={handleGeneratePresentation}
        initialTemplate={savedPresentation.template}
        initialColor={savedPresentation.color}
      />

      <PresentationViewer
        isOpen={viewerOpen}
        protocol={protocol}
        template={viewerCfg.template}
        color={viewerCfg.color}
        onClose={() => setViewerOpen(false)}
        onSave={handleSavePresentation}
        onDownloadPptx={handleDownloadPptx}
        onGoogleSlides={handleGoogleSlides}
      />
    </div>
  )
}
