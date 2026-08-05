import JSZip from 'jszip'
import type { Protocol } from '@/lib/types'
import { asArray, asString } from '@/components/protocols/forms/utils'
import { questionTypeLabel } from '@/lib/protocols/questionTypeLabels'

type Rec = Record<string, unknown>

/* ── Helpers XML ──────────────────────────────────────────────────────────── */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

// Reemplaza el texto de las corridas (<a:t>) cuyo contenido COMPLETO coincide
// con una clave del mapa. Trabaja solo sobre texto (nunca sobre atributos XML),
// evitando corromper posiciones/tamaños del diseño.
function replaceExactRuns(xml: string, map: Map<string, string>): string {
  return xml.replace(/<a:t>([^<]*)<\/a:t>/g, (m, inner: string) => {
    // Compara sin espacios de borde, pero los conserva en la salida (algunas
    // corridas del diseño llevan un espacio inicial intencional).
    const core = unescapeXml(inner).trim()
    const v = map.get(core)
    if (v === undefined) return m
    const lead = inner.match(/^\s*/)![0]
    const trail = inner.match(/\s*$/)![0]
    return `<a:t>${lead}${escapeXml(v)}${trail}</a:t>`
  })
}

// Reemplaza secuencialmente las corridas iguales a `sample` con los valores
// dados (para campos con el MISMO texto de ejemplo, p. ej. dos fechas).
function replaceRunsSequential(
  xml: string,
  sample: string,
  values: (string | undefined)[]
): string {
  let i = 0
  return xml.replace(/<a:t>([^<]*)<\/a:t>/g, (m, inner: string) => {
    if (unescapeXml(inner).trim() !== sample) return m
    const v = values[i]
    i += 1
    if (!v) return m
    const lead = inner.match(/^\s*/)![0]
    const trail = inner.match(/\s*$/)![0]
    return `<a:t>${lead}${escapeXml(v)}${trail}</a:t>`
  })
}

/* ── Lectura de datos del protocolo ───────────────────────────────────────── */

