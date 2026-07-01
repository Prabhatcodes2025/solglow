do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'enquiries'
      and policyname = 'Anonymous cannot read enquiries'
  ) then
    create policy "Anonymous cannot read enquiries"
    on public.enquiries
    as restrictive
    for select
    to anon
    using (false);
  end if;
end $$;
