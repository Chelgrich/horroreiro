alter table public.movies
  add column if not exists production text[],
  add column if not exists distribution text[],
  add column if not exists russian_distribution text[];

comment on column public.movies.production is 'Production values shown on movie detail pages, stored in display order.';
comment on column public.movies.distribution is 'Distribution values shown on movie detail pages, stored in display order.';
comment on column public.movies.russian_distribution is 'Russian distribution values shown on movie detail pages, stored in display order.';
