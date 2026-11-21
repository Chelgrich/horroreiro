begin;

create function public.get_profile_activity_ranks(p_user_id uuid)
returns jsonb
language sql stable strict
security invoker
set search_path = ''
as $$
  with activity_counts as (
    select id as user_id, 0 as ratings, 0 as watchlist, 0 as reviews from public.profiles
    union all select p_user_id, 0, 0, 0
    union all
    select user_id, count(*), 0, 0 from public.movie_ratings where user_id is not null group by user_id
    union all
    select watch.user_id, 0, count(*), 0
    from public.movie_watchlist watch
    where watch.user_id is not null and watch.movie_id is not null
      and not exists (
        select 1 from public.movie_ratings rated
        where rated.user_id = watch.user_id and rated.movie_id = watch.movie_id
      )
    group by watch.user_id
    union all
    select user_id, 0, 0, count(*) from public.movie_reviews where user_id is not null group by user_id
  ), user_counts as (
    select user_id, sum(ratings) as ratings, sum(watchlist) as watchlist, sum(reviews) as reviews
    from activity_counts group by user_id
  ), ranked as (
    select totals.user_id, metric.kind, metric.total,
      rank() over (partition by metric.kind order by metric.total desc) as place,
      rank() over (partition by metric.kind order by metric.total) - 1 as lower_count,
      count(*) over (partition by metric.kind) - 1 as peer_count
    from user_counts totals
    cross join lateral (values ('ratings', totals.ratings), ('watchlist', totals.watchlist), ('reviews', totals.reviews)) metric(kind, total)
  )
  select jsonb_build_object(
    'ok', true,
    'counts', jsonb_object_agg(kind, total),
    'ranks', jsonb_object_agg(kind, case when total > 0 and peer_count > 0 then
      jsonb_build_object('place', place, 'percent', case when lower_count > 0 then
        least(99, greatest(1, round(100.0 * lower_count / peer_count))) end)
    end)
  )
  from ranked where user_id = p_user_id;
$$;

revoke all on function public.get_profile_activity_ranks(uuid) from public, anon, authenticated;
grant execute on function public.get_profile_activity_ranks(uuid) to service_role;

notify pgrst, 'reload schema';
commit;
