'use client'

import { useState } from 'react'
import type { Metodologia } from '@/lib/data/metodologias'
import { METODOLOGIAS } from '@/lib/data/metodologias'
import { LIBROS } from '@/lib/data/libros'
import { useCapsulasStore } from '@/lib/stores/useCapsulasStore'
import { MetodoCard } from '@/components/capsulas/MetodoCard'
import { LibroCard } from '@/components/capsulas/LibroCard'
import { MetodoModal } from '@/components/capsulas/MetodoModal'

const CATEGORY_TABS: { value: 'all' | 'metodologias' | 'libros'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'metodologias', label: '🔬 Metodologías' },
  { value: 'libros', label: '📚 Libros' },
]

const TIPO_PILLS: { value: string; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'generativa', label: 'Generativa' },
  { value: 'evaluativa', label: 'Evaluativa' },
  { value: 'moderada', label: 'Moderada' },
  { value: 'no-moderada', label: 'No Mod.' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'remota', label: 'Remota' },
  { value: 'content', label: 'Content' },
]

const FASE_TABS: { value: string; label: string }[] = [
  { value: 'all', label: '◉ TODAS LAS FASES' },
  { value: 'empatizar', label: '① EMPATIZAR' },
  { value: 'definir', label: '② DEFINIR' },
  { value: 'idear', label: '③ IDEAR' },
  { value: 'prototipar', label: '④ PROTOTIPAR' },
  { value: 'testear', label: '⑤ TESTEAR' },
  { value: 'medir', label: '⑥ MEDIR' },
]

export default function CapsulasPage() {
  const activeTab = useCapsulasStore((s) => s.activeTab)
  const searchQuery = useCapsulasStore((s) => s.searchQuery)
  const sortOrder = useCapsulasStore((s) => s.sortOrder)
  const tipoFilter = useCapsulasStore((s) => s.tipoFilter)
  const faseFilter = useCapsulasStore((s) => s.faseFilter)
  const setTab = useCapsulasStore((s) => s.setTab)
  const setSearch = useCapsulasStore((s) => s.setSearch)
  const setSort = useCapsulasStore((s) => s.setSort)
  const setTipo = useCapsulasStore((s) => s.setTipo)
  const setFase = useCapsulasStore((s) => s.setFase)
  const filteredItems = useCapsulasStore((s) => s.filteredItems)
  const filteredMetodologias = useCapsulasStore((s) => s.filteredMetodologias)
  const filteredLibros = useCapsulasStore((s) => s.filteredLibros)

  const [selected, setSelected] = useState<Metodologia | null>(null)

  // Conteos "Mostrando N de N" según la pestaña activa.
  let shown = 0
  let total = 0
  if (activeTab === 'all') {
    shown = filteredItems().length
    total = METODOLOGIAS.length + LIBROS.length
  } else if (activeTab === 'metodologias') {
    shown = filteredMetodologias().length
    total = METODOLOGIAS.length
  } else {
    shown = filteredLibros().length
    total = LIBROS.length
  }

  const searchPlaceholder =
    activeTab === 'metodologias'
      ? 'Buscar metodología...'
      : activeTab === 'libros'
        ? 'Buscar libro o autor…'
        : 'Buscar cápsula, metodología o libro...'

  return (
    <div className="page-transition" id="view-capsulas">
      <div className="caps-header">
        <h1 className="caps-title">💡 Cápsulas de Conocimiento</h1>
        <p className="caps-sub">
          Tips, metodologías y mejores prácticas para sacarle el mayor provecho a
          tus encuestas, pruebas de usabilidad y research en general.
        </p>
      </div>

      {/* Filtros por categoría (3 tabs). */}
      <div className="caps-filters">
        {CATEGORY_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`caps-filter-btn${activeTab === t.value ? ' active' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar de "Todas" y "Libros": buscador + orden + contador. */}
      {activeTab !== 'metodologias' && (
        <div className="all-toolbar visible">
          <div className="books-search-wrap">
            <input
              className="books-search"
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="books-sort-wrap">
            <button
              type="button"
              className={`books-sort-btn${sortOrder === 'az' ? ' active' : ''}`}
              onClick={() => setSort('az')}
            >
              A → Z
            </button>
            <button
              type="button"
              className={`books-sort-btn${sortOrder === 'za' ? ' active' : ''}`}
              onClick={() => setSort('za')}
            >
              Z → A
            </button>
          </div>
          <span className="books-count">
            Mostrando {shown} de {total} cápsulas
          </span>
        </div>
      )}

      {/* Toolbar de "Metodologías": buscador + TIPO pills + fases + orden. */}
      {activeTab === 'metodologias' && (
        <div className="metodo-toolbar visible">
          <div className="metodo-toolbar-row1">
            <div className="metodo-search-wrap">
              <input
                className="metodo-search"
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="metodo-tipo-label">TIPO:</span>
            <div className="metodo-tipo-pills">
              {TIPO_PILLS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`metodo-tipo-btn${tipoFilter === t.value ? ' active' : ''}`}
                  onClick={() => setTipo(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="metodo-fase-tabs">
            {FASE_TABS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`metodo-fase-tab${faseFilter === f.value ? ' active' : ''}`}
                onClick={() => setFase(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="metodo-count-bar">
            <div className="metodo-sort-wrap">
              <button
                type="button"
                className={`books-sort-btn${sortOrder === 'az' ? ' active' : ''}`}
                onClick={() => setSort('az')}
              >
                A → Z
              </button>
              <button
                type="button"
                className={`books-sort-btn${sortOrder === 'za' ? ' active' : ''}`}
                onClick={() => setSort('za')}
              >
                Z → A
              </button>
            </div>
            <span className="metodo-count">
              Mostrando {shown} de {total} metodologías
            </span>
          </div>
        </div>
      )}

      {/* Grid mixto de cápsulas. */}
      <div className="caps-grid">
        {activeTab === 'all' &&
          filteredItems().map((item) =>
            item.kind === 'metodologia' ? (
              <MetodoCard key={item.id} metodo={item} onOpen={setSelected} />
            ) : (
              <LibroCard key={item.id} libro={item} />
            )
          )}
        {activeTab === 'metodologias' &&
          filteredMetodologias().map((m) => (
            <MetodoCard key={m.id} metodo={m} onOpen={setSelected} />
          ))}
        {activeTab === 'libros' &&
          filteredLibros().map((l) => <LibroCard key={l.id} libro={l} />)}
      </div>

      <MetodoModal metodo={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
