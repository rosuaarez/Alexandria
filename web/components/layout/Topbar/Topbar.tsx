'use client'

import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useCopilotStore } from '@/lib/stores/useCopilotStore'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  )
}

// Ícono del bloque AI Copilot del topbar (fiel al original: globo con órbitas).
function CopilotGlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  )
}

export function Topbar() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const signOut = useAuthStore((s) => s.signOut)
  const darkMode = useUIStore((s) => s.darkMode)
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode)
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar)
  const copilotOpen = useCopilotStore((s) => s.isOpen)
  const toggleCopilot = useCopilotStore((s) => s.toggleCopilot)

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar-hamburger"
        onClick={toggleMobileSidebar}
        aria-label="Abrir menú de navegación"
        title="Menú"
      >
        <MenuIcon />
      </button>

      <div className="topbar-logo">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 20,
            color: 'var(--accent)',
          }}
        >
          Alexandría
        </span>
        <span className="topbar-badge">UIX</span>
      </div>

      <div className="topbar-divider" />

      <button
        type="button"
        className="darkmode-btn"
        onClick={toggleCopilot}
        aria-pressed={copilotOpen}
        title="Copiloto Alexandria"
      >
        ✨ Copiloto
      </button>

      <button
        type="button"
        className="darkmode-btn"
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        title={darkMode ? 'Modo claro' : 'Modo oscuro'}
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      <button
        type="button"
        className="logout-btn"
        onClick={signOut}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      >
        <LogoutIcon />
      </button>

      {/* Bloque de usuario fiel al original: avatar con gradiente + nombre y email. */}
      <div className="topbar-user" title={currentUser?.name ?? 'Usuario'}>
        <div className="topbar-avatar" aria-hidden="true">
          {currentUser?.initials ?? '—'}
        </div>
        <div className="topbar-user-info">
          <span className="topbar-user-name">
            {currentUser?.name ?? 'Usuario'}
          </span>
          <span className="topbar-user-email">
            {currentUser?.email ?? ''}
          </span>
        </div>
      </div>

      {/* Bloque AI Copilot en el topbar — visible solo cuando el copiloto está abierto. */}
      {copilotOpen && (
        <div className="acp-topbar-block">
          <div className="acp-topbar-icon">
            <CopilotGlobeIcon />
          </div>
          <div className="acp-topbar-info">
            <div className="acp-topbar-title">AI Copilot</div>
            <div className="acp-topbar-sub">Asistente de investigación UX</div>
          </div>
        </div>
      )}
    </header>
  )
}
