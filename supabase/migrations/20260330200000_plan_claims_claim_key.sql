-- plan_claims: global scarcity + optional secret for releasing a claim across devices
create table if not exists public.plan_claims (
  plan_id text primary key,
  session_id text not null,
  claimed_at timestamptz not null default now()
);

alter table public.plan_claims add column if not exists claim_key uuid;
alter table public.plan_claims add column if not exists claimed_at timestamptz default now();

update public.plan_claims set claim_key = gen_random_uuid() where claim_key is null;

alter table public.plan_claims alter column claim_key set default gen_random_uuid();
alter table public.plan_claims alter column claim_key set not null;

create unique index if not exists plan_claims_claim_key_uniq on public.plan_claims (claim_key);

-- Enable Realtime for this table in Supabase Dashboard → Database → Publications,
-- or run: alter publication supabase_realtime add table public.plan_claims;
