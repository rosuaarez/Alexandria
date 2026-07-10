-- ─────────────────────────────────────────────────────────────────────────
-- Migration 004 — Perfiles UiX Lingo (SSO) + emp_id en protocols
-- NO EJECUTAR automáticamente: correr manualmente en el proyecto de DATOS.
--
-- MODELO DE IDENTIDAD (importante):
--   AUTH (UiX Lingo) y DATOS (este proyecto) son proyectos Supabase SEPARADOS
--   y NO se unifican. El identificador de usuario proviene de auth.users de
--   UiX Lingo. En ESTE proyecto de datos NO existe ese auth.users, por eso:
--     · user_profiles.id es un uuid PLANO (SIN FK a auth.users).
--     · El scoping por usuario/equipo se hace por columna (user_id / emp_id),
--       NO por RLS con auth.uid() (no hay sesión del proyecto de datos aquí).
--   La escritura en user_profiles se hace EXCLUSIVAMENTE desde el servidor con
--   la service_role key (ver app/api/auth/sync-profile/route.ts), que ignora
--   RLS por diseño. Por eso NO se crean policies de insert/update para anon.
-- ─────────────────────────────────────────────────────────────────────────

-- Cache local del perfil de UiX Lingo, sincronizado en cada login.
create table if not exists public.user_profiles (
  id uuid primary key,                 -- auth.uid() de UiX Lingo (identificador único)
  email text not null unique,
  nombre text not null default '',
  emp_id text,                         -- equipo/empresa; null = "sin equipo"
  proyectos text[] not null default '{}',
  seniority text,
  especialidad text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_emp_id on public.user_profiles (emp_id);
create index if not exists idx_user_profiles_email on public.user_profiles (email);

-- RLS restrictivo por defecto: al habilitar RLS sin ninguna policy, el rol anon
-- (y authenticated) NO puede leer ni escribir. La única vía de escritura es la
-- service_role usada server-side, que hace bypass de RLS. Esto evita que un
-- cliente con la anon key pueda hacerse upsert de un emp_id que no le toca.
alter table public.user_profiles enable row level security;
-- (Intencionalmente SIN policies de insert/update/select para anon.)

-- Equipo dueño del protocolo (para relacionar protocolos con el equipo del
-- usuario). Nullable: los protocolos de usuarios "sin equipo" quedan en null.
alter table public.protocols add column if not exists emp_id text;
create index if not exists idx_protocols_emp_id on public.protocols (emp_id);
