import { createClient } from '@/lib/supabase/client'
import { FLAGS } from '@/lib/config/flags'
import { MOCK_LIBRARY_RESOURCES } from '@/lib/data/mockLibrary'
import { MOCK_CAPSULAS } from '@/lib/data/mockCapsulas'
import type {
  Capsula,
  CapsulaCategory,
  LibraryCategory,
  LibraryResource,
  LibraryResourceType,
  ProtocolType,
} from '@/lib/types'

// Acceso a Biblioteca y Cápsulas en Supabase. PREPARADO (Sprint 8): mientras
// FLAGS.USE_REAL_SUPABASE sea false, todas las funciones devuelven los mocks.
// El esquema vive en migrations/001_library.sql (no ejecutado aún).

const RESOURCES_TABLE = 'library_resources'
const CAPSULAS_TABLE = 'capsulas'

interface ResourceRow {
  id: string
  title: string
  description: string | null
  type: string
  category: string
  tags: string[] | null
  url: string | null
  thumbnail_emoji: string | null
  author: string | null
  read_time: string | null
  is_new: boolean | null
  created_at: string
}

interface CapsulaRow {
  id: string
  title: string
  description: string | null
  content: string | null
  category: string
  tags: string[] | null
  emoji: string | null
  read_time: string | null
  author: string | null
  related_protocol_types: string[] | null
  is_new: boolean | null
  created_at: string
}

function toResource(row: ResourceRow, favoriteIds: Set<string>): LibraryResource {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    type: row.type as LibraryResourceType,
    category: row.category as LibraryCategory,
    tags: row.tags ?? [],
    url: row.url ?? undefined,
    thumbnailEmoji: row.thumbnail_emoji ?? '📄',
    author: row.author ?? undefined,
    readTime: row.read_time ?? undefined,
    isFavorite: favoriteIds.has(row.id),
    isNew: row.is_new ?? false,
    createdAt: row.created_at,
  }
}

function toCapsula(row: CapsulaRow, favoriteIds: Set<string>): Capsula {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    content: row.content ?? '',
    category: row.category as CapsulaCategory,
    tags: row.tags ?? [],
    emoji: row.emoji ?? '💡',
    readTime: row.read_time ?? '',
    isFavorite: favoriteIds.has(row.id),
    isNew: row.is_new ?? false,
    author: row.author ?? '',
    createdAt: row.created_at,
    relatedProtocolTypes: (row.related_protocol_types ?? []) as ProtocolType[],
  }
}

export async function loadLibraryResources(
  userId: string
): Promise<LibraryResource[]> {
  if (!FLAGS.USE_REAL_SUPABASE) return MOCK_LIBRARY_RESOURCES

  const supabase = createClient()
  const [{ data: rows, error }, { data: favs }] = await Promise.all([
    supabase.from(RESOURCES_TABLE).select('*').order('created_at', { ascending: false }),
    supabase.from('library_favorites').select('resource_id').eq('user_id', userId),
  ])
  if (error) throw new Error(error.message)
  const favoriteIds = new Set((favs ?? []).map((f) => f.resource_id as string))
  return (rows ?? []).map((r) => toResource(r as ResourceRow, favoriteIds))
}

export async function loadCapsulas(userId: string): Promise<Capsula[]> {
  if (!FLAGS.USE_REAL_SUPABASE) return MOCK_CAPSULAS

  const supabase = createClient()
  const [{ data: rows, error }, { data: favs }] = await Promise.all([
    supabase.from(CAPSULAS_TABLE).select('*').order('created_at', { ascending: false }),
    supabase.from('capsula_favorites').select('capsula_id').eq('user_id', userId),
  ])
  if (error) throw new Error(error.message)
  const favoriteIds = new Set((favs ?? []).map((f) => f.capsula_id as string))
  return (rows ?? []).map((r) => toCapsula(r as CapsulaRow, favoriteIds))
}
