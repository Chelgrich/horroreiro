create index if not exists movie_ratings_movie_id_idx
  on public.movie_ratings (movie_id);

create index if not exists movie_ratings_user_id_idx
  on public.movie_ratings (user_id);

create or replace view public.movie_rating_stats
with (security_invoker = true)
as
select
  movie_id,
  round(avg(rating)::numeric, 1) as average_rating,
  count(*)::integer as votes_count,
  sum(rating)::numeric as rating_sum
from public.movie_ratings
group by movie_id;

grant select on public.movie_rating_stats to anon, authenticated;
