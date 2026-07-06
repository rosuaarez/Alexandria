'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

export interface Crumb {
  label: string
  href?: string
}

// Migas de pan. El último elemento (o cualquiera sin href) se renderiza como texto
// no clickeable; los anteriores como links en color de acento.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className={styles.separator} aria-hidden="true">
                ›
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
