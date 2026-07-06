import { createClient } from '@/lib/supabase/client'
import { FLAGS } from '@/lib/config/flags'
import { MOCK_TEAM_MEMBERS } from '@/lib/data/mockTeam'
import type { MemberStatus, TeamMember, TeamRole } from '@/lib/types'

// Acceso al Equipo en Supabase. PREPARADO (Sprint 8): mientras
// FLAGS.USE_REAL_SUPABASE sea false, devuelve los mocks.
// El esquema vive en migrations/002_team.sql (no ejecutado aún).

const TABLE = 'team_members'

interface MemberRow {
  id: string
  name: string
  email: string
  role: string
  initials: string | null
  avatar_color: string | null
  status: string
  protocols_count: number | null
  joined_at: string
}

function toMember(row: MemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as TeamRole,
    initials: row.initials ?? '',
    avatarColor: row.avatar_color ?? '#6D28C7',
    joinedAt: row.joined_at,
    protocolsCount: row.protocols_count ?? 0,
    status: row.status as MemberStatus,
  }
}

export async function loadTeamMembers(): Promise<TeamMember[]> {
  if (!FLAGS.USE_REAL_SUPABASE) return MOCK_TEAM_MEMBERS

  const supabase = createClient()
  const { data: rows, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('joined_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (rows ?? []).map((r) => toMember(r as MemberRow))
}
