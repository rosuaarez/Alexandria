import type { Metadata } from 'next'

// El título corto se combina con el template del root layout → "Presentaciones — Alexandría".
export const metadata: Metadata = {
  title: 'Presentaciones',
  description: 'Genera y gestiona presentaciones de resultados de investigación',
}

export default function PresentationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
