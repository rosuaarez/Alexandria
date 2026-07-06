import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Equipo',
}

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
