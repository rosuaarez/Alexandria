import { create } from 'zustand'
import type {
  CommentReply,
  ProtocolComment,
  TeamMember,
  TeamRole,
} from '@/lib/types'
import { useUIStore } from '@/lib/stores/useUIStore'
import {
  CURRENT_TEAM_MEMBER,
  MOCK_COMMENTS,
  MOCK_TEAM_MEMBERS,
} from '@/lib/data/mockTeam'

function toast(message: string, type?: 'success' | 'error' | 'info') {
  useUIStore.getState().showToast(message, type)
}

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}`
}

// Simula la latencia de red para que los skeletons/estados de carga sean visibles.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Iniciales a partir del email (parte antes de @), p. ej. "ana.lopez" → "AL".
function initialsFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[.\-_]+/).filter(Boolean)
  const letters = (parts.length >= 2 ? parts[0][0] + parts[1][0] : local.slice(0, 2))
  return letters.toUpperCase()
}

// Paleta de colores para avatares de nuevos invitados (todos hex del diseño).
const INVITE_COLORS = ['#6D28C7', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9']

// Estado del panel lateral de comentarios. fieldKey null + open = mostrar todos.
interface CommentsPanelState {
  open: boolean
  fieldKey: string | null
  fieldLabel: string
}

interface TeamState {
  members: TeamMember[]
  comments: ProtocolComment[]
  loading: boolean
  inviteEmail: string
  commentsPanel: CommentsPanelState

  loadTeam: () => Promise<void>
  loadComments: (protocolId: string) => Promise<void>
  clearComments: () => void
  inviteMember: (email: string, role: TeamRole) => Promise<void>
  updateMemberRole: (memberId: string, role: TeamRole) => Promise<void>
  removeMember: (memberId: string) => Promise<void>

  addComment: (
    comment: Omit<ProtocolComment, 'id' | 'createdAt'>
  ) => Promise<void>
  addReply: (
    commentId: string,
    reply: Omit<CommentReply, 'id' | 'createdAt'>
  ) => Promise<void>
  resolveComment: (commentId: string) => Promise<void>

  setInviteEmail: (email: string) => void
  openFieldComments: (fieldKey: string, fieldLabel: string) => void
  openAllComments: () => void
  closeComments: () => void

  getCommentsByField: (fieldKey: string) => ProtocolComment[]
  getUnresolvedCount: () => number
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  comments: [],
  loading: false,
  inviteEmail: '',
  commentsPanel: { open: false, fieldKey: null, fieldLabel: '' },

  loadTeam: async () => {
    set({ loading: true })
    // TODO: reemplazar con llamada a Supabase
    await delay(400)
    set({ members: MOCK_TEAM_MEMBERS, loading: false })
  },

  loadComments: async (protocolId) => {
    // TODO: reemplazar con llamada a Supabase
    await delay(300)
    set({
      comments: MOCK_COMMENTS.filter((c) => c.protocolId === protocolId),
    })
  },

  clearComments: () => set({ comments: [] }),

  inviteMember: async (email, role) => {
    const trimmed = email.trim()
    if (!trimmed) return
    // TODO: reemplazar con llamada a Supabase (envío real de invitación)
    const member: TeamMember = {
      id: uid('user'),
      name: trimmed.split('@')[0],
      email: trimmed,
      role,
      initials: initialsFromEmail(trimmed),
      avatarColor: INVITE_COLORS[get().members.length % INVITE_COLORS.length],
      joinedAt: new Date().toISOString(),
      protocolsCount: 0,
      status: 'invited',
    }
    set((s) => ({ members: [...s.members, member], inviteEmail: '' }))
    toast(`Invitación enviada a ${trimmed}`, 'success')
  },

  updateMemberRole: async (memberId, role) => {
    // TODO: reemplazar con llamada a Supabase
    set((s) => ({
      members: s.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }))
    toast('Rol actualizado', 'success')
  },

  removeMember: async (memberId) => {
    // TODO: reemplazar con llamada a Supabase
    const member = get().members.find((m) => m.id === memberId)
    set((s) => ({ members: s.members.filter((m) => m.id !== memberId) }))
    toast(
      member ? `${member.name} eliminado del equipo` : 'Miembro eliminado',
      'success'
    )
  },

  addComment: async (comment) => {
    // TODO: reemplazar con llamada a Supabase
    const full: ProtocolComment = {
      ...comment,
      id: uid('comment'),
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ comments: [...s.comments, full] }))
  },

  addReply: async (commentId, reply) => {
    // TODO: reemplazar con llamada a Supabase
    const full: CommentReply = {
      ...reply,
      id: uid('reply'),
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      comments: s.comments.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, full] } : c
      ),
    }))
  },

  resolveComment: async (commentId) => {
    // TODO: reemplazar con llamada a Supabase
    set((s) => ({
      comments: s.comments.map((c) =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      ),
    }))
  },

  setInviteEmail: (inviteEmail) => set({ inviteEmail }),

  openFieldComments: (fieldKey, fieldLabel) =>
    set({ commentsPanel: { open: true, fieldKey, fieldLabel } }),
  openAllComments: () =>
    set({
      commentsPanel: {
        open: true,
        fieldKey: null,
        fieldLabel: 'Todos los comentarios',
      },
    }),
  closeComments: () =>
    set((s) => ({ commentsPanel: { ...s.commentsPanel, open: false } })),

  getCommentsByField: (fieldKey) =>
    get().comments.filter((c) => c.fieldKey === fieldKey),
  getUnresolvedCount: () => get().comments.filter((c) => !c.resolved).length,
}))

// Re-exporta el miembro actual para que la UI de comentarios sepa quién comenta.
export { CURRENT_TEAM_MEMBER }
