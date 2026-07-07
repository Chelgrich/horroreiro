alter table public.people
  add column if not exists gender text;

update public.people
set gender = 'М'
where gender is null
   or gender not in ('М', 'Ж');

alter table public.people
  alter column gender set default 'М',
  alter column gender set not null;

alter table public.people
  drop constraint if exists people_gender_check;

alter table public.people
  add constraint people_gender_check
  check (gender in ('М', 'Ж'));
