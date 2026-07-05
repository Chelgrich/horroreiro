create extension if not exists pgcrypto;

create or replace function public.horroreiro_person_name_key(value text)
returns text
language sql
immutable
as $$
  select regexp_replace(lower(btrim(coalesce(value, ''))), '\s+', ' ', 'g');
$$;

create or replace function public.horroreiro_slugify(value text)
returns text
language plpgsql
immutable
as $$
declare
  result text := lower(btrim(coalesce(value, '')));
begin
  result := replace(result, 'ё', 'yo');
  result := replace(result, 'ж', 'zh');
  result := replace(result, 'х', 'kh');
  result := replace(result, 'ц', 'ts');
  result := replace(result, 'ч', 'ch');
  result := replace(result, 'ш', 'sh');
  result := replace(result, 'щ', 'sch');
  result := replace(result, 'ю', 'yu');
  result := replace(result, 'я', 'ya');
  result := replace(result, 'й', 'y');
  result := replace(result, 'а', 'a');
  result := replace(result, 'б', 'b');
  result := replace(result, 'в', 'v');
  result := replace(result, 'г', 'g');
  result := replace(result, 'д', 'd');
  result := replace(result, 'е', 'e');
  result := replace(result, 'з', 'z');
  result := replace(result, 'и', 'i');
  result := replace(result, 'к', 'k');
  result := replace(result, 'л', 'l');
  result := replace(result, 'м', 'm');
  result := replace(result, 'н', 'n');
  result := replace(result, 'о', 'o');
  result := replace(result, 'п', 'p');
  result := replace(result, 'р', 'r');
  result := replace(result, 'с', 's');
  result := replace(result, 'т', 't');
  result := replace(result, 'у', 'u');
  result := replace(result, 'ф', 'f');
  result := replace(result, 'ы', 'y');
  result := replace(result, 'э', 'e');
  result := replace(result, 'ь', '');
  result := replace(result, 'ъ', '');
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '(^-|-$)', '', 'g');
  result := regexp_replace(result, '-{2,}', '-', 'g');

  return nullif(result, '');
end;
$$;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ru text not null,
  name text,
  aliases text[] not null default '{}'::text[],
  birth_date date,
  death_date date,
  birth_place text,
  photo_url text,
  tmdb_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  person_name_key text generated always as (public.horroreiro_person_name_key(name_ru)) stored,
  constraint people_name_ru_not_blank check (length(btrim(name_ru)) > 0),
  constraint people_slug_not_blank check (length(btrim(slug)) > 0),
  constraint people_life_dates_order check (
    death_date is null
    or birth_date is null
    or death_date >= birth_date
  )
);

alter table public.people
  add column if not exists tmdb_url text;

create table if not exists public.movie_people (
  movie_id uuid not null references public.movies(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  role text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (movie_id, person_id, role),
  constraint movie_people_role_not_blank check (length(btrim(role)) > 0)
);

create index if not exists people_name_key_idx
  on public.people (person_name_key);

create index if not exists people_slug_idx
  on public.people (slug);

create index if not exists people_tmdb_url_idx
  on public.people (tmdb_url)
  where tmdb_url is not null;

create index if not exists movie_people_role_person_position_idx
  on public.movie_people (role, person_id, position, movie_id);

create index if not exists movie_people_movie_role_position_idx
  on public.movie_people (movie_id, role, position, person_id);

create or replace function public.set_people_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists people_set_updated_at on public.people;
create trigger people_set_updated_at
  before update on public.people
  for each row
  execute function public.set_people_updated_at();

alter table public.people enable row level security;
alter table public.movie_people enable row level security;

grant select on table public.people to anon, authenticated;
grant insert, update, delete on table public.people to authenticated;

grant select on table public.movie_people to anon, authenticated;
grant insert, update, delete on table public.movie_people to authenticated;

drop policy if exists "people_select_all" on public.people;
create policy "people_select_all"
  on public.people
  for select
  to anon, authenticated
  using (true);

drop policy if exists "people_insert_admin" on public.people;
create policy "people_insert_admin"
  on public.people
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "people_update_admin" on public.people;
create policy "people_update_admin"
  on public.people
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "people_delete_admin" on public.people;
create policy "people_delete_admin"
  on public.people
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "movie_people_select_all" on public.movie_people;
create policy "movie_people_select_all"
  on public.movie_people
  for select
  to anon, authenticated
  using (true);

drop policy if exists "movie_people_insert_admin" on public.movie_people;
create policy "movie_people_insert_admin"
  on public.movie_people
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "movie_people_update_admin" on public.movie_people;
create policy "movie_people_update_admin"
  on public.movie_people
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "movie_people_delete_admin" on public.movie_people;
create policy "movie_people_delete_admin"
  on public.movie_people
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'people',
  'people',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "people_storage_select_all" on storage.objects;
create policy "people_storage_select_all"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'people');

