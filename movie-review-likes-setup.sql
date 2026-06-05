create table if not exists public.movie_review_likes (
  review_id uuid not null references public.movie_reviews(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

create index if not exists movie_review_likes_review_id_idx
  on public.movie_review_likes (review_id);

create index if not exists movie_review_likes_user_id_idx
  on public.movie_review_likes (user_id);

create or replace function public.prevent_self_movie_review_like()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.movie_reviews
    where movie_reviews.id = new.review_id
      and movie_reviews.user_id = new.user_id
  ) then
    raise exception 'Users cannot like their own reviews'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_self_movie_review_like() from public, anon, authenticated;

drop trigger if exists movie_review_likes_prevent_self_like on public.movie_review_likes;
create trigger movie_review_likes_prevent_self_like
  before insert or update on public.movie_review_likes
  for each row
  execute function public.prevent_self_movie_review_like();

alter table public.movie_review_likes enable row level security;

grant select on table public.movie_review_likes to anon, authenticated;
grant insert, delete on table public.movie_review_likes to authenticated;

drop policy if exists "movie_review_likes_select_all" on public.movie_review_likes;
create policy "movie_review_likes_select_all"
  on public.movie_review_likes
  for select
  to public
  using (true);

drop policy if exists "movie_review_likes_insert_own_not_author" on public.movie_review_likes;
create policy "movie_review_likes_insert_own_not_author"
  on public.movie_review_likes
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.movie_reviews
      where movie_reviews.id = movie_review_likes.review_id
        and movie_reviews.user_id <> movie_review_likes.user_id
    )
  );

drop policy if exists "movie_review_likes_delete_own" on public.movie_review_likes;
create policy "movie_review_likes_delete_own"
  on public.movie_review_likes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
