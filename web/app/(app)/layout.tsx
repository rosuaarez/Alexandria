import { AppShell } from '@/components/layout/AppShell'
import { DataProvider } from '@/components/providers/DataProvider'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // El userId lo toma DataProvider de la sesión actual (store de Auth):
  // MOCK_USER con USE_REAL_AUTH=false, o el usuario externo cuando está activo.
  return (
    <DataProvider>
      <AppShell>{children}</AppShell>
    </DataProvider>
  )
}
