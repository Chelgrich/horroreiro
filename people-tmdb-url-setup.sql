alter table public.people
  add column if not exists tmdb_url text;

create index if not exists people_tmdb_url_idx
  on public.people (tmdb_url)
  where tmdb_url is not null;
