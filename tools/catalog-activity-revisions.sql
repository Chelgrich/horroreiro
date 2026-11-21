begin;
set local lock_timeout = '3s';

create table public.catalog_activity_revision (
  kind text primary key check (kind in ('ratings', 'reviews')),
  revision uuid not null default pg_catalog.gen_random_uuid()
);

alter table public.catalog_activity_revision enable row level security;
revoke all on public.catalog_activity_revision from public, anon, authenticated;
grant select (kind, revision) on public.catalog_activity_revision to anon, authenticated;
create policy read_catalog_activity_revision on public.catalog_activity_revision
  for select to anon, authenticated using (true);

insert into public.catalog_activity_revision (kind) values ('ratings'), ('reviews');

create view public.catalog_revisions with (security_invoker = true) as
  select movies.revision as movie_index, ratings.revision as ratings, reviews.revision as reviews
  from public.catalog_movie_index_revision movies
  cross join public.catalog_activity_revision ratings
  cross join public.catalog_activity_revision reviews
  where ratings.kind = 'ratings' and reviews.kind = 'reviews';

revoke all on public.catalog_revisions from public, anon, authenticated;
grant select on public.catalog_revisions to anon, authenticated;

create function public.bump_catalog_activity_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.catalog_activity_revision
  set revision = pg_catalog.gen_random_uuid()
  where kind = tg_argv[0];
  return null;
end;
$$;

revoke all on function public.bump_catalog_activity_revision() from public, anon, authenticated;

create trigger bump_catalog_rating_revision
  after insert or update or delete or truncate on public.movie_ratings
  for each statement execute function public.bump_catalog_activity_revision('ratings');

create trigger bump_catalog_review_revision
  after insert or update of movie_id or delete or truncate on public.movie_reviews
  for each statement execute function public.bump_catalog_activity_revision('reviews');

notify pgrst, 'reload schema';
commit;
