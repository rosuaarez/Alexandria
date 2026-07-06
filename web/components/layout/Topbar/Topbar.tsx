'use client'

import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useUIStore } from '@/lib/stores/useUIStore'

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

export function Topbar() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const signOut = useAuthStore((s) => s.signOut)
  const darkMode = useUIStore((s) => s.darkMode)
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode)
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar)

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

      {/* Logo único fiel al original: "Alexandría by [UIX]". */}
      <div className="topbar-logo">
        <span className="alex-brand">
          <span className="alex-brand__name">Alexandría</span>
          <span className="alex-brand__by">by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="alex-brand__uix" src="/uix-logo.svg" alt="UIX" />
        </span>
      </div>

      {/* Bloque de usuario fiel al original: avatar + nombre y email, alineado a la derecha. */}
      <div
        className="topbar-user"
        style={{ marginLeft: 'auto' }}
        title={currentUser?.name ?? 'Usuario'}
      >
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
        title="Cerrar sesión"
      >
        <LogoutIcon />
        Salir
      </button>
    </header>
  )
}
