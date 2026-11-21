begin;
set local lock_timeout = '3s';

alter table public.catalog_movie_index_revision
  add column recent_changes jsonb[] not null default '{}';

grant select (recent_changes) on public.catalog_movie_index_revision to anon, authenticated;

create or replace function public.bump_catalog_movie_index_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_ids uuid[];
  changed_movie uuid;
  changed_rows text;
begin
  if tg_op <> 'TRUNCATE' then
    changed_rows := case tg_op
      when 'INSERT' then format('select %I as id from catalog_new_rows', tg_argv[0])
      when 'DELETE' then format('select %I as id from catalog_old_rows', tg_argv[0])
      else format('select %1$I as id from catalog_old_rows union all select %1$I from catalog_new_rows', tg_argv[0])
    end;
    execute 'select array(select distinct id from (' || changed_rows || ') changed limit 2)' into changed_ids;
    if cardinality(changed_ids) = 0 then return null; end if;
    if cardinality(changed_ids) = 1 and (
      tg_argv[0] = 'movie_id' or (tg_table_name = 'movies' and tg_op = 'UPDATE')
    ) then
      changed_movie := changed_ids[1];
    end if;
  end if;

  update public.catalog_movie_index_revision
  set recent_changes = case when changed_movie is null then '{}'::jsonb[] else
        array_append(recent_changes[greatest(cardinality(recent_changes) - 30, 1):],
          jsonb_build_array(revision, changed_movie)) end,
      revision = pg_catalog.gen_random_uuid()
  where singleton;
  return null;
end;
$$;

do $$
declare
  source_table text;
  id_column text;
begin
  foreach source_table in array array['movies', 'genres', 'countries', 'movie_genres', 'movie_countries', 'movie_poster_images'] loop
    id_column := case when source_table in ('movies', 'genres', 'countries') then 'id' else 'movie_id' end;
    execute format('create or replace trigger bump_catalog_movie_index_revision after truncate on public.%I
      for each statement execute function public.bump_catalog_movie_index_revision()', source_table);
    execute format('create trigger bump_catalog_movie_index_after_insert after insert on public.%I
      referencing new table as catalog_new_rows for each statement execute function public.bump_catalog_movie_index_revision(%L)',
      source_table, id_column);
    execute format('create trigger bump_catalog_movie_index_after_update after update on public.%I
      referencing old table as catalog_old_rows new table as catalog_new_rows
      for each statement execute function public.bump_catalog_movie_index_revision(%L)', source_table, id_column);
    execute format('create trigger bump_catalog_movie_index_after_delete after delete on public.%I
      referencing old table as catalog_old_rows for each statement execute function public.bump_catalog_movie_index_revision(%L)',
      source_table, id_column);
  end loop;
end;
$$;

create function public.get_catalog_revisions(p_movie_index uuid default null)
returns table (movie_index uuid, ratings uuid, reviews uuid, movie_ids uuid[])
language sql stable
security invoker
set search_path = ''
as $$
  select revisions.movie_index, revisions.ratings, revisions.reviews,
    case when p_movie_index <> revisions.movie_index then (
      select array_agg(distinct (entry ->> 1)::uuid)
      from unnest(history.recent_changes) with ordinality as changes(entry, step)
      where step >= (
        select previous.step
        from unnest(history.recent_changes) with ordinality as previous(entry, step)
        where previous.entry ->> 0 = p_movie_index::text
      )
    ) end
  from public.catalog_revisions revisions
  cross join public.catalog_movie_index_revision history;
$$;

revoke all on function public.get_catalog_revisions(uuid) from public, anon, authenticated;
grant execute on function public.get_catalog_revisions(uuid) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
