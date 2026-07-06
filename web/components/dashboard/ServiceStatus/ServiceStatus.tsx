'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import styles from './ServiceStatus.module.css'

type Status = 'mock' | 'connected' | 'disconnected'

interface HealthResponse {
  services: { supabase: Status; gemini: Status; auth: Status }
}

const LABELS: Record<Status, string> = {
  connected: 'conectado',
  disconnected: 'sin conexión',
  mock: 'mock',
}

function Dot({ status, label }: { status: Status; label: string }) {
  return (
    <span className={styles.item} title={`${label}: ${LABELS[status]}`}>
      <span className={`${styles.dot} ${styles[status]}`} aria-hidden="true" />
      {label}
    </span>
  )
}

// Indicador de estado de servicios (Sprint 8). Solo visible para el rol leader.
export function ServiceStatus() {
  const role = useAuthStore((s) => s.currentUser?.role)
  const [health, setHealth] = useState<HealthResponse | null>(null)

  useEffect(() => {
    if (role !== 'leader') return
    let active = true
    fetch('/api/health')
      .then((r) => r.json())
      .then((data: HealthResponse) => {
        if (active) setHealth(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [role])

  if (role !== 'leader' || !health) return null

  return (
    <div className={styles.bar}>
      <Dot status={health.services.auth} label="Auth" />
      <Dot status={health.services.supabase} label="Supabase" />
      <Dot status={health.services.gemini} label="Gemini" />
    </div>
  )
}
