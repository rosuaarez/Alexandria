import { create } from 'zustand'
import type { ProjectFolder } from '@/lib/types'
import { MOCK_FOLDERS } from '@/lib/data/mockFolders'
import { useProtocolStore } from '@/lib/stores/useProtocolStore'

// Id de la carpeta virtual que agrupa los protocolos sin carpeta.
export const UNCATEGORIZED_ID = 'uncategorized'

interface FolderState {
  folders: ProjectFolder[]
  loading: boolean
  searchQuery: string

  loadFolders: () => Promise<void>
  createFolder: (
    data: Pick<ProjectFolder, 'name' | 'emoji' | 'description'>
  ) => Promise<void>
  updateFolder: (id: string, data: Partial<ProjectFolder>) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  setSearch: (q: string) => void

  filteredFolders: () => ProjectFolder[]
  // Carpeta especial: protocolos sin carpeta
  getUncategorizedCount: () => number
}

// Simula la latencia de red para que los skeletons sean visibles.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Cuenta protocolos reales de una carpeta; si no hay ninguno usa el valor mock
// (para reflejar las carpetas del diseño original, p. ej. "Botón de Pago" = 3).
function resolveCount(folder: ProjectFolder): number {
  const real = useProtocolStore
    .getState()
    .protocols.filter((p) => p.folderId === folder.id).length
  return real || folder.protocolCount
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  loading: false,
  searchQuery: '',

  loadFolders: async () => {
    set({ loading: true })
    // TODO: reemplazar con llamada a Supabase
    await delay(400)
    set({ folders: MOCK_FOLDERS, loading: false })
  },

  createFolder: async (data) => {
    // TODO: persistir en Supabase
    const folder: ProjectFolder = {
      id: `folder-${Date.now()}`,
      name: data.name,
      emoji: data.emoji || '📁',
      description: data.description,
      createdAt: new Date().toISOString(),
      protocolCount: 0,
    }
    set((s) => ({ folders: [...s.folders, folder] }))
  },

  updateFolder: async (id, data) => {
    // TODO: persistir en Supabase
    set((s) => ({
      folders: s.folders.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }))
  },

  deleteFolder: async (id) => {
    // TODO: persistir en Supabase
    set((s) => ({ folders: s.folders.filter((f) => f.id !== id) }))
  },

  setSearch: (searchQuery) => set({ searchQuery }),

  getUncategorizedCount: () =>
    useProtocolStore.getState().protocols.filter((p) => !p.folderId).length,

  filteredFolders: () => {
    const { folders, searchQuery } = get()
    const q = searchQuery.trim().toLowerCase()
    const matched = folders
      .filter((f) => !q || f.name.toLowerCase().includes(q))
      .map((f) => ({ ...f, protocolCount: resolveCount(f) }))

    // La carpeta virtual "Protocolos sin carpeta" siempre va al final.
    const uncategorized: ProjectFolder = {
      id: UNCATEGORIZED_ID,
      name: 'Protocolos sin carpeta',
      emoji: '📂',
      createdAt: '',
      protocolCount: get().getUncategorizedCount(),
    }
    return [...matched, uncategorized]
  },
}))
