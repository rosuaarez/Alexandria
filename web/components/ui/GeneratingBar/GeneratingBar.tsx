'use client'

import { useCopilotStore } from '@/lib/stores/useCopilotStore'
import styles from './GeneratingBar.module.css'

export function GeneratingBar() {
  const isGenerating = useCopilotStore((s) => s.isGenerating)
  if (!isGenerating) return null
  return <div className={styles.bar} role="progressbar" aria-label="Generando con IA" />
}
