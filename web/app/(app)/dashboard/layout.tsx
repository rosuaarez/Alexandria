import type { Metadata } from 'next'

// El título corto se combina con el template del root layout → "Dashboard — Alexandría".
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tu centro de investigación UX',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
