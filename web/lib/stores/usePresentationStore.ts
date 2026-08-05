import { create } from 'zustand'
import type { Slide } from '@/lib/presentation/presentationData'
import type { PresentationTemplate } from '@/lib/presentation/constants'

// Registro de una presentación generada, asociada a su protocolo de origen.
// Guarda el contenido de las slides para que "Ver" lo muestre sin regenerar.
export interface SavedPresentation {
  id: string
  protocolId: string
  name: string
  template: PresentationTemplate
  color: string
  slideCount: number
  slides: Slide[]
  createdAt: string
}

export type NewPresentation = Omit<SavedPresentation, 'id' | 'createdAt'>

interface PresentationState {
  presentations: SavedPresentation[]
  addPresentation: (p: NewPresentation) => void
  deletePresentation: (id: string) => void
  getByProtocol: (protocolId: string) => SavedPresentation[]
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  presentations: [],

  // Deduplica por protocolId + plantilla + color: re-guardar la misma
  // combinación actualiza el registro en vez de crear duplicados.
  addPresentation: (p) =>
    set((s) => {
      const now = new Date().toISOString()
      const existing = s.presentations.find(
        (x) =>
          x.protocolId === p.protocolId &&
          x.template === p.template &&
          x.color === p.color
      )
      if (existing) {
        return {
          presentations: s.presentations.map((x) =>
            x.id === existing.id ? { ...x, ...p, createdAt: now } : x
          ),
        }
      }
      const rec: SavedPresentation = {
        ...p,
        id: `pres-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: now,
      }
      return { presentations: [rec, ...s.presentations] }
    }),

  deletePresentation: (id) =>
    set((s) => ({
      presentations: s.presentations.filter((x) => x.id !== id),
    })),

  getByProtocol: (protocolId) =>
    get().presentations.filter((p) => p.protocolId === protocolId),
}))
