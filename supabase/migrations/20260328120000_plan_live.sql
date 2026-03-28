-- plan_live: pool rows for realtime (matches lib/supabase/type.ts Plan shape)
-- Run via Supabase Dashboard → SQL Editor, or: supabase db push (linked project)

create table if not exists public.plan_live (
  id text primary key,
  area text not null,
  vibe text not null check (vibe in ('chill', 'active', 'foodie', 'adventurous')),
  group_size_min int not null,
  group_size_max int not null,
  title text not null,
  hook text not null,
  stops jsonb not null default '[]'::jsonb,
  cost_per_person numeric not null,
  claimed_by text,
  claimed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists plan_live_area_idx on public.plan_live (area);

alter table public.plan_live enable row level security;

drop policy if exists "plan_live_select_anon" on public.plan_live;
create policy "plan_live_select_anon"
  on public.plan_live
  for select
  to anon, authenticated
  using (true);

-- Realtime: broadcast changes to subscribed clients (confirm in Dashboard → Realtime)
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'plan_live'
  ) then
    alter publication supabase_realtime add table public.plan_live;
  end if;
end $$;
