import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
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
  // Si alguien entra a /capsulas por URL, se le redirige a Inicio.
  // El código y la ruta quedan intactos: basta poner SHOW_CAPSULAS en true.
  if (!SHOW_CAPSULAS) redirect('/dashboard')
  return children
}
