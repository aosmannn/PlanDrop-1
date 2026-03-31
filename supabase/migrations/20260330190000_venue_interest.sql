create table if not exists public.venue_interest (
  id bigserial primary key,
  business text not null,
  email text not null,
  neighborhood text not null,
  role text,
  phone text,
  venue_type text,
  website text,
  created_at timestamptz not null default now()
);

create index if not exists venue_interest_created_at_idx
  on public.venue_interest (created_at desc);
