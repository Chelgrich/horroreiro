create table if not exists public.movie_manual_similar (
  movie_id uuid not null references public.movies(id) on delete cascade,
  similar_movie_id uuid not null references public.movies(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  primary key (movie_id, similar_movie_id),
  constraint movie_manual_similar_not_self check (movie_id <> similar_movie_id)
);

create index if not exists movie_manual_similar_similar_movie_id_idx
  on public.movie_manual_similar (similar_movie_id);

alter table public.movie_manual_similar enable row level security;

grant select on table public.movie_manual_similar to anon, authenticated;
grant insert, update, delete on table public.movie_manual_similar to authenticated;
grant select, insert, update, delete on table public.movie_manual_similar to service_role;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_manual_similar'
      and policyname = 'Manual similar links are readable by everyone'
  ) then
    create policy "Manual similar links are readable by everyone"
      on public.movie_manual_similar
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_manual_similar'
      and policyname = 'Admins can insert manual similar links'
  ) then
    create policy "Admins can insert manual similar links"
      on public.movie_manual_similar
      for insert
      to authenticated
      with check ((select public.is_admin()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_manual_similar'
      and policyname = 'Admins can update manual similar links'
  ) then
    create policy "Admins can update manual similar links"
      on public.movie_manual_similar
      for update
      to authenticated
      using ((select public.is_admin()))
      with check ((select public.is_admin()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_manual_similar'
      and policyname = 'Admins can delete manual similar links'
  ) then
    create policy "Admins can delete manual similar links"
      on public.movie_manual_similar
      for delete
      to authenticated
      using ((select public.is_admin()));
  end if;
end $$;

notify pgrst, 'reload schema';