function fmtDate(iso: string): string {
  const d = iso ? new Date(iso) : null
  if (!d || Number.isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd} / ${mm} / ${d.getFullYear()}`
}

// El proyecto migró de "Maze" a "Lyssna": normaliza al mostrar.
const TOOL_RENAME: Record<string, string> = { Maze: 'Lyssna' }

interface Vals {
  proyecto: string
  tema: string
  cliente: string
  metodo: string
  objetivo: string
  trackingId: string
  tools: string[]
  muestra: string
  duracion: string
  razonMuestra: string
  edad: string
  genero: string
  nivelDigital: string
  ocupacion: string
  caracteristica: string
  equipo: string
  intro: string
  cierre: string
  fechaInicio: string
  fechaResultados: string
  fechaAplicacion: string
  fechaPresentacion: string
  kpis: { tipo: string; descripcion: string }[]
  questions: { typeLabel: string; text: string }[]
}

function readValues(protocol: Protocol): Vals {
  const data = (protocol.data ?? {}) as Rec

  const tools = asArray<unknown>(data.herramientas)
    .map((s) => (typeof s === 'string' ? TOOL_RENAME[s] ?? s : ''))
    .filter((s) => s.trim() !== '')

  const equipo = asArray<unknown>(data.team)
    .map((m) => {
      const o = (m ?? {}) as Rec
      return asString(o.name) || asString(o.nombre)
    })
    .filter((s) => s.trim() !== '')
    .join(', ')

  const kpis = asArray<unknown>(data.kpis)
    .map((k) => {
      const o = (k ?? {}) as Rec
      return { tipo: asString(o.tipo), descripcion: asString(o.descripcion) }
    })
    .filter((r) => r.tipo || r.descripcion)

  const questions = asArray<unknown>(data.questions)
    .map((raw) => {
      const o = (raw ?? {}) as Rec
      return { typeLabel: questionTypeLabel(asString(o.type)), text: asString(o.text) }
    })
    .filter((q) => q.text.trim() !== '')

  const fechasApp = [
    asString(data.fechasAplicacionInicio),
    asString(data.fechasAplicacionFin),
  ]
    .filter((s) => s.trim() !== '')
    .join(' – ')

  const name = protocol.name
  return {
    proyecto: asString(data.proyecto) || asString(data.tema) || name,
    tema: asString(data.tema) || name,
    cliente: asString(data.cliente),
    metodo: asString(data.metodo),
    objetivo: asString(data.objetivo) || asString(data.objetivoGeneral),
    trackingId: protocol._supabaseId ?? protocol.id,
    tools,
    muestra: asString(data.muestra),
    duracion: asString(data.duracion),
    razonMuestra: asString(data.razonMuestra),
    edad: asString(data.edad),
    genero: asString(data.genero),
    nivelDigital: asString(data.nivelDigital),
    ocupacion: asString(data.ocupacion),
    caracteristica: asString(data.caracteristica),
    equipo,
    intro: asString(data.intro),
    cierre: asString(data.cierre),
    fechaInicio: asString(data.fechaInicio),
    fechaResultados: asString(data.fechaResultados),
    fechaAplicacion: fechasApp,
    fechaPresentacion: fmtDate(asString(data.fechaResultados)),
    kpis,
    questions,
  }
}

/* ── Mapa de reemplazos (texto de ejemplo → dato real) ───────────────────────
   Las claves son el texto EXACTO de las plantillas Minimal.pptx / Gradiante.pptx
   (idénticas en texto). Solo se agrega una entrada cuando hay dato real, así los
   campos vacíos conservan el texto de ejemplo y ninguna slide queda en blanco. */

const Q_SAMPLES: { label: string; desc: string }[] = [
  {
    label: 'PREGUNTA 1 — TEXTO ABIERTO',
    desc: 'Pregunta cualitativa para explorar impresiones iniciales y comprensión del concepto del Botón de Pago.',
  },
  {
    label: 'PREGUNTA 2 — ESCALA LIKERT (FACILIDAD DE USO)',
    desc: '¿Qué tan fácil o difícil fue completar el proceso de pago?',
  },
  {
    label: 'PREGUNTA 3 — OPCIÓN MÚLTIPLE',
    desc: 'Selección de los factores o atributos que generaron mayor confianza durante la transacción.',
  },
]

function buildExactMap(v: Vals): Map<string, string> {
  const m = new Map<string, string>()
  const set = (sample: string, value: string) => {
    if (value && value.trim() !== '') m.set(sample, value)
  }

  set('Botón de Pago', v.proyecto)
  set('Prueba de Usabilidad (Alexandría)', v.tema)
  set('Compensalia', v.cliente)
  set('botn-de-pago-pdu-a-2026-07-06-v1', v.trackingId)
  set('07 / 08 / 2026', v.fechaPresentacion)
  if (v.metodo) set('Prueba de Usabilidad:', `${v.metodo}:`)
  set(
    'Evaluación de experiencia de usuario e iteración del flujo transaccional para Compensalia.',
    v.objetivo ||
      `Evaluación de experiencia de usuario para ${v.cliente || v.proyecto}.`
  )
  set('UX Research & Stakeholder', v.equipo)

  // Herramientas (dos corridas en la prosa: "… a través de Maze y … en Figma.")
  if (v.tools[0]) set('Maze', v.tools[0])
  if (v.tools[1]) set('Figma', v.tools[1])

  // Muestra y métricas
  set('200', v.muestra)
  set('1 hr', v.duracion)
  set(
    'Basado en los principios de investigación cualitativa de UX, un análisis iterativo permite detectar la mayoría de problemas de usabilidad con grupos clave para optimizar ágilmente el diseño.',
    v.razonMuestra
  )
  if (v.kpis[0]) {
    set('Completitud de Tarea', v.kpis[0].tipo)
    set('task_completion', v.kpis[0].descripcion)
  }
  if (v.kpis[1]) {
    set('Efectividad de Navegación', v.kpis[1].tipo)
    set('first_click', v.kpis[1].descripcion)
  }

  // Tipificación de muestra
  set('18 - 30 años', v.edad)
  set('Masculino', v.genero)
  set('Básico', v.nivelDigital)
  set('Estudiante', v.ocupacion)
  set(
    'Usuarios acostumbrados a flujos digitales sencillos, con expectativa de respuesta inmediata y poca tolerancia a procesos de pago complejos.',
    v.caracteristica
  )

  // Desarrollo de la prueba
  set(
    'Mensaje inicial orientativo que establece el objetivo de la actividad, asegurando que se evalúa la interfaz y no las capacidades del usuario.',
    v.intro
  )
  set(
    'Agradecimiento final y recopilación de comentarios abiertos sobre la claridad y confianza que transmitió el flujo de pago.',
    v.cierre
  )

  // Fecha de aplicación (única, sin ambigüedad)
  set('2026-08-06', v.fechaAplicacion)

  // Preguntas del test (hasta 3, límite del diseño de la plantilla)
  v.questions.slice(0, 3).forEach((q, i) => {
    const s = Q_SAMPLES[i]
    set(s.label, `PREGUNTA ${i + 1} — ${q.typeLabel.toUpperCase()}`)
    set(s.desc, q.text)
  })

  return m
}

/* ── Inyección del logo ───────────────────────────────────────────────────── */

const LOGO_PATH = 'media/uixlogo.png'
const LOGO_RID = 'rIdUixLogo'

// <p:pic> del logo en la esquina inferior derecha (slide 12192000×6858000 EMU).
function logoPicXml(id: number): string {
  const cx = 1500000
  const cy = 630000
  const x = 12192000 - cx - 250000
  const y = 6858000 - cy - 220000
  return (
    `<p:pic>` +
    `<p:nvPicPr>` +
    `<p:cNvPr id="${id}" name="UiX Logo"/>` +
    `<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>` +
    `<p:nvPr/>` +
    `</p:nvPicPr>` +
    `<p:blipFill><a:blip r:embed="${LOGO_RID}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>` +
    `<p:spPr>` +
    `<a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>` +
    `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>` +
    `</p:spPr>` +
    `</p:pic>`
  )
}

