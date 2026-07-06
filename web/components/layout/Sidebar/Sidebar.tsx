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
  // Clave del contador a mostrar como badge.
  badge?: 'protocols' | 'presentations'
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

// Estructura fiel al original (public/index.html): "Principal" con Inicio y
// "Mis herramientas" con Mis Protocolos, Biblioteca de Protocolos,
// Presentaciones y Cápsulas. El equipo NO aparece en el sidebar original.
const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Principal',
    items: [
      {
        label: 'Inicio',
        href: '/dashboard',
        icon: (
          <svg {...ICON_PROPS}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Mis herramientas',
    items: [
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
      {
        label: 'Biblioteca de Protocolos',
        href: '/library',
        icon: (
          <svg {...ICON_PROPS}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
      {
        label: 'Presentaciones',
        href: '/presentations',
        badge: 'presentations',
        icon: (
          <svg {...ICON_PROPS}>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ),
      },
      {
        label: 'Cápsulas',
        href: '/capsulas',
        icon: (
          <svg {...ICON_PROPS}>
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
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
  const protocols = useProtocolStore((s) => s.protocols)
  const protocolCount = protocols.length
  const presentationCount = protocols.filter((p) => p.type === 'presentation').length

  const badgeValue = (key: NavItem['badge']): number | null => {
    if (key === 'protocols') return protocolCount > 0 ? protocolCount : null
    if (key === 'presentations') return presentationCount > 0 ? presentationCount : null
    return null
  }

  // En el editor/detalle de un protocolo (/protocols/{id}...), extrae el id para
  // mostrar la sección OUTPUT con el link "← Exportar" (fiel al original).
  const editorMatch = pathname.match(/^\/protocols\/([^/]+)/)
  const editorProtocolId =
    editorMatch && editorMatch[1] !== 'new' ? editorMatch[1] : null

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

      {/* Sección OUTPUT — solo visible en el editor/detalle de un protocolo. */}
      {editorProtocolId && (
        <div>
          <div className="sidebar-divider" aria-hidden="true" />
          <div className="sidebar-label">Output</div>
          <Link
            href={`/protocols/${editorProtocolId}`}
            className={`nav-item${pathname === `/protocols/${editorProtocolId}` ? ' active' : ''}`}
            title="Exportar"
            onClick={closeMobileSidebar}
          >
            <span className="nav-icon-wrap" aria-hidden="true">
              ←
            </span>
            Exportar
          </Link>
        </div>
      )}
    </aside>
  )
}
