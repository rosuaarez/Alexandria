import type { Protocol } from '@/lib/types'
import type { PresentationTemplate } from './constants'

// Pide el .pptx real al API (rellenando la plantilla elegida) y lo descarga.
// Devuelve false si algo falla (el llamador muestra el toast de error).
export async function downloadPresentationPptx(
  protocol: Protocol,
  template: PresentationTemplate,
  color: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protocol, template, color }),
    })
    if (!res.ok) throw new Error(await res.text())
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${protocol.name}-${template}.pptx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}
