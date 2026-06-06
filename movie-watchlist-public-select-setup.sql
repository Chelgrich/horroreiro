grant select on table public.movie_watchlist to anon, authenticated;

drop policy if exists "movie_watchlist_select_public" on public.movie_watchlist;
create policy "movie_watchlist_select_public"
  on public.movie_watchlist
  for select
  to anon, authenticated
  using (true);
