import type { Protocol } from '@/lib/types'

// Protocolo mock en estado de revisión, usado para probar el flujo de
// colaboración (banner de revisión + comentarios por campo). Se inyecta en
// useProtocolStore junto a los protocolos que vendrían de Supabase.
// TODO: reemplazar con datos reales de Supabase en el sprint de integración.
export const MOCK_SHARED_PROTOCOL: Protocol = {
  id: 'proto-mock-001',
  _supabaseId: 'proto-mock-001',
  name: 'Test de Usabilidad — App Móvil v2',
  type: 'complete',
  protoStatus: 'in-review',
  sharedWith: [
    {
      id: 'user-002',
      name: 'Ana Martínez',
      email: 'ana@empresa.com',
      role: 'researcher',
    },
    {
      id: 'user-003',
      name: 'Carlos Vega',
      email: 'carlos@empresa.com',
      role: 'stakeholder',
    },
  ],
  data: {
    objetivo:
      'Evaluar la experiencia de usuario en el flujo de onboarding de la app móvil.',
    // CompleteForm lee `objetivoGeneral`; se replica para que el textarea lo muestre.
    objetivoGeneral:
      'Evaluar la experiencia de usuario en el flujo de onboarding de la app móvil.',
    proyecto: 'App Móvil v2',
    cliente: 'Empresa XYZ',
    questions: [
      { id: 'q1', text: '¿Pudiste completar el registro sin ayuda?', type: 'scale5' },
      { id: 'q2', text: '¿Qué fue lo más confuso del proceso?', type: 'open' },
    ],
  },
  createdAt: '2025-01-10T10:00:00Z',
  updatedAt: '2025-01-15T14:00:00Z',
}