drop policy if exists "people_storage_insert_admin" on storage.objects;
create policy "people_storage_insert_admin"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'people'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "people_storage_update_admin" on storage.objects;
create policy "people_storage_update_admin"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'people'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    bucket_id = 'people'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "people_storage_delete_admin" on storage.objects;
create policy "people_storage_delete_admin"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'people'
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create or replace function public.horroreiro_next_person_slug(value text)
returns text
language plpgsql
stable
as $$
declare
  base_slug text := coalesce(public.horroreiro_slugify(value), 'name');
  candidate text := base_slug;
  suffix integer := 2;
begin
  while exists (
    select 1
    from public.people
    where slug = candidate
  ) loop
    candidate := base_slug || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  return candidate;
end;
$$;

with source_people as (
  select distinct btrim(person_name) as name_ru
  from public.movies
  cross join lateral regexp_split_to_table(coalesce(public.movies.director, ''), E'\\s*,\\s*|\\n+') as person_name
  where btrim(person_name) <> ''
)
insert into public.people (name_ru, slug)
select source_people.name_ru, public.horroreiro_next_person_slug(source_people.name_ru)
from source_people
where not exists (
  select 1
  from public.people existing_people
  where existing_people.person_name_key = public.horroreiro_person_name_key(source_people.name_ru)
);

with movie_person_names as (
  select
    movies.id as movie_id,
    btrim(person_name.value) as name_ru,
    greatest(person_name.ordinality::integer - 1, 0) as position
  from public.movies
  cross join lateral regexp_split_to_table(coalesce(movies.director, ''), E'\\s*,\\s*|\\n+') with ordinality as person_name(value, ordinality)
  where btrim(person_name.value) <> ''
),
matched_people as (
  select distinct on (movie_person_names.movie_id, people.id)
    movie_person_names.movie_id,
    people.id as person_id,
    movie_person_names.position
  from movie_person_names
  join public.people
    on people.person_name_key = public.horroreiro_person_name_key(movie_person_names.name_ru)
  order by movie_person_names.movie_id, people.id, movie_person_names.position
)
insert into public.movie_people (movie_id, person_id, role, position)
select movie_id, person_id, 'director', position
from matched_people
on conflict (movie_id, person_id, role) do update
set position = excluded.position;

create or replace function public.get_movie_page_payload(
  p_movie_id uuid default null,
  p_slug text default null,
  p_include_user_state boolean default true
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with selected_movie as (
    select movies.*
    from public.movies
    where
      (p_movie_id is not null and movies.id = p_movie_id)
      or (
        p_movie_id is null
        and nullif(btrim(p_slug), '') is not null
        and movies.slug = nullif(btrim(p_slug), '')
      )
    limit 1
  )
  select case
    when not exists (select 1 from selected_movie) then null
    else (
      select jsonb_build_object(
        'movie',
          to_jsonb(movie)
          || jsonb_build_object(
            'movie_genres',
            coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'position', movie_genres.position,
                  'genres', jsonb_build_object('name', genres.name)
                )
                order by movie_genres.position, genres.name
              )
              from public.movie_genres
              join public.genres
                on genres.id = movie_genres.genre_id
              where movie_genres.movie_id = movie.id
            ), '[]'::jsonb),
            'movie_countries',
            coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'countries', jsonb_build_object('name', countries.name)
                )
                order by countries.name
              )
              from public.movie_countries
              join public.countries
                on countries.id = movie_countries.country_id
              where movie_countries.movie_id = movie.id
            ), '[]'::jsonb),
            'movie_people',
            coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'role', movie_people.role,
                  'position', movie_people.position,
                  'people', to_jsonb(people)
                )
                order by movie_people.role, movie_people.position, people.name_ru
              )
              from public.movie_people
              join public.people
                on people.id = movie_people.person_id
              where movie_people.movie_id = movie.id
            ), '[]'::jsonb)
          ),
        'rating_stats',
          (
            select to_jsonb(movie_rating_stats)
            from public.movie_rating_stats
            where movie_rating_stats.movie_id = movie.id
            limit 1
          ),
        'current_user_rating',
          case
            when p_include_user_state and (select auth.uid()) is not null then (
              select to_jsonb(movie_ratings)
              from public.movie_ratings
              where movie_ratings.movie_id = movie.id
                and movie_ratings.user_id = (select auth.uid())
              limit 1
            )
            else null
          end,
        'current_user_watchlist',
          case
            when p_include_user_state and (select auth.uid()) is not null then (
              select to_jsonb(movie_watchlist)
              from public.movie_watchlist
              where movie_watchlist.movie_id = movie.id
                and movie_watchlist.user_id = (select auth.uid())
              limit 1
            )
            else null
          end,
        'poster_images',
          coalesce((
            select jsonb_agg(
              to_jsonb(movie_poster_images)
              order by movie_poster_images.position, movie_poster_images.created_at, movie_poster_images.id
            )
            from public.movie_poster_images
            where movie_poster_images.movie_id = movie.id
          ), '[]'::jsonb)
      )
      from selected_movie movie
    )
  end;
$$;

grant execute on function public.get_movie_page_payload(uuid, text, boolean) to anon, authenticated;
