-- Solglow CMS: run in a new Supabase project's SQL editor.
create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'editor');
create type public.enquiry_status as enum ('new', 'contacted', 'qualified', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')); $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create or replace function public.create_profile_for_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles(id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email)); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile_for_user();

create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique, subtitle text, body text,
  image_url text, cta_label text, cta_url text, metadata jsonb not null default '{}'::jsonb,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.hero_sections (
  id uuid primary key default gen_random_uuid(), title text not null, page_key text unique not null, eyebrow text, subtitle text,
  image_url text, cta_label text, cta_url text, metadata jsonb not null default '{}'::jsonb,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.about_sections (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique, subtitle text, body text, image_url text,
  metadata jsonb not null default '{}'::jsonb, sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.services (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null, nav_label text, eyebrow text,
  summary text, body text, image_url text, icon text, benefits jsonb not null default '[]'::jsonb, cta_label text, cta_url text,
  faqs jsonb not null default '[]'::jsonb, metadata jsonb not null default '{}'::jsonb,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique, project_type text, capacity text,
  location text, completion_year int, description text, image_url text, gallery jsonb not null default '[]'::jsonb,
  status text default 'completed', metadata jsonb not null default '{}'::jsonb,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(), title text not null, category text, image_url text not null, alt_text text,
  description text, metadata jsonb not null default '{}'::jsonb, sort_order int not null default 0,
  is_published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.testimonials (
  id uuid primary key default gen_random_uuid(), title text not null, customer_name text not null, company text, quote text not null,
  rating int check (rating between 1 and 5), image_url text, metadata jsonb not null default '{}'::jsonb,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.faqs (
  id uuid primary key default gen_random_uuid(), title text not null, page_key text not null default 'home', answer text not null,
  metadata jsonb not null default '{}'::jsonb, sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.contact_details (
  id uuid primary key default gen_random_uuid(), title text not null, key text unique not null, value text not null,
  metadata jsonb not null default '{}'::jsonb, sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.social_links (
  id uuid primary key default gen_random_uuid(), title text not null, platform text not null, url text not null, icon text,
  metadata jsonb not null default '{}'::jsonb, sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.seo_settings (
  id uuid primary key default gen_random_uuid(), title text not null, page_key text unique not null, meta_title text,
  meta_description text, canonical_url text, og_image text, schema_json jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb, sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.enquiries (
  id uuid primary key default gen_random_uuid(), name text not null, phone text not null, email text not null,
  service text not null, message text not null, source text, status public.enquiry_status not null default 'new',
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

do $$ declare table_name text; begin
  foreach table_name in array array['homepage_sections','hero_sections','about_sections','services','projects','gallery_items','testimonials','faqs','contact_details','social_links','seo_settings','enquiries'] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_' || table_name, table_name);
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;
alter table public.profiles enable row level security;

do $$ declare table_name text; begin
  foreach table_name in array array['homepage_sections','hero_sections','about_sections','services','projects','gallery_items','testimonials','faqs','contact_details','social_links','seo_settings'] loop
    execute format('create policy "Published content is public" on public.%I for select using (is_published or public.is_staff())', table_name);
    execute format('create policy "Staff can insert" on public.%I for insert to authenticated with check (public.is_staff())', table_name);
    execute format('create policy "Staff can update" on public.%I for update to authenticated using (public.is_staff()) with check (public.is_staff())', table_name);
    execute format('create policy "Staff can delete" on public.%I for delete to authenticated using (public.is_staff())', table_name);
  end loop;
end $$;
create policy "Anyone can create an enquiry" on public.enquiries for insert to anon, authenticated with check (status = 'new');
create policy "Staff can view enquiries" on public.enquiries for select to authenticated using (public.is_staff());
create policy "Staff can update enquiries" on public.enquiries for update to authenticated using (public.is_staff());
create policy "Admins can delete enquiries" on public.enquiries for delete to authenticated using (public.is_admin());
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "Admins can update profiles" on public.profiles for update to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-media', 'cms-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;
create policy "Public media read" on storage.objects for select using (bucket_id = 'cms-media');
create policy "Staff media upload" on storage.objects for insert to authenticated with check (bucket_id = 'cms-media' and public.is_staff());
create policy "Staff media update" on storage.objects for update to authenticated using (bucket_id = 'cms-media' and public.is_staff());
create policy "Staff media delete" on storage.objects for delete to authenticated using (bucket_id = 'cms-media' and public.is_staff());

-- Promote the first account after signup:
-- update public.profiles set role = 'admin' where id = '<auth-user-uuid>';
