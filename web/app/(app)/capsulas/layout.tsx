import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cápsulas',
}

export default function CapsulasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
