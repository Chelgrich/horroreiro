-- Run as postgres in the Supabase SQL editor. All test writes are rolled back.
do $$
declare
  user_id uuid;
  admin_id uuid;
  test_movie_id uuid;
  test_genre_id public.genres.id%type;
  test_country_id public.countries.id%type;
  affected integer;
  table_name text;
begin
  assert not has_table_privilege('authenticated', 'public.profiles', 'INSERT'),
    'Profiles must be created by the Auth trigger, not the browser';
  assert not has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'),
    'An authenticated user can change profiles.role';
  assert not exists (
    select 1 from information_schema.columns c
    where c.table_schema = 'public' and c.table_name = 'profiles'
      and c.column_name not in ('display_name', 'avatar_url', 'prefer_russian_posters')
      and has_column_privilege('authenticated', 'public.profiles', c.column_name, 'UPDATE')
  ), 'A browser can change a server-managed profile field';
  assert has_table_privilege('service_role', 'public.profiles', 'INSERT')
    and has_column_privilege('service_role', 'public.profiles', 'role', 'UPDATE'),
    'Server profile management is unavailable';
  assert exists (
    select 1 from pg_trigger
    where tgrelid = 'auth.users'::regclass and not tgisinternal
      and tgfoid = 'public.handle_new_user()'::regprocedure and tgenabled = 'O'
  ) and exists (
    select 1 from pg_proc
    where oid = 'public.handle_new_user()'::regprocedure and prosecdef
      and has_table_privilege(pg_get_userbyid(proowner), 'public.profiles', 'INSERT')
  ), 'Auth registration cannot create profiles';

  foreach table_name in array array['profiles', 'genres', 'countries', 'movie_genres', 'movie_countries'] loop
    assert not has_table_privilege('anon', 'public.' || table_name, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'),
      'Anonymous writes are allowed on ' || table_name;
    assert not has_table_privilege('authenticated', 'public.' || table_name, 'TRUNCATE,REFERENCES,TRIGGER'),
      'Unnecessary client privileges on ' || table_name;
    assert (select relrowsecurity from pg_class where oid = ('public.' || table_name)::regclass),
      'RLS is disabled on ' || table_name;
  end loop;

  select id into strict user_id from public.profiles where role = 'user' and display_name <> '' limit 1;
  select id into strict admin_id from public.profiles where role = 'admin' limit 1;
  select id into strict test_movie_id from public.movies limit 1;

  begin
    -- Exercise the former owner-policy bypass; other sessions never see this change.
    update public.movies set owner_id = user_id where id = test_movie_id;
    perform set_config('request.jwt.claims', jsonb_build_object('sub', user_id, 'role', 'authenticated')::text, true);
    set local role authenticated;
    assert not public.is_admin(), 'Ordinary user is treated as admin';

    begin
      update public.profiles set role = 'admin' where id = user_id;
      raise exception 'Role escalation was accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.profiles (id, role) values (user_id, 'admin');
      raise exception 'A browser profile insert was accepted';
    exception when insufficient_privilege then null;
    end;

    update public.profiles set display_name = display_name, avatar_url = avatar_url,
      prefer_russian_posters = prefer_russian_posters where id = user_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Own profile settings cannot be saved';
    update public.profiles set avatar_url = avatar_url where id = admin_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Another user profile can be changed';

    foreach table_name in array array['genres', 'countries'] loop
      begin
        execute format('insert into public.%I (name) values ($1)', table_name)
          using '__access_smoke_' || gen_random_uuid()::text;
        raise exception 'Ordinary user can insert into %', table_name;
      exception when insufficient_privilege then null;
      end;
    end loop;

    perform set_config('request.jwt.claims', jsonb_build_object('sub', admin_id, 'role', 'authenticated')::text, true);
    assert public.is_admin(), 'Admin role lookup is unavailable';
    insert into public.genres (name) values ('__access_smoke_' || gen_random_uuid()::text) returning id into test_genre_id;
    insert into public.countries (name) values ('__access_smoke_' || gen_random_uuid()::text) returning id into test_country_id;
    insert into public.movie_genres (movie_id, genre_id, position) values (test_movie_id, test_genre_id, 0);
    insert into public.movie_countries (movie_id, country_id) values (test_movie_id, test_country_id);
    update public.genres set name = name where id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin genre update is denied';
    update public.countries set name = name where id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin country update is denied';

    perform set_config('request.jwt.claims', jsonb_build_object('sub', user_id, 'role', 'authenticated')::text, true);
    begin
      insert into public.movie_genres (movie_id, genre_id, position) values (test_movie_id, test_genre_id, 0);
      raise exception 'An ordinary owner can insert movie genres';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.movie_countries (movie_id, country_id) values (test_movie_id, test_country_id);
      raise exception 'An ordinary owner can insert movie countries';
    exception when insufficient_privilege then null;
    end;
    update public.movie_genres set position = position where movie_genres.genre_id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'An ordinary owner can update movie genres';
    update public.movie_countries set country_id = country_id where movie_countries.country_id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'An ordinary owner can update movie countries';
    update public.genres set name = name where id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Ordinary user can update a genre';
    delete from public.genres where id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Ordinary user can delete a genre';
    update public.countries set name = name where id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Ordinary user can update a country';
    delete from public.countries where id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Ordinary user can delete a country';
    delete from public.movie_genres where movie_genres.genre_id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Ordinary user can delete movie genres';
    delete from public.movie_countries where movie_countries.country_id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 0, 'Ordinary user can delete movie countries';

    perform set_config('request.jwt.claims', jsonb_build_object('sub', admin_id, 'role', 'authenticated')::text, true);
    update public.movie_genres set position = position where movie_genres.genre_id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin movie genre update is denied';
    update public.movie_countries set country_id = country_id where movie_countries.country_id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin movie country update is denied';
    delete from public.movie_genres where movie_genres.genre_id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin movie genre delete is denied';
    delete from public.movie_countries where movie_countries.country_id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin movie country delete is denied';
    delete from public.genres where id = test_genre_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin genre delete is denied';
    delete from public.countries where id = test_country_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Admin country delete is denied';

    set local role service_role;
    update public.profiles set role = role where id = admin_id;
    get diagnostics affected = row_count;
    assert affected = 1, 'Service role cannot manage profile roles';
    set local role anon;
    perform id from public.profiles limit 1;
    perform id from public.genres limit 1;
    perform id from public.countries limit 1;

    -- Roll back fixtures, ownership and no-op updates, including any trigger effects.
    raise exception using errcode = 'ZX001', message = 'access smoke rollback';
  exception when sqlstate 'ZX001' then null;
  end;
end $$;
