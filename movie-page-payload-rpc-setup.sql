create or replace function public.get_movie_page_payload(
  p_movie_id uuid default null,
  p_slug text default null,
  p_include_user_state boolean default true
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with selected_movie as (
    select movies.*
    from public.movies
    where
      (p_movie_id is not null and movies.id = p_movie_id)
      or (
        p_movie_id is null
        and nullif(btrim(p_slug), '') is not null
        and movies.slug = nullif(btrim(p_slug), '')
      )
    limit 1
  )
  select case
    when not exists (select 1 from selected_movie) then null
    else (
      select jsonb_build_object(
        'movie',
          to_jsonb(movie)
          || jsonb_build_object(
            'movie_genres',
            coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'position', movie_genres.position,
                  'genres', jsonb_build_object('name', genres.name)
                )
                order by movie_genres.position, genres.name
              )
              from public.movie_genres
              join public.genres
                on genres.id = movie_genres.genre_id
              where movie_genres.movie_id = movie.id
            ), '[]'::jsonb),
            'movie_countries',
            coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'countries', jsonb_build_object('name', countries.name)
                )
                order by countries.name
              )
              from public.movie_countries
              join public.countries
                on countries.id = movie_countries.country_id
              where movie_countries.movie_id = movie.id
            ), '[]'::jsonb)
          ),
        'rating_stats',
          (
            select to_jsonb(movie_rating_stats)
            from public.movie_rating_stats
            where movie_rating_stats.movie_id = movie.id
            limit 1
          ),
        'current_user_rating',
          case
            when p_include_user_state and (select auth.uid()) is not null then (
              select to_jsonb(movie_ratings)
              from public.movie_ratings
              where movie_ratings.movie_id = movie.id
                and movie_ratings.user_id = (select auth.uid())
              limit 1
            )
            else null
          end,
        'current_user_watchlist',
          case
            when p_include_user_state and (select auth.uid()) is not null then (
              select to_jsonb(movie_watchlist)
              from public.movie_watchlist
              where movie_watchlist.movie_id = movie.id
                and movie_watchlist.user_id = (select auth.uid())
              limit 1
            )
            else null
          end,
        'poster_images',
          coalesce((
            select jsonb_agg(
              to_jsonb(movie_poster_images)
              order by movie_poster_images.position, movie_poster_images.created_at, movie_poster_images.id
            )
            from public.movie_poster_images
            where movie_poster_images.movie_id = movie.id
          ), '[]'::jsonb)
      )
      from selected_movie movie
    )
  end;
$$;

grant execute on function public.get_movie_page_payload(uuid, text, boolean) to anon, authenticated;
