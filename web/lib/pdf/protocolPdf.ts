import type { Protocol, QuestionType } from '@/lib/types'
import { asArray, asString } from '@/components/protocols/forms/utils'

type Rec = Record<string, unknown>

// Etiquetas legibles por tipo de pregunta (todas las del modelo actual).
const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  open: 'Abierta',
  likert: 'Escala Likert',
  multiple: 'Opción múltiple',
  yesno: 'Sí / No',
  abtest: 'A/B Test',
  prototype: 'Prototype test',
  instruction: 'Instruction',
  'first-click': 'First click',
  'five-second': 'Five second test',
  survey: 'Survey questions',
  'design-survey': 'Design survey',
  preference: 'Preference test',
  navigation: 'Navigation test',
  'card-sort': 'Card sort',
  'tree-test': 'Tree test',
  'live-website': 'Live website test',
  closed: 'Cerrada',
  scale5: 'Escala (1-5)',
  scale7: 'Escala (1-7)',
  nps: 'NPS',
}

interface PdfField {
  label: string
  value: string
}

interface PdfQuestion {
  n: number
  text: string
  typeLabel: string
  likert: boolean
  options: string[]
}

// Escapa texto para insertarlo en el HTML del documento.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Descarta campos vacíos y arma la lista de pares label/valor.
function pickFields(
  entries: ReadonlyArray<readonly [string, string]>
): PdfField[] {
  return entries
    .filter((e) => e[1].trim() !== '')
    .map((e) => ({ label: e[0], value: e[1] }))
}

function joinTokens(v: unknown): string {
  return asArray<unknown>(v)
    .map((s) => (typeof s === 'string' ? s : ''))
    .filter((s) => s.trim() !== '')
    .join(', ')
}

// Lee las preguntas reales de data.questions ({ id, text, type }).
function parseQuestions(v: unknown): PdfQuestion[] {
  const out: PdfQuestion[] = []
  asArray<unknown>(v).forEach((raw) => {
    const o = (raw ?? {}) as Rec
    const text = asString(o.text)
    if (text.trim() === '') return
    const type = asString(o.type)
    const typeLabel = QUESTION_TYPE_LABELS[type as QuestionType] ?? type ?? 'Pregunta'
    const likert = type === 'likert' || type === 'scale5' || type === 'scale7'
    const options = asArray<unknown>(o.options)
      .map((op) => (typeof op === 'string' ? op : asString(((op ?? {}) as Rec).value)))
      .filter((s) => s.trim() !== '')
    out.push({ n: out.length + 1, text, typeLabel, likert, options })
  })
  return out
}

