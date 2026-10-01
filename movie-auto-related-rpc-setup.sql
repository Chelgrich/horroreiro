-- Atomic helper functions for the automatic related movies pipeline.
-- Apply manually in Supabase SQL editor after `movie-auto-related-setup.sql`
-- and before running provider sync jobs that persist evidence.

create or replace function public.replace_movie_recommendation_provider_evidence(
  p_source_movie_id uuid,
  p_provider text,
  p_rows jsonb default '[]'::jsonb
)
returns table (
  source_movie_id uuid,
  target_movie_id uuid,
  provider text,
  provider_rank integer
)
language plpgsql
security invoker
as $$
begin
  if p_source_movie_id is null then
    raise exception 'source movie id is required';
  end if;

  if p_provider not in ('trakt_related', 'tmdb_recommendations', 'manual') then
    raise exception 'unsupported recommendation provider: %', p_provider;
  end if;

  if jsonb_typeof(coalesce(p_rows, '[]'::jsonb)) <> 'array' then
    raise exception 'p_rows must be a JSON array';
  end if;

  delete from public.movie_recommendation_evidence existing_evidence
  where existing_evidence.source_movie_id = p_source_movie_id
    and existing_evidence.provider = p_provider;

  insert into public.movie_recommendation_evidence (
    source_movie_id,
    target_movie_id,
    provider,
    provider_rank,
    fetched_at
  )
  select distinct on (row_values.target_movie_id)
    p_source_movie_id,
    row_values.target_movie_id,
    p_provider,
    row_values.provider_rank,
    now()
  from (
    select
      (row_item ->> 'target_movie_id')::uuid as target_movie_id,
      (row_item ->> 'provider_rank')::integer as provider_rank
    from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) as row_source(row_item)
    where row_item ? 'target_movie_id'
      and row_item ? 'provider_rank'
  ) as row_values
  where row_values.target_movie_id is not null
    and row_values.provider_rank > 0
    and row_values.target_movie_id <> p_source_movie_id
  order by row_values.target_movie_id, row_values.provider_rank asc;

  return query
  select
    saved_evidence.source_movie_id,
    saved_evidence.target_movie_id,
    saved_evidence.provider,
    saved_evidence.provider_rank
  from public.movie_recommendation_evidence saved_evidence
  where saved_evidence.source_movie_id = p_source_movie_id
    and saved_evidence.provider = p_provider
  order by saved_evidence.provider_rank asc, saved_evidence.target_movie_id asc;
end;
$$;

revoke all on function public.replace_movie_recommendation_provider_evidence(uuid, text, jsonb)
  from public;

grant execute on function public.replace_movie_recommendation_provider_evidence(uuid, text, jsonb)
  to authenticated, service_role;
