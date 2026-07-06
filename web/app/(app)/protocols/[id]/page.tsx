'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'
import { StatusPill } from '@/components/ui/StatusPill'
import styles from './output.module.css'

export default function ProtocolOutputPage() {
  const params = useParams<{ id: string }>()
  const protocol = useProtocolStore((s) => s.getProtocolById(params.id))

  if (!protocol) {
    return (
      <div className={styles.empty}>
        <p>Protocolo no encontrado.</p>
        <Link href="/protocols" className={styles.link}>
          ← Volver a Mis Protocolos
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{protocol.name}</h1>
          <StatusPill status={protocol.protoStatus} size="sm" />
        </div>
        <Link href={`/protocols/${protocol.id}/edit`} className={styles.editBtn}>
          Editar
        </Link>
      </header>

      <div className={styles.placeholder}>
        <span className={styles.icon}>✨</span>
        <p className={styles.phTitle}>Output generado</p>
        <p className={styles.phText}>
          La generación del protocolo con IA (Gemini) se implementa en el Sprint
          4. Aquí se mostrará el resultado generado.
        </p>
      </div>
    </div>
  )
}
