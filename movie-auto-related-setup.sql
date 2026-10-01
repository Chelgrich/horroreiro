-- Automatic related movies data model.
-- Apply manually in Supabase SQL editor before implementing the sync pipeline.
-- This creates only local storage/RLS. It does not call TMDb/Trakt and does
-- not change the current manual `movie_manual_similar` workflow.

create extension if not exists pgcrypto;

create table if not exists public.movie_recommendation_sync_state (
  movie_id uuid primary key references public.movies(id) on delete cascade,

  tmdb_id integer,
  imdb_id text,
  trakt_id integer,

  recommendations_last_synced_at timestamptz,
  recommendations_last_success_at timestamptz,
  recommendations_last_error text,

  trakt_last_success_at timestamptz,
  trakt_last_error text,
  trakt_last_status_code integer,
  trakt_external_count integer,
  trakt_matched_count integer,

  tmdb_last_success_at timestamptz,
  tmdb_last_error text,
  tmdb_last_status_code integer,
  tmdb_external_count integer,
  tmdb_matched_count integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint movie_recommendation_sync_state_tmdb_id_positive
    check (tmdb_id is null or tmdb_id > 0),
  constraint movie_recommendation_sync_state_trakt_id_positive
    check (trakt_id is null or trakt_id > 0),
  constraint movie_recommendation_sync_state_imdb_id_not_empty
    check (imdb_id is null or btrim(imdb_id) <> ''),
  constraint movie_recommendation_sync_state_trakt_status_positive
    check (trakt_last_status_code is null or trakt_last_status_code > 0),
  constraint movie_recommendation_sync_state_tmdb_status_positive
    check (tmdb_last_status_code is null or tmdb_last_status_code > 0),
  constraint movie_recommendation_sync_state_trakt_counts_nonnegative
    check (
      (trakt_external_count is null or trakt_external_count >= 0)
      and (trakt_matched_count is null or trakt_matched_count >= 0)
    ),
  constraint movie_recommendation_sync_state_tmdb_counts_nonnegative
    check (
      (tmdb_external_count is null or tmdb_external_count >= 0)
      and (tmdb_matched_count is null or tmdb_matched_count >= 0)
    )
);

create unique index if not exists movie_recommendation_sync_state_tmdb_id_idx
  on public.movie_recommendation_sync_state (tmdb_id)
  where tmdb_id is not null;

create unique index if not exists movie_recommendation_sync_state_imdb_id_idx
  on public.movie_recommendation_sync_state (imdb_id)
  where imdb_id is not null;

create unique index if not exists movie_recommendation_sync_state_trakt_id_idx
  on public.movie_recommendation_sync_state (trakt_id)
  where trakt_id is not null;

create table if not exists public.movie_recommendation_evidence (
  id uuid primary key default gen_random_uuid(),
  source_movie_id uuid not null references public.movies(id) on delete cascade,
  target_movie_id uuid not null references public.movies(id) on delete cascade,
  provider text not null,
  provider_rank integer not null,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint movie_recommendation_evidence_provider_check
    check (provider in ('trakt_related', 'tmdb_recommendations', 'manual')),
  constraint movie_recommendation_evidence_rank_positive
    check (provider_rank > 0),
  constraint movie_recommendation_evidence_no_self_link
    check (source_movie_id <> target_movie_id)
);

create unique index if not exists movie_recommendation_evidence_unique_idx
  on public.movie_recommendation_evidence (provider, source_movie_id, target_movie_id);

create index if not exists movie_recommendation_evidence_source_idx
  on public.movie_recommendation_evidence (source_movie_id, provider, provider_rank);

create index if not exists movie_recommendation_evidence_target_idx
  on public.movie_recommendation_evidence (target_movie_id, provider, provider_rank);

create index if not exists movie_recommendation_evidence_fetched_idx
  on public.movie_recommendation_evidence (fetched_at);

create table if not exists public.movie_recommendation_overrides (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  related_movie_id uuid not null references public.movies(id) on delete cascade,
  action text not null,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint movie_recommendation_overrides_action_check
    check (action in ('include', 'hide')),
  constraint movie_recommendation_overrides_no_self_link
    check (movie_id <> related_movie_id)
);

create unique index if not exists movie_recommendation_overrides_unique_idx
  on public.movie_recommendation_overrides (movie_id, related_movie_id);

create index if not exists movie_recommendation_overrides_action_idx
  on public.movie_recommendation_overrides (action);

