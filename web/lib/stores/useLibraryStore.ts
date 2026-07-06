import { create } from 'zustand'
import type { Capsula, LibraryResource } from '@/lib/types'
import { MOCK_LIBRARY_RESOURCES } from '@/lib/data/mockLibrary'
import { MOCK_CAPSULAS } from '@/lib/data/mockCapsulas'

function matchesQuery(
  query: string,
  title: string,
  description: string,
  tags: string[]
): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    title.toLowerCase().includes(q) ||
    description.toLowerCase().includes(q) ||
    tags.some((t) => t.toLowerCase().includes(q))
  )
}

export interface LibraryFilters {
  activeCategory: string | null
  activeType: string | null
  searchQuery: string
  showFavoritesOnly: boolean
}

// Helpers puros — usados por el store y por los selectores reactivos de las páginas.
export function filterResources(
  resources: LibraryResource[],
  { activeCategory, activeType, searchQuery, showFavoritesOnly }: LibraryFilters
): LibraryResource[] {
  return resources.filter((r) => {
    if (activeCategory && r.category !== activeCategory) return false
    if (activeType && r.type !== activeType) return false
    if (showFavoritesOnly && !r.isFavorite) return false
    return matchesQuery(searchQuery, r.title, r.description, r.tags)
  })
}

export function filterCapsulas(
  capsulas: Capsula[],
  { activeCategory, searchQuery, showFavoritesOnly }: LibraryFilters
): Capsula[] {
  return capsulas.filter((c) => {
    if (activeCategory && c.category !== activeCategory) return false
    if (showFavoritesOnly && !c.isFavorite) return false
    return matchesQuery(searchQuery, c.title, c.description, c.tags)
  })
}

export type LibraryView = 'grid' | 'list'

const LIBRARY_VIEW_KEY = 'alexandria-library-view'

interface LibraryState {
  resources: LibraryResource[]
  capsulas: Capsula[]
  loading: boolean

  // Filtros activos
  activeCategory: string | null // null = todas
  activeType: string | null // null = todos
  searchQuery: string
  showFavoritesOnly: boolean

  // Preferencia de vista (persistida en localStorage)
  view: LibraryView

  // Acciones
  loadLibrary: () => Promise<void> // por ahora carga mock data
  loadCapsulas: () => Promise<void> // por ahora carga mock data
  toggleFavoriteResource: (id: string) => void
  toggleFavoriteCapsula: (id: string) => void
  setCategory: (category: string | null) => void
  setType: (type: string | null) => void
  setSearch: (query: string) => void
  setShowFavorites: (v: boolean) => void
  initView: () => void
  setView: (view: LibraryView) => void

  // Selectores
  filteredResources: () => LibraryResource[]
  filteredCapsulas: () => Capsula[]
}

// Simula la latencia de red para que los skeletons sean visibles.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  resources: [],
  capsulas: [],
  loading: false,

  activeCategory: null,
  activeType: null,
  searchQuery: '',
  showFavoritesOnly: false,
  // 'grid' por defecto para que SSR y primer render del cliente coincidan;
  // initView() sincroniza desde localStorage tras el montaje.
  view: 'grid',

  loadLibrary: async () => {
    set({ loading: true })
    // TODO: reemplazar con llamada a Supabase
    await delay(400)
    set({ resources: MOCK_LIBRARY_RESOURCES, loading: false })
  },

  loadCapsulas: async () => {
    set({ loading: true })
    // TODO: reemplazar con llamada a Supabase
    await delay(400)
    set({ capsulas: MOCK_CAPSULAS, loading: false })
  },

  toggleFavoriteResource: (id) =>
    set((s) => ({
      // TODO: persistir el favorito en Supabase
      resources: s.resources.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ),
    })),

  toggleFavoriteCapsula: (id) =>
    set((s) => ({
      // TODO: persistir el favorito en Supabase
      capsulas: s.capsulas.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      ),
    })),

  setCategory: (activeCategory) => set({ activeCategory }),
  setType: (activeType) => set({ activeType }),
  setSearch: (searchQuery) => set({ searchQuery }),
  setShowFavorites: (showFavoritesOnly) => set({ showFavoritesOnly }),

  initView: () => {
    if (typeof window === 'undefined') return
    try {
      const saved = window.localStorage.getItem(LIBRARY_VIEW_KEY)
      if (saved === 'grid' || saved === 'list') set({ view: saved })
    } catch {}
  },

  setView: (view) => {
    try {
      window.localStorage.setItem(LIBRARY_VIEW_KEY, view)
    } catch {}
    set({ view })
  },

  filteredResources: () => filterResources(get().resources, get()),
  filteredCapsulas: () => filterCapsulas(get().capsulas, get()),
}))
