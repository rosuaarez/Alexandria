-- ─────────────────────────────────────────────────────────────────────────
-- Migration 002 — Equipo (miembros + comentarios)
-- Sprint 8. NO EJECUTAR automáticamente: correr manualmente en Supabase.
-- ─────────────────────────────────────────────────────────────────────────

-- Miembros del equipo. user_id es null mientras el miembro está "invited" y
-- aún no ha creado su cuenta en auth.users.
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  role text not null default 'researcher' check (role in ('researcher', 'leader', 'stakeholder')),
  initials text not null default '',
  avatar_color text not null default '#6D28C7',
  status text not null default 'invited' check (status in ('active', 'invited', 'inactive')),
  protocols_count integer not null default 0,
  joined_at timestamptz not null default now()
);

-- Comentarios por campo de un protocolo (revisión colaborativa).
create table if not exists public.protocol_comments (
  id uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.protocols(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  field_key text not null,
  field_label text not null default '',
  text text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Respuestas a un comentario.
create table if not exists public.comment_replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.protocol_comments(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_team_members_status on public.team_members (status);
create index if not exists idx_protocol_comments_protocol on public.protocol_comments (protocol_id);
create index if not exists idx_comment_replies_comment on public.comment_replies (comment_id);
