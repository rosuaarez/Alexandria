'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Protocol, ProtocolStatus } from '@/lib/types'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { asArr, asRec, asStr, asStrArr, toMarkdown } from '@/lib/gemini/output'
import styles from './ProtocolOutput.module.css'

interface ProtocolOutputProps {
  protocol: Protocol
}

// --- Sub-componentes reutilizables ---

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon} aria-hidden>
        {icon}
      </span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  )
}

function InfoCard({ children }: { children: ReactNode }) {
  return <div className={styles.infoCard}>{children}</div>
}

function Pill({ children }: { children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className={styles.checklist}>
      {items.map((it, i) => (
        <li key={i}>
          <span className={styles.check} aria-hidden>
            ✓
          </span>
          {it}
        </li>
      ))}
    </ul>
  )
}

function TaskCard({ task, index }: { task: Record<string, unknown>; index: number }) {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskNum}>{asStr(task.numero) || index + 1}</div>
      <div className={styles.taskBody}>
        <div className={styles.taskTop}>
          <h3 className={styles.taskTitle}>{asStr(task.titulo)}</h3>
          {asStr(task.tiempo_estimado) && (
            <Pill>⏱ {asStr(task.tiempo_estimado)}</Pill>
          )}
        </div>
        <p className={styles.taskDesc}>{asStr(task.descripcion)}</p>
        {asStr(task.notas_facilitador) && (
          <p className={styles.taskNote}>
            <strong>Facilitador:</strong> {asStr(task.notas_facilitador)}
          </p>
        )}
      </div>
    </div>
  )
}

function QuestionCard({ q }: { q: Record<string, unknown> }) {
  return (
    <div className={styles.questionCard}>
      <p className={styles.questionText}>{asStr(q.texto)}</p>
      <div className={styles.questionMeta}>
        {asStr(q.tipo) && <Pill>{asStr(q.tipo)}</Pill>}
        {asStr(q.escala) && <span className={styles.metaText}>{asStr(q.escala)}</span>}
      </div>
      {asStr(q.objetivo) && (
        <p className={styles.questionGoal}>Mide: {asStr(q.objetivo)}</p>
      )}
    </div>
  )
}

function RecommendationCard({ rec }: { rec: Record<string, unknown> }) {
  const prioridad = asStr(rec.prioridad).toLowerCase()
  return (
    <div className={styles.recCard}>
      <div className={styles.recTop}>
        <h3 className={styles.recTitle}>{asStr(rec.titulo)}</h3>
        <div className={styles.recBadges}>
          {prioridad && (
            <span className={`${styles.prio} ${styles[`prio_${prioridad}`] ?? ''}`}>
              {prioridad}
            </span>
          )}
          {asStr(rec.esfuerzo) && (
            <Pill>esfuerzo: {asStr(rec.esfuerzo)}</Pill>
          )}
        </div>
      </div>
      <p className={styles.recDesc}>{asStr(rec.descripcion)}</p>
    </div>
  )
}

// --- Vista documento (Express + Completo) ---