function injectLogoIntoSlide(slideXml: string, id: number): string {
  // Inserta el <p:pic> justo antes de cerrar el árbol de formas.
  return slideXml.replace('</p:spTree>', `${logoPicXml(id)}</p:spTree>`)
}

function addLogoRel(relsXml: string): string {
  if (relsXml.includes(LOGO_RID)) return relsXml
  const rel =
    `<Relationship Id="${LOGO_RID}" ` +
    `Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" ` +
    `Target="../${LOGO_PATH}"/>`
  return relsXml.replace('</Relationships>', `${rel}</Relationships>`)
}

const EMPTY_RELS =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`

/* ── Color de acento (best-effort) ────────────────────────────────────────── */

function applyAccent(themeXml: string, hex: string): string {
  return themeXml.replace(
    /(<a:accent1>\s*<a:srgbClr val=")[0-9A-Fa-f]{6}("\s*\/>\s*<\/a:accent1>)/,
    `$1${hex.toUpperCase()}$2`
  )
}

/* ── API principal ────────────────────────────────────────────────────────── */

export async function fillPptx(
  templateBytes: Uint8Array,
  logoBytes: Uint8Array,
  protocol: Protocol,
  accentHex: string
): Promise<Uint8Array> {
  const zip = await JSZip.loadAsync(templateBytes)

  const values = readValues(protocol)
  const exact = buildExactMap(values)

  // Media del logo (una sola copia).
  zip.file(`ppt/${LOGO_PATH}`, logoBytes)

  // Recorre todas las slides.
  const slideNames = Object.keys(zip.files).filter((n) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(n)
  )

  for (const name of slideNames) {
    const num = Number(name.match(/slide(\d+)\.xml$/)![1])
    let xml = await zip.file(name)!.async('string')

    // Fechas ambiguas de la slide 2 (dos corridas iguales "2026-08-07").
    if (num === 2) {
      xml = replaceRunsSequential(xml, '2026-08-07', [
        values.fechaInicio,
        values.fechaResultados,
      ])
    }

    xml = replaceExactRuns(xml, exact)
    xml = injectLogoIntoSlide(xml, 90000 + num)
    zip.file(name, xml)

    // Relación del logo en las rels de la slide (crea el archivo si falta).
    const relsName = `ppt/slides/_rels/slide${num}.xml.rels`
    const relsFile = zip.file(relsName)
    const relsXml = relsFile ? await relsFile.async('string') : EMPTY_RELS
    zip.file(relsName, addLogoRel(relsXml))
  }

  // Color de acento del tema (best-effort).
  const themeName = 'ppt/theme/theme1.xml'
  const themeFile = zip.file(themeName)
  if (themeFile) {
    const themeXml = await themeFile.async('string')
    zip.file(themeName, applyAccent(themeXml, accentHex))
  }

  return zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  })
}
