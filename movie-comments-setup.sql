create table if not exists public.movie_comments (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.movie_comments(id),
  reply_to_comment_id uuid references public.movie_comments(id) on delete set null,
  root_review_id uuid references public.movie_reviews(id) on delete cascade,
  depth smallint not null default 0,
  comment_text text not null default '',
  contains_spoilers boolean not null default false,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint movie_comments_depth_check check (depth between 0 and 2),
  constraint movie_comments_text_check check (
    is_deleted
    or (
      char_length(btrim(comment_text)) between 1 and 1200
    )
  )
);

create index if not exists movie_comments_movie_root_created_idx
  on public.movie_comments (movie_id, root_review_id, parent_comment_id, created_at, id);

create index if not exists movie_comments_parent_idx
  on public.movie_comments (parent_comment_id);

create index if not exists movie_comments_reply_to_idx
  on public.movie_comments (reply_to_comment_id);

create table if not exists public.movie_comment_likes (
  comment_id uuid not null references public.movie_comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists movie_comment_likes_user_idx
  on public.movie_comment_likes (user_id);

create or replace function public.set_movie_comment_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_movie_comment_updated_at on public.movie_comments;
create trigger set_movie_comment_updated_at
  before update on public.movie_comments
  for each row
  execute function public.set_movie_comment_updated_at();

alter table public.movie_comments enable row level security;
alter table public.movie_comment_likes enable row level security;

grant select on table public.movie_comments to anon, authenticated;
grant insert, update, delete on table public.movie_comments to authenticated;
grant select on table public.movie_comment_likes to anon, authenticated;
grant insert, delete on table public.movie_comment_likes to authenticated;

revoke insert, update, delete, truncate, references, trigger on table public.movie_comments from anon;
revoke truncate, references, trigger on table public.movie_comments from authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.movie_comment_likes from anon;
revoke update, truncate, references, trigger on table public.movie_comment_likes from authenticated;

drop policy if exists "movie_comments_select_all" on public.movie_comments;
create policy "movie_comments_select_all"
  on public.movie_comments
  for select
  to anon, authenticated
  using (true);

drop policy if exists "movie_comments_insert_own" on public.movie_comments;
create policy "movie_comments_insert_own"
  on public.movie_comments
  for insert
  to authenticated
  with check (
    movie_comments.user_id = (select auth.uid())
    and movie_comments.is_deleted = false
    and char_length(btrim(movie_comments.comment_text)) between 1 and 1200
    and movie_comments.depth between 0 and 2
    and (
      (movie_comments.parent_comment_id is null and movie_comments.depth = 0)
      or exists (
        select 1
        from public.movie_comments parent
        where parent.id = movie_comments.parent_comment_id
          and parent.movie_id = movie_comments.movie_id
          and parent.root_review_id is not distinct from movie_comments.root_review_id
          and parent.is_deleted = false
          and movie_comments.depth = least(parent.depth + 1, 2)
      )
    )
    and (
      movie_comments.root_review_id is null
      or exists (
        select 1
        from public.movie_reviews review
        where review.id = movie_comments.root_review_id
          and review.movie_id = movie_comments.movie_id
      )
    )
    and (
      movie_comments.root_review_id is null
      or exists (
        select 1
        from public.movie_ratings rating
        where rating.movie_id = movie_comments.movie_id
          and rating.user_id = (select auth.uid())
      )
    )
    and (
      movie_comments.reply_to_comment_id is null
      or exists (
        select 1
        from public.movie_comments target
        where target.id = movie_comments.reply_to_comment_id
          and target.movie_id = movie_comments.movie_id
          and target.root_review_id is not distinct from movie_comments.root_review_id
          and target.is_deleted = false
      )
    )
  );

drop policy if exists "movie_comments_update_own_or_admin" on public.movie_comments;
create policy "movie_comments_update_own_or_admin"
  on public.movie_comments
  for update
  to authenticated
  using (
    movie_comments.user_id = (select auth.uid())
    or exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    (
      movie_comments.user_id = (select auth.uid())
      or exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.role = 'admin'
      )
    )
    and (
      movie_comments.is_deleted
      or char_length(btrim(movie_comments.comment_text)) between 1 and 1200
    )
  );

drop policy if exists "movie_comments_delete_own_leaf_or_admin" on public.movie_comments;
create policy "movie_comments_delete_own_leaf_or_admin"
  on public.movie_comments
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
    or movie_comments.user_id = (select auth.uid())
  );

drop policy if exists "movie_comment_likes_select_all" on public.movie_comment_likes;
create policy "movie_comment_likes_select_all"
  on public.movie_comment_likes
  for select
  to anon, authenticated
  using (true);

drop policy if exists "movie_comment_likes_insert_not_own" on public.movie_comment_likes;
create policy "movie_comment_likes_insert_not_own"
  on public.movie_comment_likes
  for insert
  to authenticated
  with check (
    movie_comment_likes.user_id = (select auth.uid())
    and exists (
      select 1
      from public.movie_comments comment
      where comment.id = movie_comment_likes.comment_id
        and comment.user_id <> (select auth.uid())
        and comment.is_deleted = false
    )
  );

drop policy if exists "movie_comment_likes_delete_own" on public.movie_comment_likes;
create policy "movie_comment_likes_delete_own"
  on public.movie_comment_likes
  for delete
  to authenticated
  using (movie_comment_likes.user_id = (select auth.uid()));
