begin;

create or replace function public.get_profile_activity_preview(p_user_id uuid)
returns jsonb
language sql stable strict
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'ratings', coalesce((
      select jsonb_agg(to_jsonb(r) - 'id' order by r.created_at desc, r.id)
      from (
        select id, movie_id, rating, created_at from public.movie_ratings
        where user_id = p_user_id order by created_at desc, id limit 10
      ) r
    ), '[]'::jsonb),
    'watchlist', coalesce((
      select jsonb_agg(to_jsonb(w) - 'id' order by w.created_at desc, w.id)
      from (
        select id, movie_id, created_at from public.movie_watchlist w
        where w.user_id = p_user_id and w.movie_id is not null
          and not exists (
            select 1 from public.movie_ratings r where r.user_id = p_user_id and r.movie_id = w.movie_id
          )
        order by created_at desc, id limit 10
      ) w
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(to_jsonb(r) - 'id' order by r.updated_at desc, r.id)
      from (
        select id, movie_id, created_at, updated_at from public.movie_reviews
        where user_id = p_user_id order by updated_at desc, id limit 10
      ) r
    ), '[]'::jsonb)
  );
$$;

create or replace function public.get_profile_activity_summary(p_user_id uuid)
returns jsonb
language sql stable strict
security invoker
set search_path = ''
as $$
  with rated as (
    select movie_id, rating from public.movie_ratings where user_id = p_user_id
  ), label_counts as (
    select taste.kind, btrim(taste.label) as label, count(*) as total
    from rated r
    join public.movies m on m.id = r.movie_id
    cross join lateral (
      select distinct 'extraGenre' as kind, g.name as label
      from public.movie_genres mg join public.genres g on g.id = mg.genre_id
      where mg.movie_id = m.id and lower(btrim(g.name)) <> 'ужасы'
      union all
      select distinct 'country', c.name
      from public.movie_countries mc join public.countries c on c.id = mc.country_id
      where mc.movie_id = m.id
      union all
      select distinct 'subgenre', tag from unnest(m.tags_perceived) as t(tag)
      union all
      select 'year', m.year::text where m.year <> 0
    ) taste
    where btrim(taste.label) <> ''
    group by taste.kind, btrim(taste.label)
  ), ranked_labels as (
    select *, rank() over (partition by kind order by total desc) as place from label_counts
  ), taste_candidates as (
    select kind, jsonb_agg(jsonb_build_object('label', label, 'count', total)) as items
    from ranked_labels where place = 1 group by kind
  )
  select jsonb_build_object(
    'counts', jsonb_build_object(
      'ratings', (select count(*) from rated),
      'watchlist', (
        select count(*) from public.movie_watchlist w
        where w.user_id = p_user_id and w.movie_id is not null
          and not exists (select 1 from rated r where r.movie_id = w.movie_id)
      ),
      'reviews', (select count(*) from public.movie_reviews where user_id = p_user_id)
    ),
    'averageRating', (select avg(rating) from rated where rating > 0),
    'tasteCandidates', coalesce((select jsonb_object_agg(kind, items) from taste_candidates), '{}'::jsonb)
  );
$$;

revoke all on function public.get_profile_activity_preview(uuid), public.get_profile_activity_summary(uuid)
  from public, anon, authenticated;
grant execute on function public.get_profile_activity_preview(uuid), public.get_profile_activity_summary(uuid)
  to anon, authenticated;

notify pgrst, 'reload schema';
commit;
