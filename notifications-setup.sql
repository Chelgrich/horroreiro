create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  actor_id uuid references public.profiles(id) on delete set null,
  movie_id uuid references public.movies(id) on delete cascade,
  entity_type text not null default '',
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  dedupe_key text not null,
  created_at timestamptz not null default now(),
  constraint notification_events_type_check check (
    type in (
      'new_movies_digest',
      'review_liked',
      'comment_liked',
      'comment_reply',
      'review_comment',
      'followed_rating',
      'followed_watchlist',
      'followed_review',
      'profile_followed'
    )
  ),
  constraint notification_events_dedupe_key_unique unique (dedupe_key)
);

create index if not exists notification_events_created_at_idx
  on public.notification_events (created_at desc);

create index if not exists notification_events_actor_idx
  on public.notification_events (actor_id, created_at desc);

create index if not exists notification_events_movie_idx
  on public.notification_events (movie_id, created_at desc);

create table if not exists public.notification_deliveries (
  event_id uuid not null references public.notification_events(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (event_id, recipient_id)
);

create index if not exists notification_deliveries_recipient_created_idx
  on public.notification_deliveries (recipient_id, created_at desc);

create index if not exists notification_deliveries_unread_idx
  on public.notification_deliveries (recipient_id, created_at desc)
  where read_at is null;

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notify_new_movies boolean not null default true,
  notify_review_likes boolean not null default true,
  notify_comment_likes boolean not null default true,
  notify_comment_replies boolean not null default true,
  notify_review_comments boolean not null default true,
  notify_new_followers boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_follow_notification_preferences (
  follower_id uuid not null,
  following_id uuid not null,
  notify_ratings boolean not null default true,
  notify_watchlist boolean not null default true,
  notify_reviews boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  foreign key (follower_id, following_id)
    references public.user_profile_follows(follower_id, following_id)
    on delete cascade
);

create index if not exists user_follow_notification_preferences_following_idx
  on public.user_follow_notification_preferences (following_id);

insert into public.notification_preferences (user_id)
select profiles.id
from public.profiles
on conflict (user_id) do nothing;

insert into public.user_follow_notification_preferences (follower_id, following_id)
select follows.follower_id, follows.following_id
from public.user_profile_follows follows
on conflict (follower_id, following_id) do nothing;

create or replace function public.set_notification_preferences_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_notification_preferences_updated_at on public.notification_preferences;
create trigger set_notification_preferences_updated_at
  before update on public.notification_preferences
  for each row
  execute function public.set_notification_preferences_updated_at();

drop trigger if exists set_user_follow_notification_preferences_updated_at on public.user_follow_notification_preferences;
create trigger set_user_follow_notification_preferences_updated_at
  before update on public.user_follow_notification_preferences
  for each row
  execute function public.set_notification_preferences_updated_at();

create or replace function public.ensure_notification_preferences_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke execute on function public.ensure_notification_preferences_for_profile() from public, anon, authenticated;

drop trigger if exists ensure_notification_preferences_after_profile_insert on public.profiles;
create trigger ensure_notification_preferences_after_profile_insert
  after insert on public.profiles
  for each row
  execute function public.ensure_notification_preferences_for_profile();

create or replace function public.create_notification_event(
  p_type text,
  p_actor_id uuid,
  p_movie_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_payload jsonb,
  p_dedupe_key text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
begin
  if p_dedupe_key is null or btrim(p_dedupe_key) = '' then
    return null;
  end if;

  insert into public.notification_events (
    type,
    actor_id,
    movie_id,
    entity_type,
    entity_id,
    payload,
    dedupe_key
  )
  values (
    p_type,
    p_actor_id,
    p_movie_id,
    coalesce(nullif(btrim(p_entity_type), ''), ''),
    p_entity_id,
    coalesce(p_payload, '{}'::jsonb),
    p_dedupe_key
  )
  on conflict (dedupe_key) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    select id
      into v_event_id
      from public.notification_events
      where dedupe_key = p_dedupe_key;
  end if;

  return v_event_id;
end;
$$;

revoke execute on function public.create_notification_event(text, uuid, uuid, text, uuid, jsonb, text) from public, anon, authenticated;

create or replace function public.deliver_notification_event(
  p_event_id uuid,
  p_recipient_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event_id is null or p_recipient_id is null then
    return;
  end if;

  insert into public.notification_deliveries (event_id, recipient_id)
  values (p_event_id, p_recipient_id)
  on conflict (event_id, recipient_id) do nothing;
end;
$$;

revoke execute on function public.deliver_notification_event(uuid, uuid) from public, anon, authenticated;

create or replace function public.has_notification_preference(
  p_user_id uuid,
  p_preference text
)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_enabled boolean;
begin
  if p_user_id is null then
    return false;
  end if;

  if p_preference = 'new_movies' then
    select coalesce(preferences.notify_new_movies, true)
      into v_enabled
      from public.notification_preferences preferences
      where preferences.user_id = p_user_id;
  elsif p_preference = 'review_likes' then
    select coalesce(preferences.notify_review_likes, true)
      into v_enabled
      from public.notification_preferences preferences
      where preferences.user_id = p_user_id;
  elsif p_preference = 'comment_likes' then
    select coalesce(preferences.notify_comment_likes, true)
      into v_enabled
      from public.notification_preferences preferences
      where preferences.user_id = p_user_id;
  elsif p_preference = 'comment_replies' then
    select coalesce(preferences.notify_comment_replies, true)
      into v_enabled
      from public.notification_preferences preferences
      where preferences.user_id = p_user_id;
  elsif p_preference = 'review_comments' then
    select coalesce(preferences.notify_review_comments, true)
      into v_enabled
      from public.notification_preferences preferences
      where preferences.user_id = p_user_id;
  elsif p_preference = 'new_followers' then
    select coalesce(preferences.notify_new_followers, true)
      into v_enabled
      from public.notification_preferences preferences
      where preferences.user_id = p_user_id;
  else
    return false;
  end if;

  return coalesce(v_enabled, true);
end;
$$;

revoke execute on function public.has_notification_preference(uuid, text) from public, anon, authenticated;

create or replace function public.handle_user_profile_follow_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
begin
  insert into public.user_follow_notification_preferences (follower_id, following_id)
  values (new.follower_id, new.following_id)
  on conflict (follower_id, following_id) do nothing;

  if public.has_notification_preference(new.following_id, 'new_followers') then
    v_event_id := public.create_notification_event(
      'profile_followed',
      new.follower_id,
      null,
      'profile',
      new.follower_id,
      '{}'::jsonb,
      'profile_followed:' || new.follower_id::text || ':' || new.following_id::text
    );

    perform public.deliver_notification_event(v_event_id, new.following_id);
  end if;

  return new;
end;
$$;

revoke execute on function public.handle_user_profile_follow_notification() from public, anon, authenticated;

drop trigger if exists user_profile_follows_notify_after_insert on public.user_profile_follows;
create trigger user_profile_follows_notify_after_insert
  after insert on public.user_profile_follows
  for each row
  execute function public.handle_user_profile_follow_notification();

create or replace function public.notify_followers_about_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
  v_follower record;
begin
  v_event_id := public.create_notification_event(
    'followed_rating',
    new.user_id,
    new.movie_id,
    'rating',
    new.movie_id,
    jsonb_build_object('rating', new.rating),
    'followed_rating:' || new.user_id::text || ':' || new.movie_id::text
  );

  for v_follower in
    select follows.follower_id
    from public.user_profile_follows follows
    left join public.user_follow_notification_preferences preferences
      on preferences.follower_id = follows.follower_id
     and preferences.following_id = follows.following_id
    where follows.following_id = new.user_id
      and coalesce(preferences.notify_ratings, true)
  loop
    perform public.deliver_notification_event(v_event_id, v_follower.follower_id);
  end loop;

  return new;
end;
$$;

revoke execute on function public.notify_followers_about_rating() from public, anon, authenticated;

drop trigger if exists movie_ratings_notify_followers_after_insert on public.movie_ratings;
create trigger movie_ratings_notify_followers_after_insert
  after insert on public.movie_ratings
  for each row
  execute function public.notify_followers_about_rating();

create or replace function public.notify_followers_about_watchlist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
  v_follower record;
begin
  v_event_id := public.create_notification_event(
    'followed_watchlist',
    new.user_id,
    new.movie_id,
    'watchlist',
    new.movie_id,
    '{}'::jsonb,
    'followed_watchlist:' || new.user_id::text || ':' || new.movie_id::text
  );

  for v_follower in
    select follows.follower_id
    from public.user_profile_follows follows
    left join public.user_follow_notification_preferences preferences
      on preferences.follower_id = follows.follower_id
     and preferences.following_id = follows.following_id
    where follows.following_id = new.user_id
      and coalesce(preferences.notify_watchlist, true)
  loop
    perform public.deliver_notification_event(v_event_id, v_follower.follower_id);
  end loop;

  return new;
end;
$$;

revoke execute on function public.notify_followers_about_watchlist() from public, anon, authenticated;

drop trigger if exists movie_watchlist_notify_followers_after_insert on public.movie_watchlist;
create trigger movie_watchlist_notify_followers_after_insert
  after insert on public.movie_watchlist
  for each row
  execute function public.notify_followers_about_watchlist();

create or replace function public.notify_followers_about_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
  v_follower record;
begin
  v_event_id := public.create_notification_event(
    'followed_review',
    new.user_id,
    new.movie_id,
    'review',
    new.id,
    '{}'::jsonb,
    'followed_review:' || new.id::text
  );

  for v_follower in
    select follows.follower_id
    from public.user_profile_follows follows
    left join public.user_follow_notification_preferences preferences
      on preferences.follower_id = follows.follower_id
     and preferences.following_id = follows.following_id
    where follows.following_id = new.user_id
      and coalesce(preferences.notify_reviews, true)
  loop
    perform public.deliver_notification_event(v_event_id, v_follower.follower_id);
  end loop;

  return new;
end;
$$;

revoke execute on function public.notify_followers_about_review() from public, anon, authenticated;

drop trigger if exists movie_reviews_notify_followers_after_insert on public.movie_reviews;
create trigger movie_reviews_notify_followers_after_insert
  after insert on public.movie_reviews
  for each row
  execute function public.notify_followers_about_review();

create or replace function public.notify_review_author_about_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_review record;
  v_event_id uuid;
begin
  select id, user_id, movie_id
    into v_review
    from public.movie_reviews
    where id = new.review_id;

  if v_review.user_id is null or v_review.user_id = new.user_id then
    return new;
  end if;

  if public.has_notification_preference(v_review.user_id, 'review_likes') then
    v_event_id := public.create_notification_event(
      'review_liked',
      new.user_id,
      v_review.movie_id,
      'review',
      v_review.id,
      '{}'::jsonb,
      'review_liked:' || new.review_id::text || ':' || new.user_id::text
    );

    perform public.deliver_notification_event(v_event_id, v_review.user_id);
  end if;

  return new;
end;
$$;

revoke execute on function public.notify_review_author_about_like() from public, anon, authenticated;

drop trigger if exists movie_review_likes_notify_after_insert on public.movie_review_likes;
create trigger movie_review_likes_notify_after_insert
  after insert on public.movie_review_likes
  for each row
  execute function public.notify_review_author_about_like();

create or replace function public.notify_comment_author_about_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_comment record;
  v_event_id uuid;
begin
  select id, user_id, movie_id
    into v_comment
    from public.movie_comments
    where id = new.comment_id;

  if v_comment.user_id is null or v_comment.user_id = new.user_id then
    return new;
  end if;

  if public.has_notification_preference(v_comment.user_id, 'comment_likes') then
    v_event_id := public.create_notification_event(
      'comment_liked',
      new.user_id,
      v_comment.movie_id,
      'comment',
      v_comment.id,
      '{}'::jsonb,
      'comment_liked:' || new.comment_id::text || ':' || new.user_id::text
    );

    perform public.deliver_notification_event(v_event_id, v_comment.user_id);
  end if;

  return new;
end;
$$;

revoke execute on function public.notify_comment_author_about_like() from public, anon, authenticated;

drop trigger if exists movie_comment_likes_notify_after_insert on public.movie_comment_likes;
create trigger movie_comment_likes_notify_after_insert
  after insert on public.movie_comment_likes
  for each row
  execute function public.notify_comment_author_about_like();

create or replace function public.notify_discussion_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target_comment record;
  v_review record;
  v_event_id uuid;
begin
  if new.reply_to_comment_id is not null or new.parent_comment_id is not null then
    select id, user_id, movie_id
      into v_target_comment
      from public.movie_comments
      where id = coalesce(new.reply_to_comment_id, new.parent_comment_id);

    if v_target_comment.user_id is not null
       and v_target_comment.user_id <> new.user_id
       and public.has_notification_preference(v_target_comment.user_id, 'comment_replies') then
      v_event_id := public.create_notification_event(
        'comment_reply',
        new.user_id,
        new.movie_id,
        'comment',
        new.id,
        jsonb_build_object('target_comment_id', v_target_comment.id),
        'comment_reply:' || new.id::text || ':' || v_target_comment.user_id::text
      );

      perform public.deliver_notification_event(v_event_id, v_target_comment.user_id);
    end if;
  end if;

  if new.root_review_id is not null and new.parent_comment_id is null then
    select id, user_id, movie_id
      into v_review
      from public.movie_reviews
      where id = new.root_review_id;

    if v_review.user_id is not null
       and v_review.user_id <> new.user_id
       and public.has_notification_preference(v_review.user_id, 'review_comments') then
      v_event_id := public.create_notification_event(
        'review_comment',
        new.user_id,
        new.movie_id,
        'comment',
        new.id,
        jsonb_build_object('review_id', v_review.id),
        'review_comment:' || new.id::text || ':' || v_review.user_id::text
      );

      perform public.deliver_notification_event(v_event_id, v_review.user_id);
    end if;
  end if;

  return new;
end;
$$;

revoke execute on function public.notify_discussion_reply() from public, anon, authenticated;

drop trigger if exists movie_comments_notify_after_insert on public.movie_comments;
create trigger movie_comments_notify_after_insert
  after insert on public.movie_comments
  for each row
  execute function public.notify_discussion_reply();

create or replace function public.create_new_movies_notification_digest(
  p_since timestamptz default now() - interval '1 day',
  p_until timestamptz default now()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_movie_ids uuid[];
  v_event_id uuid;
  v_recipient record;
begin
  select coalesce(array_agg(movies.id order by movies.created_at desc), '{}'::uuid[])
    into v_movie_ids
    from public.movies
    where movies.created_at >= p_since
      and movies.created_at < p_until;

  if coalesce(array_length(v_movie_ids, 1), 0) = 0 then
    return null;
  end if;

  v_event_id := public.create_notification_event(
    'new_movies_digest',
    null,
    null,
    'movies',
    null,
    jsonb_build_object(
      'movie_ids',
      v_movie_ids,
      'since',
      p_since,
      'until',
      p_until
    ),
    'new_movies_digest:' || to_char(p_since at time zone 'utc', 'YYYY-MM-DD') || ':' || to_char(p_until at time zone 'utc', 'YYYY-MM-DD')
  );

  for v_recipient in
    select profiles.id
    from public.profiles
    left join public.notification_preferences preferences
      on preferences.user_id = profiles.id
    where coalesce(preferences.notify_new_movies, true)
  loop
    perform public.deliver_notification_event(v_event_id, v_recipient.id);
  end loop;

  return v_event_id;
end;
$$;

revoke execute on function public.create_new_movies_notification_digest(timestamptz, timestamptz) from public, anon, authenticated;

alter table public.notification_events enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.user_follow_notification_preferences enable row level security;

grant select on table public.notification_events to authenticated;
grant select, update, delete on table public.notification_deliveries to authenticated;
grant select, insert, update, delete on table public.notification_preferences to authenticated;
grant select, insert, update, delete on table public.user_follow_notification_preferences to authenticated;

revoke insert, update, delete, truncate, references, trigger on table public.notification_events from anon, authenticated;
revoke insert, truncate, references, trigger on table public.notification_deliveries from anon, authenticated;
revoke truncate, references, trigger on table public.notification_preferences from anon, authenticated;
revoke truncate, references, trigger on table public.user_follow_notification_preferences from anon, authenticated;

drop policy if exists "notification_events_select_delivered" on public.notification_events;
create policy "notification_events_select_delivered"
  on public.notification_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.notification_deliveries deliveries
      where deliveries.event_id = notification_events.id
        and deliveries.recipient_id = (select auth.uid())
    )
  );

drop policy if exists "notification_deliveries_select_own" on public.notification_deliveries;
create policy "notification_deliveries_select_own"
  on public.notification_deliveries
  for select
  to authenticated
  using (notification_deliveries.recipient_id = (select auth.uid()));

drop policy if exists "notification_deliveries_update_own" on public.notification_deliveries;
create policy "notification_deliveries_update_own"
  on public.notification_deliveries
  for update
  to authenticated
  using (notification_deliveries.recipient_id = (select auth.uid()))
  with check (notification_deliveries.recipient_id = (select auth.uid()));

drop policy if exists "notification_deliveries_delete_own" on public.notification_deliveries;
create policy "notification_deliveries_delete_own"
  on public.notification_deliveries
  for delete
  to authenticated
  using (notification_deliveries.recipient_id = (select auth.uid()));

drop policy if exists "notification_preferences_select_own" on public.notification_preferences;
create policy "notification_preferences_select_own"
  on public.notification_preferences
  for select
  to authenticated
  using (notification_preferences.user_id = (select auth.uid()));

drop policy if exists "notification_preferences_insert_own" on public.notification_preferences;
create policy "notification_preferences_insert_own"
  on public.notification_preferences
  for insert
  to authenticated
  with check (notification_preferences.user_id = (select auth.uid()));

drop policy if exists "notification_preferences_update_own" on public.notification_preferences;
create policy "notification_preferences_update_own"
  on public.notification_preferences
  for update
  to authenticated
  using (notification_preferences.user_id = (select auth.uid()))
  with check (notification_preferences.user_id = (select auth.uid()));

drop policy if exists "notification_preferences_delete_own" on public.notification_preferences;
create policy "notification_preferences_delete_own"
  on public.notification_preferences
  for delete
  to authenticated
  using (notification_preferences.user_id = (select auth.uid()));

drop policy if exists "user_follow_notification_preferences_select_own" on public.user_follow_notification_preferences;
create policy "user_follow_notification_preferences_select_own"
  on public.user_follow_notification_preferences
  for select
  to authenticated
  using (user_follow_notification_preferences.follower_id = (select auth.uid()));

drop policy if exists "user_follow_notification_preferences_insert_own" on public.user_follow_notification_preferences;
create policy "user_follow_notification_preferences_insert_own"
  on public.user_follow_notification_preferences
  for insert
  to authenticated
  with check (
    user_follow_notification_preferences.follower_id = (select auth.uid())
    and exists (
      select 1
      from public.user_profile_follows follows
      where follows.follower_id = (select auth.uid())
        and follows.following_id = user_follow_notification_preferences.following_id
    )
  );

drop policy if exists "user_follow_notification_preferences_update_own" on public.user_follow_notification_preferences;
create policy "user_follow_notification_preferences_update_own"
  on public.user_follow_notification_preferences
  for update
  to authenticated
  using (user_follow_notification_preferences.follower_id = (select auth.uid()))
  with check (
    user_follow_notification_preferences.follower_id = (select auth.uid())
    and exists (
      select 1
      from public.user_profile_follows follows
      where follows.follower_id = (select auth.uid())
        and follows.following_id = user_follow_notification_preferences.following_id
    )
  );

drop policy if exists "user_follow_notification_preferences_delete_own" on public.user_follow_notification_preferences;
create policy "user_follow_notification_preferences_delete_own"
  on public.user_follow_notification_preferences
  for delete
  to authenticated
  using (user_follow_notification_preferences.follower_id = (select auth.uid()));
