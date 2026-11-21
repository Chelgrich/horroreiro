begin;
set local lock_timeout = '3s';

create table public.catalog_movie_index_revision (
  singleton boolean primary key default true check (singleton),
  revision uuid not null default pg_catalog.gen_random_uuid()
);

alter table public.catalog_movie_index_revision enable row level security;
revoke all on public.catalog_movie_index_revision from public, anon, authenticated;
grant select (revision) on public.catalog_movie_index_revision to anon, authenticated;

create policy read_catalog_revision on public.catalog_movie_index_revision
  for select to anon, authenticated using (true);

insert into public.catalog_movie_index_revision default values;

create function public.bump_catalog_movie_index_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.catalog_movie_index_revision
  set revision = pg_catalog.gen_random_uuid()
  where singleton;
  return null;
end;
$$;

revoke all on function public.bump_catalog_movie_index_revision() from public, anon, authenticated;

do $$
declare
  source_table text;
begin
  foreach source_table in array array['movies', 'movie_genres', 'genres', 'movie_countries', 'countries'] loop
    execute format('create trigger bump_catalog_movie_index_revision
      after insert or update or delete or truncate on public.%I
      for each statement execute function public.bump_catalog_movie_index_revision()', source_table);
  end loop;
end;
$$;

notify pgrst, 'reload schema';
commit;
