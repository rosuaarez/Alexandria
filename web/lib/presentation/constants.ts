export type PresentationTemplate = 'minimal' | 'gradient'

// Paletas por "Color del proyecto". La clave es el label del dropdown; el valor
// es el hex que se aplica como accent1 del tema (.pptx) al generar.
export const PRESENTATION_COLORS: Record<string, string> = {
  'Morado (predeterminado)': '6D28C7',
  Azul: '1D4ED8',
  Verde: '047857',
  Naranja: 'C2410C',
  Rosa: 'BE185D',
}

export function colorHex(label: string): string {
  return PRESENTATION_COLORS[label] ?? PRESENTATION_COLORS['Morado (predeterminado)']
}

// Aclara un hex mezclándolo con blanco (para el segundo stop del degradado).
export function lightenHex(hex: string, amount: number): string {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

// Fondo de la miniatura según plantilla + color elegido.
export function templateBackground(template: PresentationTemplate, colorLabel: string): string {
  const hex = colorHex(colorLabel)
  return template === 'gradient'
    ? `linear-gradient(135deg, #${hex} 0%, ${lightenHex(hex, 0.4)} 100%)`
    : `#${hex}`
}

// Nombre corto del color (sin el sufijo "(predeterminado)").
export function colorShort(label: string): string {
  return label.replace(/\s*\(.*\)$/, '')
}