create table if not exists public.movie_related (
  movie_id uuid not null references public.movies(id) on delete cascade,
  related_movie_id uuid not null references public.movies(id) on delete cascade,
  score double precision not null default 0,
  position integer not null,
  confidence text not null,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (movie_id, related_movie_id),

  constraint movie_related_no_self_link
    check (movie_id <> related_movie_id),
  constraint movie_related_score_nonnegative
    check (score >= 0),
  constraint movie_related_position_nonnegative
    check (position >= 0),
  constraint movie_related_confidence_check
    check (confidence in ('manual', 'strong', 'normal', 'fallback'))
);

create index if not exists movie_related_movie_position_idx
  on public.movie_related (movie_id, position);

create index if not exists movie_related_related_movie_idx
  on public.movie_related (related_movie_id);

create or replace function public.horroreiro_touch_movie_recommendation_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists movie_recommendation_sync_state_touch_updated_at
  on public.movie_recommendation_sync_state;

create trigger movie_recommendation_sync_state_touch_updated_at
before update on public.movie_recommendation_sync_state
for each row
execute function public.horroreiro_touch_movie_recommendation_updated_at();

drop trigger if exists movie_recommendation_evidence_touch_updated_at
  on public.movie_recommendation_evidence;

create trigger movie_recommendation_evidence_touch_updated_at
before update on public.movie_recommendation_evidence
for each row
execute function public.horroreiro_touch_movie_recommendation_updated_at();

drop trigger if exists movie_recommendation_overrides_touch_updated_at
  on public.movie_recommendation_overrides;

create trigger movie_recommendation_overrides_touch_updated_at
before update on public.movie_recommendation_overrides
for each row
execute function public.horroreiro_touch_movie_recommendation_updated_at();

drop trigger if exists movie_related_touch_updated_at
  on public.movie_related;

create trigger movie_related_touch_updated_at
before update on public.movie_related
for each row
execute function public.horroreiro_touch_movie_recommendation_updated_at();

alter table public.movie_recommendation_sync_state enable row level security;
alter table public.movie_recommendation_evidence enable row level security;
alter table public.movie_recommendation_overrides enable row level security;
alter table public.movie_related enable row level security;

grant select on public.movie_related to anon, authenticated;
grant insert, update, delete on public.movie_related to authenticated;

grant select, insert, update, delete
  on public.movie_recommendation_sync_state to authenticated;
grant select, insert, update, delete
  on public.movie_recommendation_evidence to authenticated;
grant select, insert, update, delete
  on public.movie_recommendation_overrides to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_related'
      and policyname = 'Public can read movie related'
  ) then
    create policy "Public can read movie related"
      on public.movie_related
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'movie_related'
      and policyname = 'Admins can manage movie related'
  ) then
    create policy "Admins can manage movie related"
      on public.movie_related
      for all
      to authenticated
      using (
        exists (
          select 1
          from public.profiles
          where profiles.id = (select auth.uid())
            and profiles.role = 'admin'
        )
      )
      with check (
        exists (
          select 1
          from public.profiles
          where profiles.id = (select auth.uid())
            and profiles.role = 'admin'
        )
      );
  end if;
end
$$;

do $$
declare
  protected_table text;
  read_policy_name text;
  manage_policy_name text;
begin
  foreach protected_table in array array[
    'movie_recommendation_sync_state',
    'movie_recommendation_evidence',
    'movie_recommendation_overrides'
  ] loop
    read_policy_name := 'Admins can read ' || protected_table;
    manage_policy_name := 'Admins can manage ' || protected_table;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = protected_table
        and policyname = read_policy_name
    ) then
      execute format(
        'create policy %I on public.%I for select to authenticated using (
          exists (
            select 1
            from public.profiles
            where profiles.id = (select auth.uid())
              and profiles.role = ''admin''
          )
        )',
        read_policy_name,
        protected_table
      );
    end if;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = protected_table
        and policyname = manage_policy_name
    ) then
      execute format(
        'create policy %I on public.%I for all to authenticated using (
          exists (
            select 1
            from public.profiles
            where profiles.id = (select auth.uid())
              and profiles.role = ''admin''
          )
        ) with check (
          exists (
            select 1
            from public.profiles
            where profiles.id = (select auth.uid())
              and profiles.role = ''admin''
          )
        )',
        manage_policy_name,
        protected_table
      );
    end if;
  end loop;
end
$$;
