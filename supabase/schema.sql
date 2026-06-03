create extension if not exists "pgcrypto";

create table if not exists public.babies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  birth_date date not null,
  gender text check (gender in ('male', 'female', 'other')),
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references public.babies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('feeding', 'diaper', 'sleep', 'pumping')),
  timestamp timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists babies_user_id_idx on public.babies(user_id);
create index if not exists activities_baby_id_timestamp_idx on public.activities(baby_id, timestamp desc);
create index if not exists activities_user_id_idx on public.activities(user_id);

alter table public.babies enable row level security;
alter table public.activities enable row level security;

drop policy if exists "Users can read own babies" on public.babies;
drop policy if exists "Users can insert own babies" on public.babies;
drop policy if exists "Users can update own babies" on public.babies;
drop policy if exists "Users can delete own babies" on public.babies;

create policy "Users can read own babies"
  on public.babies for select
  using (auth.uid() = user_id);

create policy "Users can insert own babies"
  on public.babies for insert
  with check (auth.uid() = user_id);

create policy "Users can update own babies"
  on public.babies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own babies"
  on public.babies for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read own activities" on public.activities;
drop policy if exists "Users can insert own activities" on public.activities;
drop policy if exists "Users can update own activities" on public.activities;
drop policy if exists "Users can delete own activities" on public.activities;

create policy "Users can read own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.activities for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.babies
      where babies.id = activities.baby_id
        and babies.user_id = auth.uid()
    )
  );

create policy "Users can update own activities"
  on public.activities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.activities for delete
  using (auth.uid() = user_id);
