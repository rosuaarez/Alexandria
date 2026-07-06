'use client'

import { useEffect, useMemo } from 'react'
import type { LibraryCategory, LibraryResourceType } from '@/lib/types'
import { filterResources, useLibraryStore } from '@/lib/stores/useLibraryStore'
import { ResourceCard, RESOURCE_TYPE_LABELS } from '@/components/library/ResourceCard'
import { SearchBar, EmptyState, Skeleton } from '@/components/ui'
import styles from './library.module.css'

const CATEGORY_LABELS: Record<LibraryCategory, string> = {
  usabilidad: 'Usabilidad',
  entrevistas: 'Entrevistas',
  metricas: 'Métricas',
  accesibilidad: 'Accesibilidad',
  investigacion: 'Investigación',
  herramientas: 'Herramientas',
  metodologia: 'Metodología',
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as LibraryCategory[]
const TYPES = Object.keys(RESOURCE_TYPE_LABELS) as LibraryResourceType[]

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton width="32px" height="32px" borderRadius="8px" />
      <Skeleton width="80%" height="15px" />
      <Skeleton width="100%" height="13px" />
      <Skeleton width="60%" height="13px" />
      <Skeleton width="40%" height="12px" />
    </div>
  )
}

export default function LibraryPage() {
  const resources = useLibraryStore((s) => s.resources)
  const loading = useLibraryStore((s) => s.loading)
  const activeCategory = useLibraryStore((s) => s.activeCategory)
  const activeType = useLibraryStore((s) => s.activeType)
  const searchQuery = useLibraryStore((s) => s.searchQuery)
  const showFavoritesOnly = useLibraryStore((s) => s.showFavoritesOnly)

  const view = useLibraryStore((s) => s.view)
  const setCategory = useLibraryStore((s) => s.setCategory)
  const setType = useLibraryStore((s) => s.setType)
  const setSearch = useLibraryStore((s) => s.setSearch)
  const setShowFavorites = useLibraryStore((s) => s.setShowFavorites)
  const setView = useLibraryStore((s) => s.setView)
  const initView = useLibraryStore((s) => s.initView)
  const toggleFavoriteResource = useLibraryStore((s) => s.toggleFavoriteResource)

  // Limpia los filtros compartidos al entrar (Cápsulas usa el mismo store) y
  // sincroniza la preferencia de vista desde localStorage.
  useEffect(() => {
    setCategory(null)
    setType(null)
    setSearch('')
    setShowFavorites(false)
    initView()
  }, [setCategory, setType, setSearch, setShowFavorites, initView])

  const filtered = useMemo(
    () =>
      filterResources(resources, {
        activeCategory,
        activeType,
        searchQuery,
        showFavoritesOnly,
      }),
    [resources, activeCategory, activeType, searchQuery, showFavoritesOnly]
  )

  const countByCategory = (cat: LibraryCategory) =>
    resources.filter((r) => r.category === cat).length

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Biblioteca</h1>
          <p className={styles.subtitle}>Tu repositorio de conocimiento UX</p>
        </div>
        <SearchBar
          placeholder="Buscar recursos…"
          value={searchQuery}
          onChange={setSearch}
        />
      </header>

      <div className={styles.body}>
        <aside className={styles.filters}>
          <p className={styles.filtersTitle}>Categorías</p>
          <ul className={styles.categoryList}>
            <li>
              <button
                type="button"
                className={`${styles.categoryItem} ${activeCategory === null ? styles.categoryActive : ''}`}
                onClick={() => setCategory(null)}
              >
                <span>Todas</span>
                <span className={styles.count}>{resources.length}</span>
              </button>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className={`${styles.categoryItem} ${activeCategory === cat ? styles.categoryActive : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  <span>{CATEGORY_LABELS[cat]}</span>
                  <span className={styles.count}>{countByCategory(cat)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.main}>
          <div className={styles.pills} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!showFavoritesOnly}
              className={`${styles.pill} ${!showFavoritesOnly ? styles.pillActive : ''}`}
              onClick={() => setShowFavorites(false)}
            >
              Todos
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={showFavoritesOnly}
              className={`${styles.pill} ${showFavoritesOnly ? styles.pillActive : ''}`}
              onClick={() => setShowFavorites(true)}
            >
              ♥ Favoritos
            </button>
            <span className={styles.pillDivider} aria-hidden />
            <button
              type="button"
              role="tab"
              aria-selected={activeType === null}
              className={`${styles.pill} ${activeType === null ? styles.pillActive : ''}`}
              onClick={() => setType(null)}
            >
              Todos los tipos
            </button>
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={activeType === t}
                className={`${styles.pill} ${activeType === t ? styles.pillActive : ''}`}
                onClick={() => setType(t)}
              >
                {RESOURCE_TYPE_LABELS[t]}
              </button>
            ))}

            <span className={styles.viewToggle} role="group" aria-label="Vista">
              <button
                type="button"
                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                title="Vista en cuadrícula"
              >
                ▦ Grid
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                title="Vista en lista"
              >
                ☰ Lista
              </button>
            </span>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title="Sin resultados"
              description="No encontramos recursos con estos filtros. Prueba con otra categoría o limpia la búsqueda."
              action={{
                label: 'Limpiar filtros',
                onClick: () => {
                  setCategory(null)
                  setType(null)
                  setSearch('')
                  setShowFavorites(false)
                },
              }}
            />
          ) : view === 'list' ? (
            <div className={styles.list}>
              {filtered.map((r) => (
                <div key={r.id} className={styles.listRow}>
                  <span className={styles.listEmoji} aria-hidden="true">
                    {r.thumbnailEmoji}
                  </span>
                  <div className={styles.listMain}>
                    <span className={styles.listTitle}>
                      {r.title}
                      <span className={styles.listType}>
                        {RESOURCE_TYPE_LABELS[r.type]}
                      </span>
                    </span>
                    <span className={styles.listSub}>
                      {r.author && <span>{r.author}</span>}
                      {r.author && <span> · </span>}
                      <span>{r.category}</span>
                    </span>
                    <div className={styles.listTags}>
                      {r.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={styles.listTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {r.readTime && (
                    <span className={styles.listTime}>{r.readTime}</span>
                  )}
                  <button
                    type="button"
                    className={`${styles.listFav} ${r.isFavorite ? styles.listFavActive : ''}`}
                    onClick={() => toggleFavoriteResource(r.id)}
                    aria-pressed={r.isFavorite}
                    aria-label={
                      r.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
                    }
                  >
                    {r.isFavorite ? '♥' : '♡'}
                  </button>
                  <a
                    className={styles.listView}
                    href={r.url || undefined}
                    target={r.url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    Ver →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  onToggleFavorite={toggleFavoriteResource}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
