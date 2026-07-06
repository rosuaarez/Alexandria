'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Capsula, CapsulaCategory } from '@/lib/types'
import { filterCapsulas, useLibraryStore } from '@/lib/stores/useLibraryStore'
import { CAPSULA_CATEGORY_LABELS } from '@/lib/data/capsulaMeta'
import { CapsulaCard } from '@/components/capsulas/CapsulaCard'
import { CapsulaModal } from '@/components/capsulas/CapsulaModal'
import { SearchBar, EmptyState, Skeleton } from '@/components/ui'
import styles from './capsulas.module.css'

// Etiquetas cortas para los pills de filtro.
const PILL_LABELS: Record<CapsulaCategory, string> = {
  metodo: 'Método',
  consejo: 'Consejo',
  'caso-estudio': 'Caso',
  herramienta: 'Herramienta',
  dato: 'Dato',
}

const CATEGORIES = Object.keys(PILL_LABELS) as CapsulaCategory[]

// Cápsula del día: rotación determinista por fecha (misma cápsula todo el día).
function getCapsuleOfTheDay(capsulas: Capsula[]): Capsula | null {
  if (capsulas.length === 0) return null
  const now = new Date()
  const seed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  return capsulas[seed % capsulas.length]
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton width="40px" height="40px" borderRadius="8px" />
      <Skeleton width="80%" height="15px" />
      <Skeleton width="100%" height="13px" />
      <Skeleton width="50%" height="12px" />
    </div>
  )
}

export default function CapsulasPage() {
  const capsulas = useLibraryStore((s) => s.capsulas)
  const loading = useLibraryStore((s) => s.loading)
  const activeCategory = useLibraryStore((s) => s.activeCategory)
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const showFavoritesOnly = useLibraryStore((s) => s.showFavoritesOnly)

  const setCategory = useLibraryStore((s) => s.setCategory)
  const setSearch = useLibraryStore((s) => s.setSearch)
  const toggleFavoriteCapsula = useLibraryStore((s) => s.toggleFavoriteCapsula)

  const [selected, setSelected] = useState<Capsula | null>(null)

  // Limpia los filtros compartidos al entrar (la Biblioteca usa el mismo store).
  useEffect(() => {
    setCategory(null)
    setSearch('')
  }, [setCategory, setSearch])

  const filtered = useMemo(
    () =>
      filterCapsulas(capsulas, {
        activeCategory,
        activeType: null,
        searchQuery,
        showFavoritesOnly,
      }),
    [capsulas, activeCategory, searchQuery, showFavoritesOnly]
  )

  // El featured solo se muestra sin filtros activos.
  const showFeatured = activeCategory === null && searchQuery.trim() === ''
  const featured = useMemo(() => getCapsuleOfTheDay(capsulas), [capsulas])
  const gridItems =
    showFeatured && featured ? filtered.filter((c) => c.id !== featured.id) : filtered

  // Mantiene la cápsula abierta sincronizada con el store (favorito en vivo).
  const selectedLive = selected
    ? capsulas.find((c) => c.id === selected.id) ?? null
    : null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Cápsulas de Conocimiento</h1>
          <p className={styles.subtitle}>Aprende UX research en pequeñas dosis</p>
        </div>
        <SearchBar
          placeholder="Buscar cápsulas…"
          value={searchQuery}
          onChange={setSearch}
        />
      </header>

      <div className={styles.pills} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === null}
          className={`${styles.pill} ${activeCategory === null ? styles.pillActive : ''}`}
          onClick={() => setCategory(null)}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
            onClick={() => setCategory(cat)}
          >
            {PILL_LABELS[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          emoji="💊"
          title="Sin cápsulas"
          description="No hay cápsulas que coincidan con tu búsqueda. Prueba otra categoría o limpia el filtro."
          action={{
            label: 'Limpiar filtros',
            onClick: () => {
              setCategory(null)
              setSearch('')
            },
          }}
        />
      ) : (
        <>
          {showFeatured && featured && (
            <button
              type="button"
              className={styles.featured}
              onClick={() => setSelected(featured)}
            >
              <span className={styles.featuredEmoji} aria-hidden>
                {featured.emoji}
              </span>
              <div className={styles.featuredBody}>
                <div className={styles.featuredTop}>
                  <span className={styles.dailyBadge}>✨ Cápsula del día</span>
                  <span className={styles.featuredLabel}>
                    {CAPSULA_CATEGORY_LABELS[featured.category]}
                  </span>
                  <span className={styles.featuredTime}>{featured.readTime} ▶</span>
                </div>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredDesc}>{featured.description}</p>
                <span className={styles.featuredCta}>Leer cápsula →</span>
              </div>
            </button>
          )}

          {gridItems.length > 0 && (
            <div className={styles.grid}>
              {gridItems.map((c) => (
                <CapsulaCard
                  key={c.id}
                  capsula={c}
                  onOpen={setSelected}
                  onToggleFavorite={toggleFavoriteCapsula}
                />
              ))}
            </div>
          )}
        </>
      )}

      <CapsulaModal
        capsula={selectedLive}
        onClose={() => setSelected(null)}
        onToggleFavorite={toggleFavoriteCapsula}
      />
    </div>
  )
}
