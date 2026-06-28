create or replace function public.create_notification_test_suite()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recipient_id uuid := auth.uid();
  v_actor_id uuid;
  v_movie_id uuid;
  v_movie_ids uuid[];
  v_event_id uuid;
  v_event record;
  v_created_count integer := 0;
  v_deleted_previous integer := 0;
begin
  if v_recipient_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.profiles
    where profiles.id = v_recipient_id
      and profiles.role = 'admin'
  ) then
    raise exception 'Only admins can create notification tests'
      using errcode = '42501';
  end if;

  select profiles.id
    into v_actor_id
    from public.profiles
    where profiles.id <> v_recipient_id
    order by profiles.id
    limit 1;

  v_actor_id := coalesce(v_actor_id, v_recipient_id);

  select coalesce(array_agg(movie_rows.id), '{}'::uuid[])
    into v_movie_ids
    from (
      select movies.id
      from public.movies
      order by movies.created_at desc nulls last, movies.title
      limit 4
    ) movie_rows;

  v_movie_id := v_movie_ids[1];

  with deleted_events as (
    delete from public.notification_events events
    where events.dedupe_key like ('notification_test:' || v_recipient_id::text || ':%')
    returning 1
  )
  select count(*)
    into v_deleted_previous
    from deleted_events;

  for v_event in
    select *
    from (
      values
        (
          'new_movies_digest'::text,
          null::uuid,
          null::uuid,
          'movies'::text,
          null::uuid,
          jsonb_build_object(
            'is_test', true,
            'movie_ids', coalesce(to_jsonb(v_movie_ids), '[]'::jsonb),
            'since', now() - interval '1 day',
            'until', now()
          ),
          now()
        ),
        (
          'review_liked',
          v_actor_id,
          v_movie_id,
          'review',
          null::uuid,
          jsonb_build_object('is_test', true),
          now() - interval '1 minute'
        ),
        (
          'comment_liked',
          v_actor_id,
          v_movie_id,
          'comment',
          null::uuid,
          jsonb_build_object('is_test', true),
          now() - interval '2 minutes'
        ),
        (
          'comment_reply',
          v_actor_id,
          v_movie_id,
          'comment',
          null::uuid,
          jsonb_build_object('is_test', true, 'target_comment_id', null),
          now() - interval '3 minutes'
        ),
        (
          'review_comment',
          v_actor_id,
          v_movie_id,
          'comment',
          null::uuid,
          jsonb_build_object('is_test', true, 'review_id', null),
          now() - interval '4 minutes'
        ),
        (
          'followed_rating',
          v_actor_id,
          v_movie_id,
          'rating',
          v_movie_id,
          jsonb_build_object('is_test', true, 'rating', 8),
          now() - interval '5 minutes'
        ),
        (
          'followed_watchlist',
          v_actor_id,
          v_movie_id,
          'watchlist',
          v_movie_id,
          jsonb_build_object('is_test', true),
          now() - interval '6 minutes'
        ),
        (
          'followed_review',
          v_actor_id,
          v_movie_id,
          'review',
          null::uuid,
          jsonb_build_object('is_test', true),
          now() - interval '7 minutes'
        ),
        (
          'profile_followed',
          v_actor_id,
          null::uuid,
          'profile',
          v_actor_id,
          jsonb_build_object('is_test', true),
          now() - interval '8 minutes'
        )
    ) as notification_test_events(
      event_type,
      actor_id,
      movie_id,
      entity_type,
      entity_id,
      payload,
      created_at
    )
  loop
    insert into public.notification_events (
      type,
      actor_id,
      movie_id,
      entity_type,
      entity_id,
      payload,
      dedupe_key,
      created_at
    )
    values (
      v_event.event_type,
      v_event.actor_id,
      v_event.movie_id,
      v_event.entity_type,
      v_event.entity_id,
      v_event.payload,
      'notification_test:' || v_recipient_id::text || ':' || v_event.event_type,
      v_event.created_at
    )
    returning id into v_event_id;

    insert into public.notification_deliveries (
      event_id,
      recipient_id,
      created_at
    )
    values (
      v_event_id,
      v_recipient_id,
      v_event.created_at
    );

    v_created_count := v_created_count + 1;
  end loop;

  return jsonb_build_object(
    'created', v_created_count,
    'deleted_previous', v_deleted_previous,
    'recipient_id', v_recipient_id,
    'actor_id', v_actor_id,
    'movie_ids', coalesce(to_jsonb(v_movie_ids), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.create_notification_test_suite() from public, anon, authenticated;
grant execute on function public.create_notification_test_suite() to authenticated;
