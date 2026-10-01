-- Atomic materialization helper for the automatic related movies pipeline.
-- Apply manually in Supabase SQL editor after `movie-auto-related-setup.sql`.
-- Replaces only automatic rows in `movie_related` for one movie.

create or replace function public.replace_movie_related_rows(
  p_movie_id uuid,
  p_rows jsonb default '[]'::jsonb
)
returns table (
  movie_id uuid,
  related_movie_id uuid,
  score double precision,
  related_position integer,
  confidence text
)
language plpgsql
security invoker
as $$
begin
  if p_movie_id is null then
    raise exception 'movie id is required';
  end if;

  if jsonb_typeof(coalesce(p_rows, '[]'::jsonb)) <> 'array' then
    raise exception 'p_rows must be a JSON array';
  end if;

  delete from public.movie_related existing_related
  where existing_related.movie_id = p_movie_id;

  insert into public.movie_related (
    movie_id,
    related_movie_id,
    score,
    position,
    confidence,
    calculated_at
  )
  select distinct on (row_values.related_movie_id)
    p_movie_id,
    row_values.related_movie_id,
    row_values.score,
    row_values.position,
    row_values.confidence,
    now()
  from (
    select
      (row_item ->> 'related_movie_id')::uuid as related_movie_id,
      coalesce((row_item ->> 'score')::double precision, 0) as score,
      (row_item ->> 'position')::integer as position,
      coalesce(nullif(row_item ->> 'confidence', ''), 'fallback') as confidence
    from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) as row_source(row_item)
    where row_item ? 'related_movie_id'
      and row_item ? 'position'
  ) as row_values
  where row_values.related_movie_id is not null
    and row_values.related_movie_id <> p_movie_id
    and row_values.score >= 0
    and row_values.position >= 0
    and row_values.confidence in ('manual', 'strong', 'normal', 'fallback')
  order by row_values.related_movie_id, row_values.position asc, row_values.score desc;

  return query
  select
    saved_related.movie_id,
    saved_related.related_movie_id,
    saved_related.score,
    saved_related.position as related_position,
    saved_related.confidence
  from public.movie_related saved_related
  where saved_related.movie_id = p_movie_id
  order by saved_related.position asc, saved_related.related_movie_id asc;
end;
$$;

revoke all on function public.replace_movie_related_rows(uuid, jsonb)
  from public;

grant execute on function public.replace_movie_related_rows(uuid, jsonb)
  to authenticated, service_role;
