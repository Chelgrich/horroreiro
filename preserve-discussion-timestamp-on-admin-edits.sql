create or replace function public.set_movie_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  if public.is_admin() and old.user_id is distinct from (select auth.uid()) then
    new.updated_at = old.updated_at;
  else
    new.updated_at = now();
  end if;

  return new;
end;
$$;

create or replace function public.set_movie_comment_updated_at()
returns trigger
language plpgsql
as $$
begin
  if public.is_admin() and old.user_id is distinct from (select auth.uid()) then
    new.updated_at = old.updated_at;
  else
    new.updated_at = now();
  end if;

  return new;
end;
$$;
