create extension if not exists pgcrypto;

create or replace function public.horroreiro_person_name_key(value text)
returns text
language sql
immutable
as $$
  select regexp_replace(lower(btrim(coalesce(value, ''))), '\s+', ' ', 'g');
$$;

create or replace function public.horroreiro_slugify(value text)
returns text
language plpgsql
immutable
as $$
declare
  result text := lower(btrim(coalesce(value, '')));
begin
  result := replace(result, 'ё', 'yo');
  result := replace(result, 'ж', 'zh');
  result := replace(result, 'х', 'kh');
  result := replace(result, 'ц', 'ts');
  result := replace(result, 'ч', 'ch');
  result := replace(result, 'ш', 'sh');
  result := replace(result, 'щ', 'sch');
  result := replace(result, 'ю', 'yu');
  result := replace(result, 'я', 'ya');
  result := replace(result, 'й', 'y');
  result := replace(result, 'а', 'a');
  result := replace(result, 'б', 'b');
  result := replace(result, 'в', 'v');
  result := replace(result, 'г', 'g');
  result := replace(result, 'д', 'd');
  result := replace(result, 'е', 'e');
  result := replace(result, 'з', 'z');
  result := replace(result, 'и', 'i');
  result := replace(result, 'к', 'k');
  result := replace(result, 'л', 'l');
  result := replace(result, 'м', 'm');
  result := replace(result, 'н', 'n');
  result := replace(result, 'о', 'o');
  result := replace(result, 'п', 'p');
  result := replace(result, 'р', 'r');
  result := replace(result, 'с', 's');
  result := replace(result, 'т', 't');
  result := replace(result, 'у', 'u');
  result := replace(result, 'ф', 'f');
  result := replace(result, 'ы', 'y');
  result := replace(result, 'э', 'e');
  result := replace(result, 'ь', '');
  result := replace(result, 'ъ', '');
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '(^-|-$)', '', 'g');
  result := regexp_replace(result, '-{2,}', '-', 'g');

  return nullif(result, '');
end;
$$;

create or replace function public.horroreiro_next_person_slug(value text)
returns text
language plpgsql
stable
as $$
declare
  base_slug text := coalesce(public.horroreiro_slugify(value), 'name');
  candidate text := base_slug;
  suffix integer := 2;
begin
  while exists (
    select 1
    from public.people
    where slug = candidate
  ) loop
    candidate := base_slug || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  return candidate;
end;
$$;

with source_people as (
  select distinct btrim(person_name) as name_ru
  from public.movies
  cross join lateral regexp_split_to_table(coalesce(public.movies.director, ''), E'\\s*,\\s*|\\n+') as person_name
  where btrim(person_name) <> ''
)
insert into public.people (name_ru, slug)
select source_people.name_ru, public.horroreiro_next_person_slug(source_people.name_ru)
from source_people
where not exists (
  select 1
  from public.people existing_people
  where existing_people.person_name_key = public.horroreiro_person_name_key(source_people.name_ru)
);

do $$
declare
  person_row record;
  base_slug text;
  candidate_slug text;
  suffix integer;
begin
  for person_row in
    select id, name_ru
    from public.people
    where nullif(btrim(slug), '') is null
       or slug ~ '^name(-[0-9]+)?$'
  loop
    base_slug := coalesce(public.horroreiro_slugify(person_row.name_ru), 'name');
    candidate_slug := base_slug;
    suffix := 2;

    while exists (
      select 1
      from public.people
      where slug = candidate_slug
        and id <> person_row.id
    ) loop
      candidate_slug := base_slug || '-' || suffix;
      suffix := suffix + 1;
    end loop;

    update public.people
    set slug = candidate_slug
    where id = person_row.id
      and slug is distinct from candidate_slug;
  end loop;
end;
$$;

with movie_person_names as (
  select
    movies.id as movie_id,
    btrim(person_name.value) as name_ru,
    greatest(person_name.ordinality::integer - 1, 0) as position
  from public.movies
  cross join lateral regexp_split_to_table(coalesce(movies.director, ''), E'\\s*,\\s*|\\n+') with ordinality as person_name(value, ordinality)
  where btrim(person_name.value) <> ''
),
matched_people as (
  select distinct on (movie_person_names.movie_id, people.id)
    movie_person_names.movie_id,
    people.id as person_id,
    movie_person_names.position
  from movie_person_names
  join public.people
    on people.person_name_key = public.horroreiro_person_name_key(movie_person_names.name_ru)
  order by movie_person_names.movie_id, people.id, movie_person_names.position
)
insert into public.movie_people (movie_id, person_id, role, position)
select movie_id, person_id, 'director', position
from matched_people
on conflict (movie_id, person_id, role) do update
set position = excluded.position;
