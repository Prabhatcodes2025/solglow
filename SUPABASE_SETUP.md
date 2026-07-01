# Solglow CMS Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. Add these environment variables locally and in Vercel:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

4. Create the first team member in Supabase Authentication.
5. Promote approved staff profiles in the SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = '<auth-user-uuid>';
```

6. If the database was created before July 1, 2026, also run `supabase/migrations/20260701_harden_auth_roles.sql`.
7. Redeploy and visit `/admin`.

The public website is fallback-first. Existing approved content remains visible when Supabase is unavailable or a module has no published records. Published CMS records override their matching public module.

## Roles

- `admin`: full CMS access, including destructive enquiry operations and team role management through Supabase.
- `editor`: content, media and enquiry workflow access; protected by Row Level Security.
- `viewer`: default new-auth-user role with no CMS write access.

## Content Keys

Use these `page_key` values for hero, FAQ and SEO records:

- `home`
- `about`
- `projects-gallery`
- `why-solar`
- `contact`
- The service slug, such as `residential-solar`

Contact detail keys can include `company`, `address`, `phone`, `mobile`, `email`, `website`, and `director`.
