create table if not exists public.user_profile_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint user_profile_follows_no_self check (follower_id <> following_id)
);

create index if not exists user_profile_follows_following_id_idx
  on public.user_profile_follows (following_id);

alter table public.user_profile_follows enable row level security;

grant select, insert, delete on table public.user_profile_follows to authenticated;

drop policy if exists "user_profile_follows_select_own" on public.user_profile_follows;
create policy "user_profile_follows_select_own"
  on public.user_profile_follows
  for select
  to authenticated
  using ((select auth.uid()) = follower_id);

drop policy if exists "user_profile_follows_insert_own" on public.user_profile_follows;
create policy "user_profile_follows_insert_own"
  on public.user_profile_follows
  for insert
  to authenticated
  with check (
    (select auth.uid()) = follower_id
    and follower_id <> following_id
  );

drop policy if exists "user_profile_follows_delete_own" on public.user_profile_follows;
create policy "user_profile_follows_delete_own"
  on public.user_profile_follows
  for delete
  to authenticated
  using ((select auth.uid()) = follower_id);
