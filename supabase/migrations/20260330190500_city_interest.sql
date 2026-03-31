create table if not exists public.city_interest (
  id bigserial primary key,
  city text not null,
  email text,
  kind text,
  created_at timestamptz not null default now()
);

create index if not exists city_interest_created_at_idx
  on public.city_interest (created_at desc);

create index if not exists city_interest_city_idx
  on public.city_interest (city);

