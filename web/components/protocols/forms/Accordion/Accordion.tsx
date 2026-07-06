'use client'

import { useState, type ReactNode } from 'react'
import styles from './Accordion.module.css'

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.head}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          ⌄
        </span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </div>
  )
}
