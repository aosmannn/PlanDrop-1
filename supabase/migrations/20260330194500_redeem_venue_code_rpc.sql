-- Atomic redeem + verification insert (prevents partial writes)
create or replace function public.redeem_venue_code(
  p_code text,
  p_venue_name text,
  p_group_size int default null,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_issue record;
begin
  select id, plan_id, session_id, redeemed_at
    into v_issue
  from public.venue_code_issues
  where code = upper(trim(p_code))
  order by issued_at desc
  limit 1;

  if not found then
    return jsonb_build_object('status', 'invalid_code');
  end if;

  if v_issue.redeemed_at is not null then
    return jsonb_build_object('status', 'already_verified');
  end if;

  update public.venue_code_issues
    set redeemed_at = now()
  where id = v_issue.id
    and redeemed_at is null;

  if not found then
    return jsonb_build_object('status', 'already_verified');
  end if;

  insert into public.venue_verifications (
    code,
    plan_id,
    session_id,
    venue_name,
    group_size,
    note
  ) values (
    upper(trim(p_code)),
    v_issue.plan_id,
    v_issue.session_id,
    trim(p_venue_name),
    p_group_size,
    nullif(trim(coalesce(p_note, '')), '')
  );

  return jsonb_build_object('status', 'ok');
end;
$$;

-- Lock down function privileges; let service role handle execution.
revoke all on function public.redeem_venue_code(text, text, int, text) from public;

