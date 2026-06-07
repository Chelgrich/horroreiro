create table if not exists public.movie_poster_images (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  image_url text not null,
  position integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint movie_poster_images_image_url_not_blank check (length(btrim(image_url)) > 0)
);

create index if not exists movie_poster_images_movie_position_idx
  on public.movie_poster_images (movie_id, position, created_at, id);

alter table public.movie_poster_images enable row level security;

grant select on table public.movie_poster_images to anon, authenticated;
grant insert, update, delete on table public.movie_poster_images to authenticated;

drop policy if exists "movie_poster_images_select_all" on public.movie_poster_images;
create policy "movie_poster_images_select_all"
  on public.movie_poster_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "movie_poster_images_insert_admin" on public.movie_poster_images;
create policy "movie_poster_images_insert_admin"
  on public.movie_poster_images
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

drop policy if exists "movie_poster_images_update_admin" on public.movie_poster_images;
create policy "movie_poster_images_update_admin"
  on public.movie_poster_images
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

drop policy if exists "movie_poster_images_delete_admin" on public.movie_poster_images;
create policy "movie_poster_images_delete_admin"
  on public.movie_poster_images
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
