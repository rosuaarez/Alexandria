import type { MemberStatus, TeamRole } from '@/lib/types'

export const ROLE_LABELS: Record<TeamRole, string> = {
  leader: 'Líder',
  researcher: 'Investigador',
  stakeholder: 'Stakeholder',
}

// Clave de clase CSS por rol (para los badges en la tabla de miembros).
export const ROLE_CLASS: Record<TeamRole, string> = {
  leader: 'leader',
  researcher: 'researcher',
  stakeholder: 'stakeholder',
}

export const STATUS_LABELS: Record<MemberStatus, string> = {
  active: 'Activo',
  invited: 'Invitado',
  inactive: 'Inactivo',
}

export const STATUS_CLASS: Record<MemberStatus, string> = {
  active: 'active',
  invited: 'invited',
  inactive: 'inactive',
}

// Roles que se pueden asignar al invitar a un colaborador (el líder no se invita).
export const INVITABLE_ROLES: TeamRole[] = ['researcher', 'stakeholder']
