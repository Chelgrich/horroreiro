create or replace function public.horroreiro_movie_director_names(value text)
returns table(name text, sort_position integer)
language sql
immutable
as $$
  select parsed.name, (parsed.ordinality - 1)::integer as sort_position
  from (
    select btrim(raw_name) as name, ordinality
    from regexp_split_to_table(coalesce(value, ''), E'\\s*[,\\r\\n]+\\s*') with ordinality as names(raw_name, ordinality)
  ) as parsed
  where parsed.name <> '';
$$;

create or replace function public.horroreiro_unique_person_slug(value text, exclude_person_id uuid default null)
returns text
language plpgsql
stable
as $$
declare
  base_slug text := coalesce(public.horroreiro_slugify(value), 'name');
  slug_candidate text := base_slug;
  suffix integer := 2;
begin
  loop
    exit when not exists (
      select 1
      from public.people
      where slug = slug_candidate
        and (exclude_person_id is null or id <> exclude_person_id)
    );

    slug_candidate := base_slug || '-' || suffix::text;
    suffix := suffix + 1;
  end loop;

  return slug_candidate;
end;
$$;

create or replace function public.horroreiro_sync_movie_directors(target_movie_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  movie_record record;
  director_record record;
  target_person_id uuid;
  previous_person_ids uuid[] := array[]::uuid[];
begin
  select id, director
  into movie_record
  from public.movies
  where id = target_movie_id;

  if not found then
    return;
  end if;

  select coalesce(array_agg(person_id), array[]::uuid[])
  into previous_person_ids
  from public.movie_people
  where movie_id = movie_record.id
    and role = 'director';

  delete from public.movie_people
  where movie_id = movie_record.id
    and role = 'director';

  for director_record in
    select name, sort_position
    from public.horroreiro_movie_director_names(movie_record.director)
    order by sort_position
  loop
    select id
    into target_person_id
    from public.people
    where person_name_key = public.horroreiro_person_name_key(director_record.name)
    order by
      (
        case when nullif(btrim(coalesce(photo_url, '')), '') is not null then 16 else 0 end +
        case when nullif(btrim(coalesce(name, '')), '') is not null then 8 else 0 end +
        case when birth_date is not null then 4 else 0 end +
        case when death_date is not null then 2 else 0 end +
        case when nullif(btrim(coalesce(birth_place, '')), '') is not null then 2 else 0 end +
        case when cardinality(coalesce(aliases, array[]::text[])) > 0 then 2 else 0 end +
        case when nullif(btrim(coalesce(tmdb_url, '')), '') is not null then 8 else 0 end
      ) desc,
      created_at asc,
      id asc
    limit 1;

    if target_person_id is null then
      insert into public.people (name_ru, slug)
      values (
        director_record.name,
        public.horroreiro_unique_person_slug(director_record.name)
      )
      returning id into target_person_id;
    end if;

    insert into public.movie_people (movie_id, person_id, role, position)
    values (movie_record.id, target_person_id, 'director', director_record.sort_position)
    on conflict (movie_id, person_id, role)
    do update set position = excluded.position;
  end loop;

  delete from public.people as person
  where person.id = any(previous_person_ids)
    and not exists (
      select 1
      from public.movie_people as relation
      where relation.person_id = person.id
    );
end;
$$;

create or replace function public.horroreiro_sync_movie_directors_trigger()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  perform public.horroreiro_sync_movie_directors(new.id);
  return new;
end;
$$;

drop trigger if exists movies_sync_directors_from_text on public.movies;
create trigger movies_sync_directors_from_text
  after insert or update of director on public.movies
  for each row
  execute function public.horroreiro_sync_movie_directors_trigger();

select public.horroreiro_sync_movie_directors(id)
from public.movies
where nullif(btrim(coalesce(director, '')), '') is not null;
