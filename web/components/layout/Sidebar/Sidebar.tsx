'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'

// Un item está activo cuando la ruta coincide exacto (dashboard) o por prefijo
// para el resto, de modo que /protocols/[id]/edit resalte "Mis Protocolos".
function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  // Clave del contador a mostrar como badge (por ahora solo 'protocols').
  badge?: 'protocols'
}

interface NavSection {
  label?: string
  items: NavItem[]
}

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

// Estructura fiel al original: secciones con label, dividers entre ellas y
// "Mi Equipo" sin label al final.
const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Principal',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
          <svg {...ICON_PROPS}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        label: 'Mis Protocolos',
        href: '/protocols',
        badge: 'protocols',
        icon: (
          <svg {...ICON_PROPS}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Recursos',
    items: [
      {
        label: 'Biblioteca',
        href: '/library',
        icon: (
          <svg {...ICON_PROPS}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
      {
        label: 'Cápsulas',
        href: '/capsulas',
        icon: (
          <svg {...ICON_PROPS}>
            <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z" />
            <path d="M8.5 8.5l7 7" />
          </svg>
        ),
      },
    ],
  },
  {
    items: [
      {
        label: 'Mi Equipo',
        href: '/team',
        icon: (
          <svg {...ICON_PROPS}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen)
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar)
  const protocolCount = useProtocolStore((s) => s.protocols.length)

  const badgeValue = (key: NavItem['badge']): number | null => {
    if (key === 'protocols') return protocolCount > 0 ? protocolCount : null
    return null
  }

  // Clases globales del HTML original (Sprint 12). `sidebar-mobile-open` es una
  // ayuda propia de Next para el overlay en móvil.
  return (
    <aside className={`sidebar${mobileSidebarOpen ? ' sidebar-mobile-open' : ''}`}>
      {NAV_SECTIONS.map((section, i) => (
        <div key={section.label ?? `section-${i}`}>
          {i > 0 && <div className="sidebar-divider" aria-hidden="true" />}
          {section.label && <div className="sidebar-label">{section.label}</div>}
          {section.items.map((item) => {
            const active = isActiveRoute(pathname, item.href)
            const badge = item.badge ? badgeValue(item.badge) : null
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                onClick={closeMobileSidebar}
              >
                <span className="nav-icon-wrap">{item.icon}</span>
                {item.label}
                {badge != null && <span className="nav-badge">{badge}</span>}
              </Link>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
