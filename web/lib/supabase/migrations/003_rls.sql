-- ─────────────────────────────────────────────────────────────────────────
-- Migration 003 — Row Level Security (RLS)
-- Sprint 8. NO EJECUTAR automáticamente: revisar y correr manualmente.
-- Ejecutar DESPUÉS de 001 y 002. Asume Supabase Auth (auth.uid()).
-- ─────────────────────────────────────────────────────────────────────────

-- ── protocols ────────────────────────────────────────────────────────────
-- Cada usuario solo ve y gestiona sus propios protocolos.
alter table public.protocols enable row level security;

drop policy if exists "protocols_select_own" on public.protocols;
create policy "protocols_select_own" on public.protocols
  for select using (auth.uid() = user_id);

drop policy if exists "protocols_insert_own" on public.protocols;
create policy "protocols_insert_own" on public.protocols
  for insert with check (auth.uid() = user_id);

drop policy if exists "protocols_update_own" on public.protocols;
create policy "protocols_update_own" on public.protocols
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "protocols_delete_own" on public.protocols;
create policy "protocols_delete_own" on public.protocols
  for delete using (auth.uid() = user_id);

-- ── library_resources / capsulas (catálogo de solo lectura) ───────────────
-- Cualquier usuario autenticado puede leer el catálogo. Escritura reservada
-- (por ahora) a quien tenga rol 'leader' en team_members.
alter table public.library_resources enable row level security;
alter table public.capsulas enable row level security;

drop policy if exists "library_select_auth" on public.library_resources;
create policy "library_select_auth" on public.library_resources
  for select using (auth.role() = 'authenticated');

drop policy if exists "capsulas_select_auth" on public.capsulas;
create policy "capsulas_select_auth" on public.capsulas
  for select using (auth.role() = 'authenticated');

-- ── favoritos (per-user) ──────────────────────────────────────────────────
alter table public.library_favorites enable row level security;
alter table public.capsula_favorites enable row level security;

drop policy if exists "library_fav_own" on public.library_favorites;
create policy "library_fav_own" on public.library_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "capsula_fav_own" on public.capsula_favorites;
create policy "capsula_fav_own" on public.capsula_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── team_members ──────────────────────────────────────────────────────────
-- Todos los autenticados pueden ver el equipo; solo un 'leader' puede mutarlo.
alter table public.team_members enable row level security;

drop policy if exists "team_select_auth" on public.team_members;
create policy "team_select_auth" on public.team_members
  for select using (auth.role() = 'authenticated');

drop policy if exists "team_write_leader" on public.team_members;
create policy "team_write_leader" on public.team_members
  for all using (
    exists (
      select 1 from public.team_members tm
      where tm.user_id = auth.uid() and tm.role = 'leader'
    )
  );

-- ── comentarios ───────────────────────────────────────────────────────────
-- Visibles para el dueño del protocolo y el autor del comentario.
alter table public.protocol_comments enable row level security;
alter table public.comment_replies enable row level security;

drop policy if exists "comments_select" on public.protocol_comments;
create policy "comments_select" on public.protocol_comments
  for select using (
    author_id = auth.uid()
    or exists (
      select 1 from public.protocols p
      where p.id = protocol_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "comments_insert_own" on public.protocol_comments;
create policy "comments_insert_own" on public.protocol_comments
  for insert with check (author_id = auth.uid());

drop policy if exists "replies_insert_own" on public.comment_replies;
create policy "replies_insert_own" on public.comment_replies
  for insert with check (author_id = auth.uid());

drop policy if exists "replies_select" on public.comment_replies;
create policy "replies_select" on public.comment_replies
  for select using (
    author_id = auth.uid()
    or exists (
      select 1 from public.protocol_comments c
      join public.protocols p on p.id = c.protocol_id
      where c.id = comment_id and p.user_id = auth.uid()
    )
  );