function DocumentView({
  d,
  isComplete,
}: {
  d: Record<string, unknown>
  isComplete: boolean
}) {
  const tareas = asArr(d.tareas)
  const preguntas = asArr(d.preguntas_generadas)
  const cierre = asArr(d.preguntas_cierre)
  const guia = asRec(d.guia_facilitador)
  const criterios = asStrArr(d.criterios_exito)
  const proximos = asStrArr(d.proximos_pasos)
  const screener = asRec(d.screener)
  const cronograma = asArr(d.cronograma)
  const riesgos = asArr(d.riesgos)

  return (
    <>
      {asStr(d.objetivo_refinado) && (
        <section className={styles.section}>
          <SectionHeader icon="🎯" title="Objetivo" />
          <p className={styles.paragraph}>{asStr(d.objetivo_refinado)}</p>
        </section>
      )}

      {isComplete && asStr(d.marco_metodologico) && (
        <section className={styles.section}>
          <SectionHeader icon="🧭" title="Marco metodológico" />
          <p className={styles.paragraph}>{asStr(d.marco_metodologico)}</p>
        </section>
      )}

      {asStr(d.introduccion_participante) && (
        <section className={styles.section}>
          <SectionHeader icon="👋" title="Introducción para el participante" />
          <blockquote className={styles.quote}>
            {asStr(d.introduccion_participante)}
          </blockquote>
        </section>
      )}

      {isComplete && Object.keys(screener).length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="🔎" title="Screener de participantes" />
          {asStr(screener.descripcion) && (
            <p className={styles.paragraph}>{asStr(screener.descripcion)}</p>
          )}
          {asArr(screener.preguntas_filtro).map((p, i) => {
            const r = asRec(p)
            return (
              <InfoCard key={i}>
                <p className={styles.questionText}>{asStr(r.texto)}</p>
                {asStr(r.criterio) && (
                  <p className={styles.questionGoal}>Criterio: {asStr(r.criterio)}</p>
                )}
              </InfoCard>
            )
          })}
        </section>
      )}

      {tareas.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="📋" title="Tareas" />
          <div className={styles.stack}>
            {tareas.map((t, i) => (
              <TaskCard key={i} task={asRec(t)} index={i} />
            ))}
          </div>
        </section>
      )}

      {preguntas.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="❓" title="Preguntas generadas" />
          <div className={styles.stack}>
            {preguntas.map((q, i) => (
              <QuestionCard key={i} q={asRec(q)} />
            ))}
          </div>
        </section>
      )}

      {cierre.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="🏁" title="Preguntas de cierre" />
          <Checklist items={cierre.map((q) => asStr(asRec(q).texto))} />
        </section>
      )}

      {Object.keys(guia).length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="🎓" title="Guía del facilitador" />
          {asStr(guia.duracion_total) && (
            <p className={styles.paragraph}>
              <strong>Duración total:</strong> {asStr(guia.duracion_total)}
            </p>
          )}
          <FacilitatorBlock label="Materiales" value={guia.materiales} />
          <FacilitatorBlock label="Antes de empezar" value={guia.antes_de_empezar} />
          <FacilitatorBlock label="Durante la sesión" value={guia.durante_la_sesion} />
          <FacilitatorBlock label="Señales de alerta" value={guia['señales_de_alerta']} />
        </section>
      )}

      {isComplete && asStr(d.plan_analisis) && (
        <section className={styles.section}>
          <SectionHeader icon="📊" title="Plan de análisis" />
          <p className={styles.paragraph}>{asStr(d.plan_analisis)}</p>
        </section>
      )}

      {isComplete && cronograma.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="🗓️" title="Cronograma" />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fase</th>
                <th>Actividad</th>
                <th>Fecha</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {cronograma.map((c, i) => {
                const r = asRec(c)
                return (
                  <tr key={i}>
                    <td>{asStr(r.fase)}</td>
                    <td>{asStr(r.actividad)}</td>
                    <td>{asStr(r.fecha_estimada)}</td>
                    <td>{asStr(r.responsable)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}

      {isComplete && riesgos.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="⚠️" title="Riesgos" />
          <div className={styles.stack}>
            {riesgos.map((rk, i) => {
              const r = asRec(rk)
              return (
                <InfoCard key={i}>
                  <div className={styles.recTop}>
                    <strong>{asStr(r.riesgo)}</strong>
                    {asStr(r.impacto) && <Pill>{asStr(r.impacto)}</Pill>}
                  </div>
                  <p className={styles.paragraph}>{asStr(r.mitigacion)}</p>
                </InfoCard>
              )
            })}
          </div>
        </section>
      )}

      {criterios.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="✅" title="Criterios de éxito" />
          <Checklist items={criterios} />
        </section>
      )}

      {proximos.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="➡️" title="Próximos pasos" />
          <Checklist items={proximos} />
        </section>
      )}
    </>
  )
}

function FacilitatorBlock({ label, value }: { label: string; value: unknown }) {
  const items = asStrArr(value)
  if (!items.length) return null
  return (
    <div className={styles.facBlock}>
      <p className={styles.facLabel}>{label}</p>
      <Checklist items={items} />
    </div>
  )
}

// --- Vista presentación (slides) ---

