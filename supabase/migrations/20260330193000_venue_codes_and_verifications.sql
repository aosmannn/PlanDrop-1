create table if not exists public.venue_code_issues (
  id bigserial primary key,
  code text not null,
  plan_id text not null,
  session_id text not null,
  issued_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create unique index if not exists venue_code_issues_code_uniq
  on public.venue_code_issues (code);

create index if not exists venue_code_issues_plan_idx
  on public.venue_code_issues (plan_id);

create index if not exists venue_code_issues_session_idx
  on public.venue_code_issues (session_id);

create table if not exists public.venue_verifications (
  id bigserial primary key,
  code text not null,
  plan_id text not null,
  session_id text not null,
  venue_name text not null,
  group_size int,
  note text,
  verified_at timestamptz not null default now()
);

create index if not exists venue_verifications_verified_at_idx
  on public.venue_verifications (verified_at desc);

create index if not exists venue_verifications_venue_idx
  on public.venue_verifications (venue_name);

