'use client'

import { usePathname } from 'next/navigation'
import styles from './PageTransition.module.css'

// Aplica una animación fadeInUp cada vez que cambia la ruta usando el pathname
// como key, de modo que React remonta el wrapper y reinicia la animación CSS.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className={styles.pageTransition}>
      {children}
    </div>
  )
}
