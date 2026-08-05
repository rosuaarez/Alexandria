import type { Protocol } from '@/lib/types'
import { asArray, asString } from '@/components/protocols/forms/utils'
import { questionTypeLabel } from '@/lib/protocols/questionTypeLabels'

type Rec = Record<string, unknown>

export interface SlideField {
  label: string
  value: string
}

// Modelo de diapositiva (todos los campos son STRINGS ya extraídos, nunca
// objetos — así el visualizador jamás muestra "[object Object]").
export type Slide =
  | { kind: 'cover'; kicker: string; title: string; subtitle: string; meta: SlideField[] }
  | { kind: 'fields'; kicker: string; title: string; fields: SlideField[] }
  | { kind: 'tools'; kicker: string; title: string; body: string; chips: string[] }
  | {
      kind: 'metrics'
      kicker: string
      title: string
      stats: { value: string; label: string }[]
      note: string
      kpis: SlideField[]
    }
  | {
      kind: 'questions'
      kicker: string
      title: string
      items: { n: number; label: string; text: string }[]
    }
  | { kind: 'list'; kicker: string; title: string; body: string; items: string[] }
  | { kind: 'closing'; title: string; subtitle: string }

// Descarta pares con valor vacío (para no mostrar campos en blanco).
function fields(entries: [string, string][]): SlideField[] {
  return entries
    .filter(([, v]) => v.trim() !== '')
    .map(([label, value]) => ({ label, value }))
}

function fmtDate(iso: string): string {
  const d = iso ? new Date(iso) : null
  if (!d || Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const TOOL_RENAME: Record<string, string> = { Maze: 'Lyssna' }

// Construye la lista de diapositivas a partir del protocolo. Cada valor pasa por
// asString/asArray, garantizando primitivos (corrige el bug de "[object Object]").
export function buildSlides(protocol: Protocol): Slide[] {
  const data = (protocol.data ?? {}) as Rec

  const name = protocol.name
  const proyecto = asString(data.proyecto) || asString(data.tema) || name
  const tema = asString(data.tema) || name
  const cliente = asString(data.cliente)
  const metodo = asString(data.metodo)
  const objetivo = asString(data.objetivo) || asString(data.objetivoGeneral)
  const trackingId = protocol._supabaseId ?? protocol.id

  const herramientas = asArray<unknown>(data.herramientas)
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
      return { label: asString(o.tipo), value: asString(o.descripcion) }
    })
    .filter((r) => r.label || r.value)

  const questions = asArray<unknown>(data.questions)
    .map((raw) => {
      const o = (raw ?? {}) as Rec
      return { type: asString(o.type), text: asString(o.text) }
    })
    .filter((q) => q.text.trim() !== '')
    .map((q, i) => ({
      n: i + 1,
      label: questionTypeLabel(q.type).toUpperCase(),
      text: q.text,
    }))

  const entregables = asArray<unknown>(data.entregables)
    .map((e) => (typeof e === 'string' ? e : asString((e as Rec)?.value)))
    .filter((s) => s.trim() !== '')

  const fechaAplicacion = [
    asString(data.fechasAplicacionInicio),
    asString(data.fechasAplicacionFin),
  ]
    .filter((s) => s.trim() !== '')
    .map(fmtDate)
    .join(' – ')

  const slides: Slide[] = []

  // 1 — Portada
  slides.push({
    kind: 'cover',
    kicker: metodo || 'Protocolo de investigación',
    title: proyecto,
    subtitle:
      objetivo ||
      `Evaluación de experiencia de usuario para ${cliente || proyecto}.`,
    meta: fields([
      ['Cliente', cliente],
      ['ID', trackingId],
      ['Fecha', fmtDate(asString(data.fechaResultados))],
    ]),
  })

  // 2 — Ficha general
  slides.push({
    kind: 'fields',
    kicker: 'Contexto del proyecto',
    title: 'Ficha general',
    fields: fields([
      ['Proyecto', proyecto],
      ['Cliente', cliente],
      ['Tema', tema],
      ['ID de rastreo', trackingId],
      ['Inicio', fmtDate(asString(data.fechaInicio))],
      ['Presentación de resultados', fmtDate(asString(data.fechaResultados))],
      ['Aplicación del test', fechaAplicacion],
      ['Equipo', equipo],
    ]),
  })

  // 3 — Método y enfoque
  slides.push({
    kind: 'tools',
    kicker: 'Metodología de UX',
    title: 'Método y enfoque',
    body:
      asString(data.enfoque) ||
      (metodo
        ? `${metodo} para entender efectividad, patrones clave y puntos de fricción en la interacción.`
        : 'Metodología de investigación de experiencia de usuario.'),
    chips: herramientas,
  })

  // 4 — Muestra y métricas
  slides.push({
    kind: 'metrics',
    kicker: 'Muestra y métricas',
    title: 'Muestra y KPIs',
    stats: [
      { value: asString(data.muestra) || '—', label: 'Muestra total' },
      { value: asString(data.duracion) || '—', label: 'Duración del test' },
    ],
    note: asString(data.razonMuestra),
    kpis,
  })

  // 5 — Tipificación de muestra (solo si hay datos)
  const tipificacion = fields([
    ['Características', asString(data.caracteristica)],
    ['Edad', asString(data.edad)],
    ['Género', asString(data.genero)],
    ['Nivel digital', asString(data.nivelDigital)],
    ['Ocupación', asString(data.ocupacion)],
  ])
  if (tipificacion.length > 0) {
    slides.push({
      kind: 'fields',
      kicker: 'Perfil',
      title: 'Tipificación de muestra',
      fields: tipificacion,
    })
  }

  // 6 — Desarrollo de la prueba
  const desarrollo = fields([
    ['Introducción', asString(data.intro)],
    ['Cierre', asString(data.cierre)],
    ['Link de la prueba', asString(data.testUrl)],
    ['Herramienta', asString(data.herramientaPrueba)],
  ])
  if (desarrollo.length > 0) {
    slides.push({
      kind: 'fields',
      kicker: 'Guión',
      title: 'Desarrollo de la prueba',
      fields: desarrollo,
    })
  }

  // 7 — Preguntas del test
  if (questions.length > 0) {
    slides.push({
      kind: 'questions',
      kicker: 'Cuestionario',
      title: 'Preguntas del test',
      items: questions,
    })
  }

  // 8 — Entregables (solo si hay)
  if (entregables.length > 0) {
    slides.push({
      kind: 'list',
      kicker: 'Entregables',
      title: 'Entregables del protocolo',
      body: '',
      items: entregables,
    })
  }

  // 9 — Cierre
  slides.push({ kind: 'closing', title: '¡Gracias!', subtitle: proyecto })

  return slides
}
