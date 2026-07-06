import type { Protocol } from '@/lib/types'

// --- Lectores seguros (generatedData es Record<string, unknown>) ---

export function asRec(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {}
}

export function asStr(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

export function asArr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

export function asStrArr(v: unknown): string[] {
  return asArr(v).map(asStr).filter(Boolean)
}

// --- Conversión a Markdown ---

function mdList(items: string[]): string {
  return items.map((i) => `- ${i}`).join('\n')
}

function contentToText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return asStrArr(content).join('\n')
  if (content && typeof content === 'object') {
    return Object.entries(content as Record<string, unknown>)
      .map(([k, val]) => `**${k}:** ${asStr(val)}`)
      .join('\n')
  }
  return ''
}

export function toMarkdown(protocol: Protocol): string {
  const d = asRec(protocol.generatedData)
  const lines: string[] = []

  const title = asStr(d.titulo) || asStr(d.titulo_presentacion) || protocol.name
  lines.push(`# ${title}`)

  const subtitle = asStr(d.subtitulo)
  if (subtitle) lines.push(`_${subtitle}_`)

  const objetivo = asStr(d.objetivo_refinado)
  if (objetivo) lines.push(`\n## Objetivo\n${objetivo}`)

  const resumen = asStr(d.resumen_ejecutivo)
  if (resumen) lines.push(`\n## Resumen ejecutivo\n${resumen}`)

  const intro = asStr(d.introduccion_participante)
  if (intro) lines.push(`\n## Introducción para el participante\n${intro}`)

  const marco = asStr(d.marco_metodologico)
  if (marco) lines.push(`\n## Marco metodológico\n${marco}`)

  const tareas = asArr(d.tareas)
  if (tareas.length) {
    lines.push('\n## Tareas')
    tareas.forEach((t, i) => {
      const r = asRec(t)
      const num = asStr(r.numero) || String(i + 1)
      lines.push(`\n### ${num}. ${asStr(r.titulo)}`)
      if (r.descripcion) lines.push(asStr(r.descripcion))
      if (r.tiempo_estimado) lines.push(`⏱ ${asStr(r.tiempo_estimado)}`)
      if (r.notas_facilitador) lines.push(`> ${asStr(r.notas_facilitador)}`)
    })
  }

  const preguntas = asArr(d.preguntas_generadas)
  if (preguntas.length) {
    lines.push('\n## Preguntas')
    preguntas.forEach((q) => {
      const r = asRec(q)
      lines.push(`- **${asStr(r.texto)}** _(${asStr(r.tipo)})_`)
      if (r.objetivo) lines.push(`  - Objetivo: ${asStr(r.objetivo)}`)
    })
  }

  const cierre = asArr(d.preguntas_cierre)
  if (cierre.length) {
    lines.push('\n## Preguntas de cierre')
    lines.push(mdList(cierre.map((q) => asStr(asRec(q).texto))))
  }

  const guia = asRec(d.guia_facilitador)
  if (Object.keys(guia).length) {
    lines.push('\n## Guía del facilitador')
    if (guia.duracion_total) lines.push(`**Duración total:** ${asStr(guia.duracion_total)}`)
    const blocks: [string, unknown][] = [
      ['Materiales', guia.materiales],
      ['Antes de empezar', guia.antes_de_empezar],
      ['Durante la sesión', guia.durante_la_sesion],
      ['Señales de alerta', guia['señales_de_alerta']],
    ]
    blocks.forEach(([label, val]) => {
      const arr = asStrArr(val)
      if (arr.length) lines.push(`\n**${label}:**\n${mdList(arr)}`)
    })
  }

  const planAnalisis = asStr(d.plan_analisis)
  if (planAnalisis) lines.push(`\n## Plan de análisis\n${planAnalisis}`)

  const riesgos = asArr(d.riesgos)
  if (riesgos.length) {
    lines.push('\n## Riesgos')
    riesgos.forEach((rk) => {
      const r = asRec(rk)
      lines.push(`- **${asStr(r.riesgo)}** (${asStr(r.impacto)}) — ${asStr(r.mitigacion)}`)
    })
  }

  const criterios = asStrArr(d.criterios_exito)
  if (criterios.length) lines.push(`\n## Criterios de éxito\n${mdList(criterios)}`)

  const proximos = asStrArr(d.proximos_pasos)
  if (proximos.length) lines.push(`\n## Próximos pasos\n${mdList(proximos)}`)

  const slides = asArr(d.slides)
  if (slides.length) {
    lines.push('\n## Slides')
    slides.forEach((s, i) => {
      const r = asRec(s)
      lines.push(`\n### Slide ${i + 1} — ${asStr(r.titulo)} _(${asStr(r.tipo)})_`)
      const c = contentToText(r.contenido)
      if (c) lines.push(c)
      if (r.notas_presentador) lines.push(`> Notas: ${asStr(r.notas_presentador)}`)
    })
  }

  const recs = asArr(d.recomendaciones_priorizadas)
  if (recs.length) {
    lines.push('\n## Recomendaciones priorizadas')
    recs.forEach((rc) => {
      const r = asRec(rc)
      lines.push(
        `- **${asStr(r.titulo)}** (prioridad: ${asStr(r.prioridad)}, esfuerzo: ${asStr(r.esfuerzo)})\n  ${asStr(r.descripcion)}`
      )
    })
  }

  return lines.join('\n')
}
