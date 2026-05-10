-- learning_progress: tracks user understanding across 6 dimensions per stock
create type public.learning_dimension as enum (
  'business_model',
  'financials',
  'competitive_position',
  'risks',
  'news_catalysts',
  'valuation_context'
);

create type public.learning_status as enum (
  'not_started',
  'in_progress',
  'completed'
);

create table public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ticker text not null,
  dimension public.learning_dimension not null,
  sub_topic text not null,
  status public.learning_status not null default 'not_started',
  completed_at timestamptz,
  evidence text,
  unique (user_id, ticker, dimension, sub_topic)
);

create index idx_learning_progress_user_ticker on public.learning_progress(user_id, ticker);

alter table public.learning_progress enable row level security;

create policy "Users can read own learning progress"
  on public.learning_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own learning progress"
  on public.learning_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own learning progress"
  on public.learning_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own learning progress"
  on public.learning_progress for delete
  using (auth.uid() = user_id);
