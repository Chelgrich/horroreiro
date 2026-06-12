alter table public.movie_reviews
  add column if not exists contains_profanity boolean not null default false;

alter table public.movie_comments
  add column if not exists contains_profanity boolean not null default false;

drop policy if exists "movie_reviews_update_own" on public.movie_reviews;
drop policy if exists "movie_reviews_update_own_or_admin" on public.movie_reviews;
create policy "movie_reviews_update_own_or_admin"
  on public.movie_reviews
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select is_admin())
  )
  with check (
    (select auth.uid()) = user_id
    or (select is_admin())
  );