function fmtDate(iso: string | undefined): string {
  const d = iso ? new Date(iso) : new Date()
  if (Number.isNaN(d.getTime())) return new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fieldsHtml(fields: PdfField[]): string {
  return fields
    .map(
      (f) =>
        `<div class="info-item"><span class="label">${esc(f.label)}</span><span class="value">${esc(f.value)}</span></div>`
    )
    .join('')
}

function sectionHtml(title: string, body: string): string {
  if (!body.trim()) return ''
  return `<h2 class="section-heading">${esc(title)}</h2>${body}`
}

function questionsHtml(questions: PdfQuestion[]): string {
  if (questions.length === 0) {
    return '<p class="empty">Sin preguntas registradas.</p>'
  }
  const items = questions
    .map((q) => {
      let detail = ''
      if (q.likert) {
        const steps = [1, 2, 3, 4, 5]
          .map((s) => `<span class="likert-step">${s}</span>`)
          .join('')
        detail = `<div class="likert">${steps}</div>`
      } else if (q.options.length > 0) {
        detail = `<div class="options">${q.options
          .map((opt) => `<div class="option"><span class="check">○</span>${esc(opt)}</div>`)
          .join('')}</div>`
      }
      return `<li><span class="q-number">Pregunta ${q.n} · ${esc(q.typeLabel)}</span><div class="q-text">${esc(
        q.text
      )}</div>${detail}</li>`
    })
    .join('')
  return `<ul class="questions-list">${items}</ul>`
}

// Estilos del documento (ventana nueva, tema-independiente / siempre claro).
// Todos los valores viven como variables nombradas en :root — sin hex sueltos.
// --pdf-accent = mismo morado de marca que --accent en globals.css.
const PDF_STYLES = `
:root{
  --pdf-text:#1e293b;--pdf-secondary:#475569;--pdf-muted:#94a3b8;
  --pdf-line:#f1f5f9;--pdf-rule:#1e293b;--pdf-accent:#6D28C7;--pdf-bg:#ffffff;
}
*{box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--pdf-text);background:#f8fafc;line-height:1.6;margin:0;padding:40px 20px;-webkit-font-smoothing:antialiased}
.report{max-width:780px;margin:0 auto;background:var(--pdf-bg);padding:56px 64px;box-shadow:0 1px 2px rgba(0,0,0,.05);border-radius:8px}
.report-header{margin-bottom:44px}
.brand{height:24px;margin-bottom:24px}
.report-header h1{font-size:26px;font-weight:700;letter-spacing:-.02em;margin:0 0 6px;color:var(--pdf-text)}
.report-header .subtitle{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--pdf-secondary);font-weight:600}
.tracking{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--pdf-muted);margin-top:14px;padding-top:12px;border-top:1px solid var(--pdf-line)}
h2.section-heading{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--pdf-secondary);margin:36px 0 14px;padding-bottom:6px;border-bottom:2px solid var(--pdf-rule)}
.grid-info{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 40px}
.info-item{display:flex;justify-content:space-between;gap:16px;font-size:13.5px;padding:6px 0;border-bottom:1px solid var(--pdf-line)}
.info-item .label{color:var(--pdf-secondary)}
.info-item .value{font-weight:500;text-align:right}
.text-block{font-size:13.5px;color:var(--pdf-secondary);margin-bottom:14px}
.questions-list{list-style:none;padding:0;margin:16px 0}
.questions-list li{padding:14px 16px;background:#fafafa;border-left:3px solid var(--pdf-accent);margin-bottom:12px;border-radius:0 4px 4px 0}
.questions-list .q-number{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--pdf-muted);display:block;margin-bottom:4px;font-weight:600}
.questions-list .q-text{font-size:14px;color:var(--pdf-text)}
.likert{display:flex;gap:6px;margin-top:8px}
.likert-step{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;border:1px solid #cbd5e1;font-size:12px;font-weight:600;color:var(--pdf-secondary)}
.options{margin-top:6px}
.option{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--pdf-secondary);padding:3px 0}
.list-clean{list-style:none;padding:0;margin:0}
.list-clean li{font-size:13.5px;padding:6px 0;display:flex;gap:8px}
.list-clean li::before{content:"—";color:var(--pdf-muted)}
.empty{font-size:13px;color:var(--pdf-muted);font-style:italic}
.report-footer{margin-top:52px;padding-top:16px;border-top:1px solid var(--pdf-line);display:flex;justify-content:space-between;gap:16px;font-size:11px;color:var(--pdf-muted)}
@media print{
  body{background:#fff;padding:0}
  .report{box-shadow:none;padding:0;max-width:100%}
  @page{size:letter;margin:2cm}
  .info-item,.questions-list li{page-break-inside:avoid}
}
`

// Construye el HTML completo del documento a partir del protocolo.
export function buildProtocolPdfHtml(protocol: Protocol, origin: string): string {
  const data = (protocol.data ?? {}) as Rec

  const tema = asString(data.tema) || protocol.name
  const metodo = asString(data.metodo)
  const title = metodo ? `${tema} (${metodo})` : tema
  const fecha = fmtDate(protocol.updatedAt ?? protocol.createdAt)
  const version = `V${protocol.version ?? 1}`
  const trackingId = protocol._supabaseId ?? protocol.id
  const exportDate = fmtDate(undefined)

  // CONTEXTO DEL PROYECTO
  const contexto = pickFields([
    ['Tema', tema],
    ['Proyecto', asString(data.proyecto)],
    ['Cliente', asString(data.cliente)],
    ['Inicio', asString(data.fechaInicio)],
    ['Presentación de resultados', asString(data.fechaResultados)],
    ['Exportado', exportDate],
  ])

  // METODOLOGÍA
  const fechasApp = [asString(data.fechasAplicacionInicio), asString(data.fechasAplicacionFin)]
    .filter((s) => s.trim() !== '')
    .join(' – ')
  const equipo = asArray<unknown>(data.team)
    .map((m) => {
      const o = (m ?? {}) as Rec
      const name = asString(o.name) || asString(o.nombre)
      return [name, asString(o.rolInvestigacion), asString(o.rolPdu)]
        .filter((s) => s.trim() !== '')
        .join(' — ')
    })
    .filter((s) => s.trim() !== '')
    .join('; ')
  const metodologia = pickFields([
    ['Método', metodo],
    ['Enfoque', asString(data.enfoque)],
    ['Herramientas', joinTokens(data.herramientas)],
    ['Duración', asString(data.duracion)],
    ['Muestra esperada', asString(data.muestra)],
    ['Fechas de aplicación', fechasApp],
    ['Equipo', equipo],
  ])

  // TIPIFICACIÓN DE MUESTRA
  const tipificacion = pickFields([
    ['Tipificación', asString(data.nse)],
    ['Edad', asString(data.edad)],
    ['Nivel digital', asString(data.nivelDigital)],
    ['Género', asString(data.genero)],
    ['Ocupación', asString(data.ocupacion)],
    ['País', asString(data.pais)],
    ['Características', asString(data.caracteristica)],
  ])

  // GUIÓN Y CUESTIONARIO
  const intro = asString(data.intro)
  const cierre = asString(data.cierre)
  const questions = parseQuestions(data.questions)
  const guionBody =
    (intro ? `<div class="text-block"><strong>Introducción:</strong> ${esc(intro)}</div>` : '') +
    (questions.length
      ? '<p class="q-heading" style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.05em;margin-top:16px">Preguntas del test</p>'
      : '') +
    questionsHtml(questions) +
    (cierre ? `<div class="text-block" style="margin-top:14px"><strong>Cierre:</strong> ${esc(cierre)}</div>` : '')

  // ENTREGABLES
  const entregables = asArray<unknown>(data.entregables)
    .map((e) => (typeof e === 'string' ? e : ''))
    .filter((s) => s.trim() !== '')
  const entregablesBody = entregables.length
    ? `<ul class="list-clean">${entregables.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`
    : ''

  return (
    `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">` +
    `<title>${esc(title)} — Alexandría</title><style>${PDF_STYLES}</style></head><body>` +
    `<div class="report">` +
    `<header class="report-header">` +
    `<img class="brand" src="${esc(origin)}/uix-logo.svg" alt="UiX" onerror="this.style.display='none'">` +
    `<h1>${esc(title)}</h1>` +
    `<div class="subtitle">Fecha: ${esc(fecha)} | Versión: ${esc(version)}</div>` +
    `<div class="tracking">ID de Rastreo: ${esc(trackingId)}</div>` +
    `</header>` +
    sectionHtml('Contexto del proyecto', `<div class="grid-info">${fieldsHtml(contexto)}</div>`) +
    sectionHtml('Metodología', `<div class="grid-info">${fieldsHtml(metodologia)}</div>`) +
    sectionHtml('Tipificación de muestra', `<div class="grid-info">${fieldsHtml(tipificacion)}</div>`) +
    sectionHtml('Guión y cuestionario', guionBody) +
    sectionHtml('Entregables', entregablesBody) +
    `<footer class="report-footer">` +
    `<div>Hecho a través de <strong>Alexandría</strong></div>` +
    `<div>Fecha de generación: ${esc(exportDate)}</div>` +
    `</footer>` +
    `</div></body></html>`
  )
}

// Abre el documento en una ventana nueva y lanza el diálogo de impresión.
// Devuelve false si el navegador bloqueó el popup.
export function printProtocolPdf(protocol: Protocol): boolean {
  const origin = window.location.origin
  const html = buildProtocolPdfHtml(protocol, origin)
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return false
  win.document.open()
  win.document.write(html)
  win.document.close()
  win.focus()
  // Espera breve para que el logo cargue antes de imprimir.
  window.setTimeout(() => win.print(), 500)
  return true
}
