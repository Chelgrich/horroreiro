create extension if not exists pg_cron;

do $$
declare
  v_job_id bigint;
begin
  select jobid
    into v_job_id
    from cron.job
    where jobname = 'horroreiro-new-movies-daily-digest'
    limit 1;

  if v_job_id is not null then
    perform cron.unschedule(v_job_id);
  end if;
end;
$$;

select cron.schedule(
  'horroreiro-new-movies-daily-digest',
  '5 21 * * *',
  $$
    select public.create_new_movies_notification_digest(
      (date_trunc('day', now() at time zone 'Europe/Moscow') - interval '1 day') at time zone 'Europe/Moscow',
      date_trunc('day', now() at time zone 'Europe/Moscow') at time zone 'Europe/Moscow'
    );
  $$
);

-- Optional one-time backfill for the previous Moscow day:
-- select public.create_new_movies_notification_digest(
--   (date_trunc('day', now() at time zone 'Europe/Moscow') - interval '1 day') at time zone 'Europe/Moscow',
--   date_trunc('day', now() at time zone 'Europe/Moscow') at time zone 'Europe/Moscow'
-- );
