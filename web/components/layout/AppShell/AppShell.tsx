'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { PageTransition } from '@/components/ui/PageTransition'
import { useUIStore } from '@/lib/stores/useUIStore'
import styles from './AppShell.module.css'

// El copiloto solo se monta cuando se abre, así no entra en el bundle inicial.
const CopilotPanel = dynamic(
  () => import('@/components/copilot/CopilotPanel').then((m) => m.CopilotPanel),
  { ssr: false }
)

export function AppShell({ children }: { children: React.ReactNode }) {
  const initTheme = useUIStore((s) => s.initTheme)
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen)
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar)
  const pathname = usePathname()

  // Sincroniza el estado del store con la clase ya aplicada por el script inline
  // del root layout (para que el botón de dark mode refleje el valor real).
  useEffect(() => {
    initTheme()
  }, [initTheme])

  // Cierra el sidebar overlay al cambiar de ruta en mobile.
  useEffect(() => {
    closeMobileSidebar()
  }, [pathname, closeMobileSidebar])

  // Estructura y clases fieles al HTML original (Sprint 12 — transplante CSS):
  // .app-shell es un grid; .main contiene el contenido. El estrechamiento al
  // abrir el copiloto lo maneja body.acp-open .main (global), no una clase aquí.
  return (
    <div className="app-shell">
      <Topbar />
      <Sidebar />
      {mobileSidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}
      <main className="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <CopilotPanel />
    </div>
  )
}
