import type { ProjectFolder } from '@/lib/types'

// Carpetas de proyecto fieles a las que se ven en el HTML original.
// TODO: reemplazar con datos reales de Supabase.
export const MOCK_FOLDERS: ProjectFolder[] = [
  { id: 'folder-afiliacion', name: 'Afiliación', emoji: '📁', createdAt: '2024-01-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-boton-pago', name: 'Botón de Pago', emoji: '📁', createdAt: '2024-02-10T10:00:00Z', protocolCount: 3 },
  { id: 'folder-cobranza', name: 'Cobranza', emoji: '📁', createdAt: '2024-03-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-compensalia', name: 'Compensalia', emoji: '📁', createdAt: '2024-03-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-ecosistema', name: 'Ecosistema LDC', emoji: '📁', createdAt: '2024-04-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-edyen', name: 'Edyen', emoji: '📁', createdAt: '2024-04-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-gs-motos', name: 'GS Motos', emoji: '📁', createdAt: '2024-05-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-originacion', name: 'Originación Única', emoji: '📁', createdAt: '2024-05-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-ops', name: 'OPS', emoji: '📁', createdAt: '2024-06-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-presta-prenda', name: 'Presta Prenda', emoji: '📁', createdAt: '2024-06-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-reclutalia', name: 'Reclutalia', emoji: '📁', createdAt: '2024-07-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-rpi', name: 'RPI', emoji: '📁', createdAt: '2024-07-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-sidi', name: 'SIDI', emoji: '📁', createdAt: '2024-08-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-torrax', name: 'TORRAX', emoji: '📁', createdAt: '2024-08-15T10:00:00Z', protocolCount: 0 },
  { id: 'folder-swat', name: 'SWAT', emoji: '📁', createdAt: '2024-09-01T10:00:00Z', protocolCount: 0 },
  { id: 'folder-zeus', name: 'Zeus', emoji: '📁', createdAt: '2024-09-15T10:00:00Z', protocolCount: 0 },
]
