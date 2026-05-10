-- portfolios: user stock portfolios
create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'My Portfolio',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_portfolios_user_id on public.portfolios(user_id);

alter table public.portfolios enable row level security;

create policy "Users can read own portfolios"
  on public.portfolios for select
  using (auth.uid() = user_id);

create policy "Users can insert own portfolios"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update own portfolios"
  on public.portfolios for update
  using (auth.uid() = user_id);

create policy "Users can delete own portfolios"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolios_set_updated_at
  before update on public.portfolios
  for each row execute function public.set_updated_at();
