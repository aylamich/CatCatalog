-- Cat Breeds Catalog: cloud copy of favorites and kitties met.
-- Run once in Supabase: SQL Editor > New query > paste > Run.
--
-- The app login is local, so rows are owned by the user's email (user_email).
-- Without Supabase Auth the publishable key cannot tell users apart, so the policies
-- below let the app read and write any row. Acceptable for this academic project only.

create table if not exists public.favorites (
  user_email text not null,
  breed_id   text not null,
  name       text not null,
  image_url  text,
  created_at timestamptz not null default now(),
  primary key (user_email, breed_id)
);

create table if not exists public.met (
  user_email text not null,
  breed_id   text not null,
  name       text not null,
  image_url  text,
  rating     int  not null check (rating between 1 and 5),
  met_at     timestamptz not null default now(),
  primary key (user_email, breed_id)
);

alter table public.favorites enable row level security;
alter table public.met enable row level security;

drop policy if exists "app can manage favorites" on public.favorites;
create policy "app can manage favorites" on public.favorites
  for all to anon using (true) with check (true);

drop policy if exists "app can manage met" on public.met;
create policy "app can manage met" on public.met
  for all to anon using (true) with check (true);
