-- Company pages for movie production/distribution values.
-- Apply manually in Supabase SQL editor before using /production, /distributors,
-- /russian-distributors, and /company/<slug>.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_key text not null,
  slug text not null,
  country text,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_name_not_empty check (btrim(name) <> ''),
  constraint companies_name_key_not_empty check (btrim(name_key) <> ''),
  constraint companies_slug_not_empty check (btrim(slug) <> '')
);

create unique index if not exists companies_name_key_idx
  on public.companies (name_key);

create unique index if not exists companies_slug_idx
  on public.companies (slug);

create table if not exists public.movie_companies (
  movie_id uuid not null references public.movies(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (movie_id, company_id, role),
  constraint movie_companies_role_check check (
    role in ('production', 'distribution', 'russian_distribution')
  )
);

create index if not exists movie_companies_company_role_idx
  on public.movie_companies (company_id, role, position);

create index if not exists movie_companies_movie_role_position_idx
  on public.movie_companies (movie_id, role, position);

create or replace function public.horroreiro_touch_company_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_touch_updated_at on public.companies;

create trigger companies_touch_updated_at
before update on public.companies
for each row
execute function public.horroreiro_touch_company_updated_at();

create or replace function public.horroreiro_company_slugify(source text)
returns text
language plpgsql
immutable
as $$
declare
  result text := lower(coalesce(source, ''));
begin
  result := replace(result, 'ё', 'e');
  result := replace(result, 'ж', 'zh');
  result := replace(result, 'ц', 'ts');
  result := replace(result, 'ч', 'ch');
  result := replace(result, 'ш', 'sh');
  result := replace(result, 'щ', 'sch');
  result := replace(result, 'ю', 'yu');
  result := replace(result, 'я', 'ya');
  result := translate(
    result,
    'абвгдезийклмнопрстуфхъыэь',
    'abvgdeziyklmnoprstufh-ye-'
  );
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '(^-+|-+$)', '', 'g');
  result := regexp_replace(result, '-{2,}', '-', 'g');

  return nullif(result, '');
end;
$$;

alter table public.companies enable row level security;
alter table public.movie_companies enable row level security;

grant select, insert, update, delete on public.companies to authenticated;
grant select, insert, update, delete on public.movie_companies to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'companies'
      and policyname = 'Admins can manage companies'
  ) then
    create policy "Admins can manage companies"
      on public.companies
      for all
      to authenticated
      using (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      )
      with check (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_companies'
      and policyname = 'Admins can manage movie companies'
  ) then
    create policy "Admins can manage movie companies"
      on public.movie_companies
      for all
      to authenticated
      using (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      )
      with check (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      );
  end if;
end
$$;

with raw_values as (
  select
    movies.id as movie_id,
    'production'::text as role,
    value.company_name,
    value.position::integer - 1 as position
  from public.movies
  cross join lateral unnest(coalesce(movies.production, array[]::text[]))
    with ordinality as value(company_name, position)

  union all

  select
    movies.id as movie_id,
    'distribution'::text as role,
    value.company_name,
    value.position::integer - 1 as position
  from public.movies
  cross join lateral unnest(coalesce(movies.distribution, array[]::text[]))
    with ordinality as value(company_name, position)

  union all

  select
    movies.id as movie_id,
    'russian_distribution'::text as role,
    value.company_name,
    value.position::integer - 1 as position
  from public.movies
  cross join lateral unnest(coalesce(movies.russian_distribution, array[]::text[]))
    with ordinality as value(company_name, position)
),
normalized_values as (
  select
    movie_id,
    role,
    position,
    btrim(company_name) as name,
    replace(lower(regexp_replace(btrim(company_name), '\s+', ' ', 'g')), 'ё', 'е') as name_key
  from raw_values
  where btrim(coalesce(company_name, '')) <> ''
    and lower(btrim(company_name)) <> 'не применимо'
),
company_names as (
  select
    min(name) as name,
    name_key
  from normalized_values
  group by name_key
),
slug_candidates as (
  select
    name,
    name_key,
    coalesce(public.horroreiro_company_slugify(name), 'company-' || substr(md5(name_key), 1, 10)) as slug_base
  from company_names
),
slugs as (
  select
    name,
    name_key,
    case
      when count(*) over (partition by slug_base) > 1
        or exists (
          select 1
          from public.companies existing_company
          where existing_company.slug = slug_base
            and existing_company.name_key <> slug_candidates.name_key
        )
      then slug_base || '-' || substr(md5(name_key), 1, 6)
      else slug_base
    end as slug
  from slug_candidates
)
insert into public.companies (name, name_key, slug)
select name, name_key, slug
from slugs
on conflict (name_key) do nothing;

with raw_values as (
  select
    movies.id as movie_id,
    'production'::text as role,
    value.company_name,
    value.position::integer - 1 as position
  from public.movies
  cross join lateral unnest(coalesce(movies.production, array[]::text[]))
    with ordinality as value(company_name, position)

  union all

  select
    movies.id as movie_id,
    'distribution'::text as role,
    value.company_name,
    value.position::integer - 1 as position
  from public.movies
  cross join lateral unnest(coalesce(movies.distribution, array[]::text[]))
    with ordinality as value(company_name, position)

  union all

  select
    movies.id as movie_id,
    'russian_distribution'::text as role,
    value.company_name,
    value.position::integer - 1 as position
  from public.movies
  cross join lateral unnest(coalesce(movies.russian_distribution, array[]::text[]))
    with ordinality as value(company_name, position)
),
normalized_values as (
  select
    movie_id,
    role,
    position,
    replace(lower(regexp_replace(btrim(company_name), '\s+', ' ', 'g')), 'ё', 'е') as name_key
  from raw_values
  where btrim(coalesce(company_name, '')) <> ''
    and lower(btrim(company_name)) <> 'не применимо'
),
links as (
  select distinct on (normalized_values.movie_id, companies.id, normalized_values.role)
    normalized_values.movie_id,
    companies.id as company_id,
    normalized_values.role,
    normalized_values.position
  from normalized_values
  join public.companies
    on companies.name_key = normalized_values.name_key
  order by normalized_values.movie_id, companies.id, normalized_values.role, normalized_values.position
)
insert into public.movie_companies (movie_id, company_id, role, position)
select movie_id, company_id, role, position
from links
on conflict (movie_id, company_id, role)
do update set position = excluded.position;