function slideContent(content: unknown): ReactNode {
  if (typeof content === 'string') return <p className={styles.slideText}>{content}</p>
  if (Array.isArray(content)) {
    return <Checklist items={asStrArr(content)} />
  }
  if (content && typeof content === 'object') {
    return (
      <div className={styles.stack}>
        {Object.entries(content as Record<string, unknown>).map(([k, v]) => (
          <p key={k} className={styles.slideText}>
            <strong>{k}:</strong> {asStr(v)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PresentationView({ d }: { d: Record<string, unknown> }) {
  const slides = asArr(d.slides).map(asRec)
  const [current, setCurrent] = useState(0)

  if (!slides.length) {
    return <p className={styles.paragraph}>La presentación no contiene slides.</p>
  }

  const safeIndex = Math.min(current, slides.length - 1)
  const slide = slides[safeIndex]

  return (
    <div className={styles.presentation}>
      <aside className={styles.slideIndex}>
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.slideThumb} ${i === safeIndex ? styles.slideThumbActive : ''}`}
            onClick={() => setCurrent(i)}
          >
            <span className={styles.thumbNum}>{i + 1}</span>
            <span className={styles.thumbTitle}>{asStr(s.titulo) || asStr(s.tipo)}</span>
          </button>
        ))}
      </aside>

      <div className={styles.slideMain}>
        <div className={styles.slideNav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={safeIndex === 0}
            aria-label="Slide anterior"
          >
            ←
          </button>
          <span className={styles.slideCounter}>
            Slide {safeIndex + 1} de {slides.length}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
            disabled={safeIndex === slides.length - 1}
            aria-label="Slide siguiente"
          >
            →
          </button>
        </div>

        <div className={styles.slideCanvas}>
          {asStr(slide.tipo) && <span className={styles.slideType}>{asStr(slide.tipo)}</span>}
          <h2 className={styles.slideTitle}>{asStr(slide.titulo)}</h2>
          {slideContent(slide.contenido)}
        </div>

        {asStr(slide.notas_presentador) && (
          <div className={styles.presenterNotes}>
            <p className={styles.facLabel}>Notas del presentador</p>
            <p className={styles.slideText}>{asStr(slide.notas_presentador)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PresentationSummary({ d }: { d: Record<string, unknown> }) {
  const hallazgos = asStrArr(d.hallazgos_principales)
  const recomendaciones = asArr(d.recomendaciones_priorizadas)
  const resumen = asStr(d.resumen_ejecutivo)

  if (!resumen && !hallazgos.length && !recomendaciones.length) return null

  return (
    <>
      {resumen && (
        <section className={styles.section}>
          <SectionHeader icon="📝" title="Resumen ejecutivo" />
          <p className={styles.paragraph}>{resumen}</p>
        </section>
      )}
      {hallazgos.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="🔦" title="Hallazgos principales" />
          <Checklist items={hallazgos} />
        </section>
      )}
      {recomendaciones.length > 0 && (
        <section className={styles.section}>
          <SectionHeader icon="🚀" title="Recomendaciones priorizadas" />
          <div className={styles.stack}>
            {recomendaciones.map((r, i) => (
              <RecommendationCard key={i} rec={asRec(r)} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

// --- Export Hub + panel JSON (fiel al original) ---

// Resaltado de sintaxis JSON portado del HTML original (syntaxHL).
function syntaxHighlightJson(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (m) => {
        let cls = styles.jn
        if (/^"/.test(m)) cls = /:$/.test(m) ? styles.jk : styles.js
        else if (/true|false|null/.test(m)) cls = styles.jb
        return `<span class="${cls}">${m}</span>`
      }
    )
}

interface ExportButtonDef {
  key: string
  iconClass: string
  icon: string
  label: string
  desc: string
}

const EXPORT_BUTTONS: ExportButtonDef[] = [
  { key: 'figma', iconClass: 'ebFigma', icon: '🎨', label: 'Figma Make', desc: 'Copia el prompt para generar el diseño' },
  { key: 'pdf', iconClass: 'ebPdf', icon: 'PDF', label: 'Descargar PDF', desc: 'Exporta el protocolo en formato PDF' },
  { key: 'word', iconClass: 'ebWord', icon: 'DOC', label: 'Exportar a Word', desc: 'Descarga un documento editable .doc' },
  { key: 'json', iconClass: 'ebJson', icon: '{ }', label: 'Ver JSON', desc: 'Inspecciona y copia el JSON del protocolo' },
  { key: 'maze', iconClass: 'ebMaze', icon: 'M', label: 'Exportar a Maze', desc: 'JSON compatible con Maze' },
  { key: 'gforms', iconClass: 'ebGforms', icon: 'G', label: 'Google Forms', desc: 'Estructura lista para Google Forms' },
]

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ExportHub({ protocol }: { protocol: Protocol }) {
  const showToast = useUIStore((s) => s.showToast)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const d = asRec(protocol.generatedData)
  const raw = JSON.stringify(d, null, 2)
  const highlighted = syntaxHighlightJson(raw)
  const fileSlug =
    (protocol.name || 'protocolo')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'protocolo'

  const handleExport = (key: string) => {
    switch (key) {
      case 'figma':
        navigator.clipboard
          .writeText(toMarkdown(protocol))
          .then(() => showToast('Prompt copiado para Figma Make ✓', 'success'))
          .catch(() => showToast('No se pudo copiar el prompt', 'error'))
        break
      case 'pdf':
        window.print()
        break
      case 'word':
        downloadFile(toMarkdown(protocol), `${fileSlug}.doc`, 'application/msword')
        showToast('Documento Word descargado ✓', 'success')
        break
      case 'json':
        setJsonOpen((o) => !o)
        break
      case 'maze':
        downloadFile(raw, `${fileSlug}-maze.json`, 'application/json')
        showToast('JSON para Maze descargado ✓', 'success')
        break
      case 'gforms':
        downloadFile(raw, `${fileSlug}-forms.json`, 'application/json')
        showToast('JSON para Google Forms descargado ✓', 'success')
        break
    }
  }

  const copyJson = () => {
    navigator.clipboard
      .writeText(raw)
      .then(() => {
        setCopied(true)
        showToast('JSON copiado ✓', 'success')
        window.setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => showToast('No se pudo copiar el JSON', 'error'))
  }

  return (
    <div className={styles.exportHub}>
      <div className={styles.exportHubHeader}>
        <div className={styles.exportHubIcon}>✦</div>
        <div className={styles.exportHubText}>
          <div className={styles.exportHubTitle}>Exportar protocolo</div>
          <div className={styles.exportHubSub}>
            Lleva el protocolo a tu herramienta favorita
          </div>
        </div>
      </div>

      <div className={styles.exportButtons}>
        {EXPORT_BUTTONS.map((b) => (
          <button
            key={b.key}
            type="button"
            className={styles.exportBtn}
            onClick={() => handleExport(b.key)}
          >
            <span className={`${styles.exportBtnIcon} ${styles[b.iconClass]}`}>
              {b.icon}
            </span>
            <span className={styles.exportBtnBody}>
              <span className={styles.exportBtnLabel}>{b.label}</span>
              <span className={styles.exportBtnDesc}>{b.desc}</span>
            </span>
            <span className={styles.exportBtnArrow}>→</span>
          </button>
        ))}
      </div>

      {jsonOpen && (
        <div className={styles.jsonPanel}>
          <div className={styles.jsonToolbar}>
            <div className={styles.dots}>
              <span className={`${styles.dot} ${styles.dotR}`} />
              <span className={`${styles.dot} ${styles.dotY}`} />
              <span className={`${styles.dot} ${styles.dotG}`} />
            </div>
            <span className={styles.jsonToolbarTitle}>protocol.json</span>
            <div className={styles.jsonToolbarRight}>
              <button
                type="button"
                className={styles.btnCopy}
                onClick={() => downloadFile(raw, `${fileSlug}.json`, 'application/json')}
              >
                ↓ Descargar
              </button>
              <button
                type="button"
                className={`${styles.btnCopy} ${copied ? styles.copied : ''}`}
                onClick={copyJson}
              >
                {copied ? '✓ Copiado' : '⎘ Copiar'}
              </button>
            </div>
          </div>
          <pre
            className={styles.jsonOutput}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}
    </div>
  )
}

// --- Dropdown de estado (footer del output) ---

interface StatusOption {
  value: ProtocolStatus
  label: string
  dot: string
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'draft', label: 'Borrador', dot: 'sdotDraft' },
  { value: 'in-review', label: 'En revisión', dot: 'sdotReview' },
  { value: 'approved', label: 'Aprobado', dot: 'sdotApproved' },
  { value: 'ready', label: 'Listo para ejecutar', dot: 'sdotReady' },
  { value: 'completed', label: 'Completado', dot: 'sdotCompleted' },
  { value: 'changes_requested', label: 'Cambios solicitados', dot: 'sdotChanges' },
]

function StatusDropdown({ protocol }: { protocol: Protocol }) {
  const updateProtocol = useProtocolStore((s) => s.updateProtocol)
  const showToast = useUIStore((s) => s.showToast)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click fuera.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const current = STATUS_OPTIONS.find((o) => o.value === protocol.protoStatus)
  const currentLabel = current?.label ?? protocol.protoStatus

  const handleSelect = (opt: StatusOption) => {
    setOpen(false)
    if (opt.value === protocol.protoStatus) return
    void updateProtocol({ ...protocol, protoStatus: opt.value })
    showToast(`Estado: ${opt.label}`, 'success')
  }

  return (
    <div
      ref={wrapRef}
      className={`${styles.statusBtnWrap} ${open ? styles.open : ''}`}
    >
      <button
        type="button"
        className={styles.statusBtn}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`${styles.statusBtnDot} ${current ? styles[current.dot] : ''}`} />
        {currentLabel}
        <span className={styles.statusBtnChevron}>▾</span>
      </button>

      {open && (
        <div className={styles.statusDropdown} role="listbox">
          <div className={styles.statusDropdownTitle}>Cambiar estado</div>
          {STATUS_OPTIONS.map((opt) => {
            const active = opt.value === protocol.protoStatus
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                className={`${styles.statusOpt} ${active ? styles.statusOptActive : ''}`}
                onClick={() => handleSelect(opt)}
              >
                <span className={`${styles.statusOptDot} ${styles[opt.dot]}`} />
                <span className={styles.statusOptLabel}>{opt.label}</span>
                {active && <span className={styles.statusOptCheck}>✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Componente principal ---

export function ProtocolOutput({ protocol }: ProtocolOutputProps) {
  const showToast = useUIStore((s) => s.showToast)
  const d = asRec(protocol.generatedData)
  const hasOutput = Object.keys(d).length > 0

  if (!hasOutput) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>✨</span>
        <p className={styles.emptyTitle}>Aún no hay output generado</p>
        <p className={styles.emptyText}>
          Usa &quot;Generar con IA&quot; para crear el documento del protocolo.
        </p>
      </div>
    )
  }

  const handlePrint = () => window.print()

  const handleShare = () => {
    showToast('Compartir llega en un próximo sprint', 'info')
  }

  const isPresentation = protocol.type === 'presentation'
  const title =
    asStr(d.titulo) || asStr(d.titulo_presentacion) || protocol.name

  return (
    <div className={styles.wrap}>
      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={handlePrint}>
          🖨️ Imprimir
        </button>
        <button type="button" className={styles.actionBtn} onClick={handleShare}>
          ↗ Compartir
        </button>
      </div>

      <article className={styles.doc}>
        <header className={styles.docHeader}>
          <h1 className={styles.docTitle}>{title}</h1>
          {asStr(d.subtitulo) && <p className={styles.docSubtitle}>{asStr(d.subtitulo)}</p>}
        </header>

        {isPresentation ? (
          <>
            <PresentationView d={d} />
            <PresentationSummary d={d} />
          </>
        ) : (
          <DocumentView d={d} isComplete={protocol.type === 'complete'} />
        )}
      </article>

      <ExportHub protocol={protocol} />

      <footer className={styles.outputFooter}>
        <span className={styles.outputFooterLabel}>Estado del protocolo</span>
        <StatusDropdown protocol={protocol} />
      </footer>
    </div>
  )
}
