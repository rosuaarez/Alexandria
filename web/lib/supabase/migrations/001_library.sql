-- ─────────────────────────────────────────────────────────────────────────
-- Migration 001 — Biblioteca y Cápsulas
-- Sprint 8. NO EJECUTAR automáticamente: revisar y correr manualmente en el
-- SQL Editor de Supabase cuando se decida activar estas tablas.
-- NO modifica la tabla `protocols` existente.
-- ─────────────────────────────────────────────────────────────────────────

-- Recursos de la biblioteca (catálogo compartido por todo el equipo).
create table if not exists public.library_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  type text not null check (type in ('article', 'video', 'template', 'guide', 'tool', 'book')),
  category text not null check (category in (
    'usabilidad', 'entrevistas', 'metricas', 'accesibilidad',
    'investigacion', 'herramientas', 'metodologia'
  )),
  tags text[] not null default '{}',
  url text,
  thumbnail_emoji text not null default '📄',
  author text,
  read_time text,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

-- Cápsulas de conocimiento (catálogo compartido).
create table if not exists public.capsulas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  content text not null default '',
  category text not null check (category in ('metodo', 'consejo', 'caso-estudio', 'herramienta', 'dato')),
  tags text[] not null default '{}',
  emoji text not null default '💡',
  read_time text not null default '',
  author text not null default '',
  related_protocol_types text[] not null default '{}',
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

-- Favoritos por usuario (el campo isFavorite del modelo es per-user).
create table if not exists public.library_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.library_resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

create table if not exists public.capsula_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  capsula_id uuid not null references public.capsulas(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, capsula_id)
);

create index if not exists idx_library_resources_category on public.library_resources (category);
create index if not exists idx_capsulas_category on public.capsulas (category);
