import type { SharedUser, TeamMember } from '@/lib/types'

// Iniciales a partir de un nombre completo: "Ana Martínez" → "AM".
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Paleta determinista (hex del diseño) para asignar color por id de usuario.
const AVATAR_PALETTE = [
  '#6D28C7',
  '#059669',
  '#D97706',
  '#DC2626',
  '#7C3AED',
  '#0EA5E9',
  '#DB2777',
]

// Color estable a partir de una cadena (id o email): mismo input → mismo color.
export function colorFromKey(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

type AvatarMember = Pick<TeamMember, 'initials' | 'avatarColor' | 'name'>

// Adapta SharedUser[] (sin iniciales/color) al formato que consume AvatarGroup.
export function sharedUsersToAvatars(users: SharedUser[]): AvatarMember[] {
  return users.map((u) => ({
    name: u.name,
    initials: initialsFromName(u.name),
    avatarColor: colorFromKey(u.id || u.email),
  }))
}
