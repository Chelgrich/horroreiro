alter table public.movies
  add column if not exists runtime_minutes integer;

alter table public.movies
  drop constraint if exists movies_runtime_minutes_range;

alter table public.movies
  add constraint movies_runtime_minutes_range
  check (
    runtime_minutes is null
    or runtime_minutes between 1 and 999
  );
