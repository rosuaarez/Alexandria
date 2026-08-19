import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SHOW_CAPSULAS } from '@/lib/config/flags'

export const metadata: Metadata = {
  title: 'Cápsulas',
}

export default function CapsulasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Bloqueo temporal de la URL directa (mismo flag que oculta el sidebar).
  // El código y la ruta quedan intactos: basta poner SHOW_CAPSULAS en true.
  if (!SHOW_CAPSULAS) notFound()
  return children
}
