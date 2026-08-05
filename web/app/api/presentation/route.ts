import { readFile } from 'fs/promises'
import path from 'path'
import type { Protocol } from '@/lib/types'
import { fillPptx } from '@/lib/presentation/pptxFill'
import { colorHex, type PresentationTemplate } from '@/lib/presentation/constants'

// Necesita filesystem (lee las plantillas .pptx del repo) → runtime Node.
export const runtime = 'nodejs'

const TEMPLATE_FILE: Record<PresentationTemplate, string> = {
  minimal: 'Minimal.pptx',
  gradient: 'Gradiante.pptx',
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // quita diacríticos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'presentacion'
  )
}

interface Body {
  protocol: Protocol
  template: PresentationTemplate
  color: string
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return new Response('Cuerpo inválido', { status: 400 })
  }

  const { protocol, template, color } = body
  if (!protocol || (template !== 'minimal' && template !== 'gradient')) {
    return new Response('Parámetros inválidos', { status: 400 })
  }

  try {
    const templatePath = path.join(
      process.cwd(),
      'Presentaciones',
      TEMPLATE_FILE[template]
    )
    const logoPath = path.join(process.cwd(), 'public', 'uix-logo.png')

    const [templateBytes, logoBytes] = await Promise.all([
      readFile(templatePath),
      readFile(logoPath),
    ])

    const out = await fillPptx(
      new Uint8Array(templateBytes),
      new Uint8Array(logoBytes),
      protocol,
      colorHex(color)
    )

    const filename = `${slugify(protocol.name)}-${template}.pptx`
    // Uint8Array → ArrayBuffer explícito para el body de Response.
    const buf = out.buffer.slice(
      out.byteOffset,
      out.byteOffset + out.byteLength
    ) as ArrayBuffer

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[presentation] error generando pptx:', err)
    return new Response('No se pudo generar la presentación', { status: 500 })
  }
}
