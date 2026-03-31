-- plan_claims: add TTL + enforce one active claim per session_id
-- This keeps the live board from getting stuck behind stale claims
-- and prevents one device/session from locking multiple plans at once.

alter table public.plan_claims
  add column if not exists expires_at timestamptz,
  add column if not exists released_at timestamptz;

-- Backfill expiry for existing rows (3 hours from claim time).
update public.plan_claims
set expires_at = coalesce(expires_at, claimed_at + interval '3 hours')
where expires_at is null;

alter table public.plan_claims
  alter column expires_at set not null;

create index if not exists plan_claims_expires_at_idx
  on public.plan_claims (expires_at);

-- Enforce one active claim per session_id (table only stores active claims).
create unique index if not exists plan_claims_session_id_uniq
  on public.plan_claims (session_id);

