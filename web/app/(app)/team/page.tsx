'use client'

import { useMemo, useState } from 'react'
import type { TeamMember, TeamRole } from '@/lib/types'
import { useTeamStore, CURRENT_TEAM_MEMBER } from '@/lib/stores/useTeamStore'
import { MOCK_TEAM_ACTIVITY } from '@/lib/data/mockTeam'
import { Avatar, Skeleton } from '@/components/ui'
import { InviteModal } from '@/components/team/InviteModal'
import { MemberRow } from '@/components/team/MemberRow'
import { MemberStats } from '@/components/team/MemberStats'
import styles from './team.module.css'

export default function TeamPage() {
  const members = useTeamStore((s) => s.members)
  const loading = useTeamStore((s) => s.loading)
  const inviteMember = useTeamStore((s) => s.inviteMember)
  const updateMemberRole = useTeamStore((s) => s.updateMemberRole)
  const removeMember = useTeamStore((s) => s.removeMember)

  const [inviteOpen, setInviteOpen] = useState(false)
  const [statsMember, setStatsMember] = useState<TeamMember | null>(null)

  const metrics = useMemo(() => {
    const total = members.length
    const researchers = members.filter((m) => m.role === 'researcher').length
    const protocols = members.reduce((sum, m) => sum + m.protocolsCount, 0)
    return { total, researchers, protocols }
  }, [members])

  const handleInvite = (email: string, role: TeamRole) => {
    void inviteMember(email, role)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Mi Equipo</h1>
          <p className={styles.subtitle}>Gestiona tu equipo de investigación</p>
        </div>
        <button
          type="button"
          className={styles.inviteBtn}
          onClick={() => setInviteOpen(true)}
        >
          + Invitar colaborador
        </button>
      </header>

      <section className={styles.metrics} aria-label="Métricas del equipo">
        <MetricCard
          value={metrics.total}
          label="Miembros"
          loading={loading}
        />
        <MetricCard
          value={metrics.researchers}
          label="Investigadores"
          loading={loading}
        />
        <MetricCard
          value={metrics.protocols}
          label="Protocolos totales"
          loading={loading}
        />
      </section>

      <section className={styles.tableWrap}>
        <h2 className={styles.tableTitle}>Miembros del equipo</h2>
        {loading ? (
          <div className={styles.skeletonList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width="100%" height="48px" borderRadius="8px" />
            ))}
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} aria-label="Avatar" />
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Rol</th>
                  <th className={styles.th}>Protocolos</th>
                  <th className={styles.th}>Estado</th>
                  <th className={styles.th} aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    isCurrentUser={m.id === CURRENT_TEAM_MEMBER.id}
                    onChangeRole={(role) => void updateMemberRole(m.id, role)}
                    onRemove={() => void removeMember(m.id)}
                    onSelect={() => setStatsMember(m)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.activityWrap}>
        <h2 className={styles.tableTitle}>Actividad reciente</h2>
        {loading ? (
          <div className={styles.skeletonList}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} width="100%" height="44px" borderRadius="8px" />
            ))}
          </div>
        ) : (
          <ul className={styles.activityList}>
            {MOCK_TEAM_ACTIVITY.slice(0, 5).map((a) => (
              <li key={a.id} className={styles.activityItem}>
                <Avatar
                  initials={a.member.initials}
                  color={a.member.avatarColor}
                  name={a.member.name}
                  size="sm"
                />
                <span className={styles.activityText}>
                  <strong>{a.member.name}</strong> {a.action}
                  {a.target && <span className={styles.activityTarget}> {a.target}</span>}
                </span>
                <span className={styles.activityTime}>{formatRelative(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onInvite={handleInvite}
        />
      )}

      {statsMember && (
        <MemberStats
          member={statsMember}
          onClose={() => setStatsMember(null)}
        />
      )}
    </div>
  )
}

// Tiempo relativo aproximado a partir de una fecha ISO.
function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}

function MetricCard({
  value,
  label,
  loading,
}: {
  value: number
  label: string
  loading: boolean
}) {
  return (
    <div className={styles.metricCard}>
      {loading ? (
        <Skeleton width="40px" height="30px" />
      ) : (
        <span className={styles.metricValue}>{value}</span>
      )}
      <span className={styles.metricLabel}>{label}</span>
    </div>
  )
}
