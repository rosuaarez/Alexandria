import { create } from 'zustand'
import type {
  GeneratedProtocolData,
  Protocol,
  ProtocolStatus,
} from '@/lib/types'
import { useUIStore } from '@/lib/stores/useUIStore'
import { FLAGS } from '@/lib/config/flags'
import * as api from '@/lib/supabase/protocols'

function toast(message: string, type?: 'success' | 'error' | 'info') {
  useUIStore.getState().showToast(message, type)
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Error desconocido'
}

interface ProtocolState {
  protocols: Protocol[]
  loading: boolean
  error: string | null
  editingProtocolId: string | null

  loadProtocols: (userId: string) => Promise<void>
  createProtocol: (data: Partial<Protocol>, userId: string) => Promise<Protocol>
  updateProtocol: (protocol: Protocol) => Promise<void>
  deleteProtocol: (protocol: Protocol) => Promise<void>
  duplicateProtocol: (protocol: Protocol, userId: string) => Promise<void>
  setEditingProtocol: (id: string | null) => void
  // Set local (en memoria) del output generado por IA. La persistencia real ocurre
  // cuando el editor guarda el protocolo contra Supabase (creds reales).
  setGeneratedData: (id: string, generatedData: GeneratedProtocolData) => void

  getProtocolById: (id: string) => Protocol | undefined
  getProtocolsByStatus: (status: ProtocolStatus) => Protocol[]
  getProtocolsByFolder: (folderId: string) => Protocol[]
}

export const useProtocolStore = create<ProtocolState>((set, get) => ({
  protocols: [],
  loading: false,
  error: null,
  editingProtocolId: null,

  loadProtocols: async (userId) => {
    set({ loading: true, error: null })
    try {
      // Solo datos reales de Supabase; en modo mock (creds placeholder) se
      // devuelve una lista vacía (sin protocolos ficticios inyectados).
      const protocols = FLAGS.USE_REAL_SUPABASE
        ? await api.loadUserProtocols(userId)
        : []
      set({ protocols, loading: false })
    } catch (e) {
      const message = errorMessage(e)
      set({ protocols: [], loading: false, error: message })
      toast(`No se pudieron cargar los protocolos: ${message}`, 'error')
    }
  },

  createProtocol: async (data, userId) => {
    // Feedback de carga mientras se crea (toast oscuro tipo 'info').
    toast('⊙ Creando protocolo...', 'info')
    // id local optimista; se reemplaza con el registro real (incluye _supabaseId).
    const localId = crypto.randomUUID()
    const optimistic: Protocol = {
      id: localId,
      name: data.name ?? 'Nuevo protocolo',
      type: data.type ?? 'complete',
      protoStatus: data.protoStatus ?? 'draft',
      ...data,
    }
    set((s) => ({ protocols: [optimistic, ...s.protocols] }))
    if (!FLAGS.USE_REAL_SUPABASE) {
      // Mock: el protocolo vive solo en memoria (sin _supabaseId).
      toast('Protocolo creado ✓', 'success')
      return optimistic
    }
    try {
      const saved = await api.createProtocol(optimistic, userId)
      set((s) => ({
        protocols: s.protocols.map((p) => (p.id === localId ? saved : p)),
      }))
      toast('Protocolo creado', 'success')
      return saved
    } catch (e) {
      // Revertir: quitar el optimista.
      set((s) => ({ protocols: s.protocols.filter((p) => p.id !== localId) }))
      toast(`No se pudo crear: ${errorMessage(e)}`, 'error')
      throw e
    }
  },

  updateProtocol: async (protocol) => {
    const prev = get().protocols
    // Optimista: aplicar el cambio local primero.
    set((s) => ({
      protocols: s.protocols.map((p) => (p.id === protocol.id ? protocol : p)),
    }))
    if (!FLAGS.USE_REAL_SUPABASE) {
      // Mock: el cambio optimista ya quedó aplicado en memoria.
      toast('Protocolo actualizado', 'success')
      return
    }
    try {
      const saved = await api.updateProtocol(protocol)
      set((s) => ({
        protocols: s.protocols.map((p) => (p.id === protocol.id ? saved : p)),
      }))
      toast('Protocolo actualizado', 'success')
    } catch (e) {
      set({ protocols: prev }) // revertir
      toast(`No se pudo actualizar: ${errorMessage(e)}`, 'error')
      throw e
    }
  },

  deleteProtocol: async (protocol) => {
    const prev = get().protocols
    // Optimista: quitar de la lista local primero.
    set((s) => ({ protocols: s.protocols.filter((p) => p.id !== protocol.id) }))
    if (!FLAGS.USE_REAL_SUPABASE) {
      // Mock: ya fue removido de la lista en memoria.
      toast('Protocolo eliminado', 'success')
      return
    }
    try {
      if (protocol._supabaseId) {
        await api.deleteProtocol(protocol._supabaseId)
      }
      toast('Protocolo eliminado', 'success')
    } catch (e) {
      set({ protocols: prev }) // revertir
      toast(`No se pudo eliminar: ${errorMessage(e)}`, 'error')
      throw e
    }
  },

  duplicateProtocol: async (protocol, userId) => {
    if (!FLAGS.USE_REAL_SUPABASE) {
      // Mock: copia local en memoria con id nuevo y sin _supabaseId.
      const copy: Protocol = {
        ...protocol,
        id: crypto.randomUUID(),
        _supabaseId: undefined,
        name: `Copia de ${protocol.name}`,
      }
      set((s) => ({ protocols: [copy, ...s.protocols] }))
      toast('Protocolo duplicado', 'success')
      return
    }
    try {
      const copy = await api.duplicateProtocol(protocol, userId)
      set((s) => ({ protocols: [copy, ...s.protocols] }))
      toast('Protocolo duplicado', 'success')
    } catch (e) {
      toast(`No se pudo duplicar: ${errorMessage(e)}`, 'error')
      throw e
    }
  },

  setEditingProtocol: (editingProtocolId) => set({ editingProtocolId }),

  setGeneratedData: (id, generatedData) =>
    set((s) => ({
      protocols: s.protocols.map((p) =>
        p.id === id ? { ...p, generatedData } : p
      ),
    })),

  getProtocolById: (id) => get().protocols.find((p) => p.id === id),
  getProtocolsByStatus: (status) =>
    get().protocols.filter((p) => p.protoStatus === status),
  getProtocolsByFolder: (folderId) =>
    get().protocols.filter((p) => p.folderId === folderId),
}))
