import { create } from 'zustand'
import { METODOLOGIAS, type Metodologia } from '@/lib/data/metodologias'
import { LIBROS, type Libro } from '@/lib/data/libros'

export type CapsulasTab = 'all' | 'metodologias' | 'libros'
export type CapsulasSort = 'az' | 'za'

export type CapsulaItem =
  | ({ kind: 'metodologia' } & Metodologia)
  | ({ kind: 'libro' } & Libro)

// Título usado para búsqueda/orden de cualquier item (metodología o libro).
function itemTitle(item: Metodologia | Libro): string {
  return 'titulo' in item ? item.titulo : item.title
}

function matches(query: string, m: Metodologia): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    m.title.toLowerCase().includes(q) ||
    m.body.toLowerCase().includes(q) ||
    m.faseLabel.toLowerCase().includes(q) ||
    m.pills.some((p) => p.toLowerCase().includes(q))
  )
}

function matchesLibro(query: string, l: Libro): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    l.titulo.toLowerCase().includes(q) ||
    l.autor.toLowerCase().includes(q) ||
    l.descripcion.toLowerCase().includes(q)
  )
}

function sortByTitle<T extends Metodologia | Libro>(items: T[], order: CapsulasSort): T[] {
  const sorted = [...items].sort((a, b) => itemTitle(a).localeCompare(itemTitle(b), 'es'))
  return order === 'za' ? sorted.reverse() : sorted
}

interface CapsulasState {
  activeTab: CapsulasTab
  searchQuery: string
  sortOrder: CapsulasSort
  // Filtros propios de la vista Metodologías.
  tipoFilter: string // 'all' o un tipo (generativa, moderada, …)
  faseFilter: string // 'all' o una fase (empatizar, definir, …)

  setTab: (tab: CapsulasTab) => void
  setSearch: (q: string) => void
  setSort: (order: CapsulasSort) => void
  setTipo: (tipo: string) => void
  setFase: (fase: string) => void

  filteredMetodologias: () => Metodologia[]
  filteredLibros: () => Libro[]
  filteredItems: () => CapsulaItem[]
}

export const useCapsulasStore = create<CapsulasState>((set, get) => ({
  activeTab: 'all',
  searchQuery: '',
  sortOrder: 'az',
  tipoFilter: 'all',
  faseFilter: 'all',

  setTab: (activeTab) => set({ activeTab, searchQuery: '' }),
  setSearch: (searchQuery) => set({ searchQuery }),
  setSort: (sortOrder) => set({ sortOrder }),
  setTipo: (tipoFilter) => set({ tipoFilter }),
  setFase: (faseFilter) => set({ faseFilter }),

  filteredMetodologias: () => {
    const { searchQuery, sortOrder, tipoFilter, faseFilter } = get()
    const list = METODOLOGIAS.filter(
      (m) =>
        matches(searchQuery, m) &&
        (tipoFilter === 'all' || m.tipo.includes(tipoFilter)) &&
        (faseFilter === 'all' || m.fase === faseFilter)
    )
    return sortByTitle(list, sortOrder)
  },

  filteredLibros: () => {
    const { searchQuery, sortOrder } = get()
    const list = LIBROS.filter((l) => matchesLibro(searchQuery, l))
    return sortByTitle(list, sortOrder)
  },

  // Vista "Todas": metodologías + libros en un mismo grid, ordenados por título.
  filteredItems: () => {
    const { searchQuery, sortOrder } = get()
    const metodos: CapsulaItem[] = METODOLOGIAS.filter((m) =>
      matches(searchQuery, m)
    ).map((m) => ({ kind: 'metodologia', ...m }))
    const libros: CapsulaItem[] = LIBROS.filter((l) =>
      matchesLibro(searchQuery, l)
    ).map((l) => ({ kind: 'libro', ...l }))
    const all = [...metodos, ...libros]
    all.sort((a, b) => {
      const ta = a.kind === 'libro' ? a.titulo : a.title
      const tb = b.kind === 'libro' ? b.titulo : b.title
      return ta.localeCompare(tb, 'es')
    })
    return sortOrder === 'za' ? all.reverse() : all
  },
}))
