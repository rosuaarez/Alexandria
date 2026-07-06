import type { ProtocolComment, TeamMember } from '@/lib/types'

// TODO: reemplazar con llamada a Supabase (tabla team_members).
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-001',
    name: 'Rolando Suárez',
    email: 'rolando@empresa.com',
    role: 'leader',
    initials: 'RS',
    avatarColor: '#6D28C7',
    joinedAt: '2024-01-15T10:00:00Z',
    protocolsCount: 12,
    status: 'active',
  },
  {
    id: 'user-002',
    name: 'Ana Martínez',
    email: 'ana@empresa.com',
    role: 'researcher',
    initials: 'AM',
    avatarColor: '#059669',
    joinedAt: '2024-03-20T10:00:00Z',
    protocolsCount: 7,
    status: 'active',
  },
  {
    id: 'user-003',
    name: 'Carlos Vega',
    email: 'carlos@empresa.com',
    role: 'stakeholder',
    initials: 'CV',
    avatarColor: '#D97706',
    joinedAt: '2024-06-01T10:00:00Z',
    protocolsCount: 0,
    status: 'active',
  },
  {
    id: 'user-004',
    name: 'Sofía Ruiz',
    email: 'sofia@empresa.com',
    role: 'researcher',
    initials: 'SR',
    avatarColor: '#DC2626',
    joinedAt: '2024-08-10T10:00:00Z',
    protocolsCount: 4,
    status: 'active',
  },
  {
    id: 'user-005',
    name: 'Miguel Torres',
    email: 'miguel@empresa.com',
    role: 'researcher',
    initials: 'MT',
    avatarColor: '#7C3AED',
    joinedAt: '2025-01-05T10:00:00Z',
    protocolsCount: 1,
    status: 'invited',
  },
]

// El usuario actual (MOCK_USER) corresponde a Rolando Suárez. Se usa como autor
// por defecto al crear comentarios y respuestas.
// TODO: derivar del usuario autenticado real en el sprint de integración.
export const CURRENT_TEAM_MEMBER: TeamMember = MOCK_TEAM_MEMBERS[0]

// Feed de actividad reciente del equipo (máx. 5 ítems en la UI).
// TODO: reemplazar con llamada a Supabase (tabla activity_log).
export interface TeamActivity {
  id: string
  member: TeamMember
  action: string
  target: string
  createdAt: string
}

export const MOCK_TEAM_ACTIVITY: TeamActivity[] = [
  {
    id: 'act-001',
    member: MOCK_TEAM_MEMBERS[1], // Ana
    action: 'comentó en',
    target: 'Test de usabilidad — Checkout',
    createdAt: '2025-01-15T16:00:00Z',
  },
  {
    id: 'act-002',
    member: MOCK_TEAM_MEMBERS[0], // Rolando
    action: 'creó el protocolo',
    target: 'Entrevistas — Onboarding B2B',
    createdAt: '2025-01-15T11:20:00Z',
  },
  {
    id: 'act-003',
    member: MOCK_TEAM_MEMBERS[3], // Sofía
    action: 'aprobó',
    target: 'Encuesta NPS Q1',
    createdAt: '2025-01-14T17:45:00Z',
  },
  {
    id: 'act-004',
    member: MOCK_TEAM_MEMBERS[2], // Carlos
    action: 'solicitó revisión de',
    target: 'Card sorting — Navegación',
    createdAt: '2025-01-14T09:10:00Z',
  },
  {
    id: 'act-005',
    member: MOCK_TEAM_MEMBERS[4], // Miguel
    action: 'se unió al equipo',
    target: '',
    createdAt: '2025-01-13T08:00:00Z',
  },
]

// TODO: reemplazar con llamada a Supabase (tabla protocol_comments).
export const MOCK_COMMENTS: ProtocolComment[] = [
  {
    id: 'comment-001',
    protocolId: 'proto-mock-001',
    fieldKey: 'objetivo',
    fieldLabel: 'Objetivo del protocolo',
    author: MOCK_TEAM_MEMBERS[1], // Ana
    text: 'El objetivo está bien pero podría ser más específico respecto al segmento de usuarios.',
    resolved: false,
    replies: [
      {
        id: 'reply-001',
        author: MOCK_TEAM_MEMBERS[0], // Rolando
        text: 'Tienes razón, lo actualizo esta tarde.',
        createdAt: '2025-01-15T15:30:00Z',
      },
    ],
    createdAt: '2025-01-15T14:00:00Z',
  },
  {
    id: 'comment-002',
    protocolId: 'proto-mock-001',
    fieldKey: 'preguntas',
    fieldLabel: 'Preguntas del protocolo',
    author: MOCK_TEAM_MEMBERS[2], // Carlos
    text: '¿Podemos agregar una pregunta sobre NPS al final?',
    resolved: false,
    replies: [],
    createdAt: '2025-01-15T16:00:00Z',
  },
  {
    id: 'comment-003',
    protocolId: 'proto-mock-001',
    fieldKey: 'perfil_usuario',
    fieldLabel: 'Perfil del participante',
    author: MOCK_TEAM_MEMBERS[1],
    text: 'El perfil es demasiado amplio. Sugiero acotarlo a usuarios 25-40 años.',
    resolved: true,
    replies: [],
    createdAt: '2025-01-14T11:00:00Z',
  },
]
