alter table public.movies
  add column if not exists trailer_url text;

comment on column public.movies.trailer_url is 'YouTube trailer URL shown as an embedded trailer on movie detail pages.';
