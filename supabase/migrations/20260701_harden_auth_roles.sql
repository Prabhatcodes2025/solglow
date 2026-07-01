-- Apply this after the initial schema if the production project was already created.
alter type public.app_role add value if not exists 'viewer';

alter table public.profiles
alter column role set default 'viewer';

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')); $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;
