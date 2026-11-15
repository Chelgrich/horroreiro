-- Run as postgres. Every fixture and trigger effect is rolled back.
do $$
declare
  admin_id uuid;
  user_id uuid;
  movie_id_value uuid := gen_random_uuid();
  similar_id uuid := gen_random_uuid();
  missing_id uuid := gen_random_uuid();
  result jsonb;
  before_state jsonb;
  after_state jsonb;
  table_name text;
begin
  assert not has_function_privilege('anon','public.horroreiro_save_movie(uuid,jsonb,jsonb,boolean)','EXECUTE'), 'Anonymous RPC access';
  assert not (select prosecdef from pg_proc where oid='public.horroreiro_save_movie(uuid,jsonb,jsonb,boolean)'::regprocedure), 'RPC bypasses RLS';
  foreach table_name in array array['movies','companies','movie_companies','movie_manual_similar','movie_poster_images'] loop
    assert not has_table_privilege('anon','public.'||table_name,'TRUNCATE,REFERENCES,TRIGGER'), 'Unnecessary anonymous privileges';
    assert not has_table_privilege('authenticated','public.'||table_name,'TRUNCATE,REFERENCES,TRIGGER'), 'Unnecessary authenticated privileges';
  end loop;
  select id into strict admin_id from public.profiles where role='admin' limit 1;
  select id into strict user_id from public.profiles where role='user' limit 1;
  begin
    perform set_config('request.jwt.claims',jsonb_build_object('sub',user_id,'role','authenticated')::text,true);
    set local role authenticated;
    begin
      perform public.horroreiro_save_movie(movie_id_value,'{}','{}',true);
      raise exception 'Ordinary user saved a movie';
    exception when insufficient_privilege then null;
    end;
    perform set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'role','authenticated')::text,true);
    perform public.horroreiro_save_movie(similar_id,jsonb_build_object('title','Atomic peer','slug',similar_id::text),
      '{"genres":[],"countries":[],"posters":[],"similar":[]}',true);
    result := public.horroreiro_save_movie(movie_id_value,jsonb_build_object(
      'title','Atomic original','slug',movie_id_value::text,'director','Atomic director '||movie_id_value::text,
      'production',jsonb_build_array('Atomic company '||movie_id_value::text),'poster_url','https://fixture.invalid/primary'),
      jsonb_build_object('genres',jsonb_build_array('Atomic genre '||movie_id_value::text),
        'countries',jsonb_build_array('Atomic country '||movie_id_value::text),
        'posters',jsonb_build_array('https://fixture.invalid/gallery'),'similar',jsonb_build_array(similar_id)),true);
    assert result->>'id'=movie_id_value::text, 'Create returned wrong ID';
    assert (select count(*)=1 from public.movie_people where movie_id=movie_id_value), 'Director trigger not in save';
    assert (select count(*)=1 from public.movie_companies where movie_id=movie_id_value), 'Company link missing';
    assert (select count(*)=2 from public.movie_manual_similar where movie_id=movie_id_value or similar_movie_id=movie_id_value), 'Similar links not reciprocal';

    -- A retry of the same create is read-only, including when its payload differs.
    perform public.horroreiro_save_movie(movie_id_value,'{"title":"Duplicate"}','{"genres":[],"countries":[],"posters":[],"similar":[]}',true);
    assert (select title='Atomic original' from public.movies where id=movie_id_value), 'Create retry overwrote saved data';

    perform public.horroreiro_save_movie(movie_id_value,
      jsonb_build_object('distribution',jsonb_build_array('Atomic distributor '||movie_id_value::text)),'{}',false);
    update public.companies set name='Renamed distributor '||movie_id_value::text,
      name_key='renamed distributor '||movie_id_value::text,country='Fixture country'
      where id in(select company_id from public.movie_companies where movie_id=movie_id_value and role='distribution');
    perform public.horroreiro_save_movie(movie_id_value,'{"production":["Changed producer"]}','{}',false);
    assert exists(select 1 from public.movie_companies mc join public.companies c on c.id=mc.company_id
      where mc.movie_id=movie_id_value and mc.role='distribution' and c.name='Renamed distributor '||movie_id_value::text and c.country='Fixture country'),
      'Changing production reverted an omitted renamed distributor';

    select jsonb_build_object('movie',(select to_jsonb(m) from public.movies m where id=movie_id_value),
      'genres',(select jsonb_agg(to_jsonb(g)) from public.movie_genres g where movie_id=movie_id_value),
      'countries',(select jsonb_agg(to_jsonb(c)) from public.movie_countries c where movie_id=movie_id_value),
      'people',(select jsonb_agg(to_jsonb(p)) from public.movie_people p where movie_id=movie_id_value),
      'companies',(select jsonb_agg(to_jsonb(c)) from public.movie_companies c where movie_id=movie_id_value),
      'posters',(select jsonb_agg(to_jsonb(p)) from public.movie_poster_images p where movie_id=movie_id_value),
      'similar',(select jsonb_agg(to_jsonb(s) order by movie_id,similar_movie_id) from public.movie_manual_similar s where movie_id=movie_id_value or similar_movie_id=movie_id_value)) into before_state;
    begin
      -- The missing FK is encountered after movie/director/company/genre/country/gallery writes.
      perform public.horroreiro_save_movie(movie_id_value,
        '{"title":"Broken","director":"Rollback director","production":["Rollback company"]}',
        jsonb_build_object('genres',jsonb_build_array('Rollback genre'),'countries',jsonb_build_array('Rollback country'),
          'posters',jsonb_build_array('https://fixture.invalid/new'),'similar',jsonb_build_array(missing_id)),false);
      raise exception 'Invalid similar FK was accepted';
    exception when foreign_key_violation then null;
    end;
    select jsonb_build_object('movie',(select to_jsonb(m) from public.movies m where id=movie_id_value),
      'genres',(select jsonb_agg(to_jsonb(g)) from public.movie_genres g where movie_id=movie_id_value),
      'countries',(select jsonb_agg(to_jsonb(c)) from public.movie_countries c where movie_id=movie_id_value),
      'people',(select jsonb_agg(to_jsonb(p)) from public.movie_people p where movie_id=movie_id_value),
      'companies',(select jsonb_agg(to_jsonb(c)) from public.movie_companies c where movie_id=movie_id_value),
      'posters',(select jsonb_agg(to_jsonb(p)) from public.movie_poster_images p where movie_id=movie_id_value),
      'similar',(select jsonb_agg(to_jsonb(s) order by movie_id,similar_movie_id) from public.movie_manual_similar s where movie_id=movie_id_value or similar_movie_id=movie_id_value)) into after_state;
    assert before_state=after_state, 'Failed save partially changed movie data';
    assert not exists(select 1 from public.companies where name='Rollback company'), 'Failed save left a company';
    assert not exists(select 1 from public.people where name_ru='Rollback director'), 'Failed save left a person';

    begin
      perform public.horroreiro_save_movie(missing_id,'{"title":"Failed create"}',
        jsonb_build_object('genres','[]'::jsonb,'countries','[]'::jsonb,'posters','[]'::jsonb,'similar',jsonb_build_array(gen_random_uuid())),true);
      raise exception 'Broken create accepted';
    exception when foreign_key_violation then null;
    end;
    assert not exists(select 1 from public.movies where id=missing_id), 'Broken create left a movie';
    perform public.horroreiro_save_movie(movie_id_value,'{"production":["Не применимо"],"distribution":null,"russian_distribution":null}','{}',false);
    assert not exists(select 1 from public.movie_companies where movie_id=movie_id_value), 'Intentional empty marker became a company';

    -- An empty array clears links; omitted fields/relations preserve existing data.
    perform public.horroreiro_save_movie(movie_id_value,'{"synopsis":"Updated"}','{"posters":[],"similar":[]}',false);
    assert (select title='Atomic original' and synopsis='Updated' from public.movies where id=movie_id_value), 'Patch changed omitted fields';
    assert not exists(select 1 from public.movie_poster_images where movie_id=movie_id_value), 'Gallery was not cleared';
    assert not exists(select 1 from public.movie_manual_similar where movie_id=movie_id_value or similar_movie_id=movie_id_value), 'Reciprocal links were not cleared';
    assert (select count(*)=1 from public.movie_genres where movie_id=movie_id_value), 'Omitted genres changed';
    begin
      perform public.horroreiro_save_movie(movie_id_value,'{"owner_id":null}','{}',false);
      raise exception 'Owner change accepted';
    exception when invalid_parameter_value then null;
    end;
    begin
      perform public.horroreiro_save_movie(missing_id,'{"title":"Missing"}','{}',false);
      raise exception 'Missing movie update silently succeeded';
    exception when no_data_found then null;
    end;
    raise exception using errcode='ZX001',message='movie save smoke rollback';
  exception when sqlstate 'ZX001' then null;
  end;
  assert not exists(select 1 from public.movies where id in (movie_id_value,similar_id)), 'Fixtures escaped rollback';
end $$;
