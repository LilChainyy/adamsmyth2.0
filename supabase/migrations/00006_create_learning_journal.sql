-- learning_journal: AI-generated summaries and takeaways from learning sessions
create table public.learning_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ticker text,
  dimension text,
  summary text not null,
  key_takeaway text,
  created_at timestamptz not null default now()
);

create index idx_learning_journal_user_id on public.learning_journal(user_id);
create index idx_learning_journal_user_ticker on public.learning_journal(user_id, ticker);

alter table public.learning_journal enable row level security;

create policy "Users can read own journal entries"
  on public.learning_journal for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on public.learning_journal for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on public.learning_journal for update
  using (auth.uid() = user_id);

create policy "Users can delete own journal entries"
  on public.learning_journal for delete
  using (auth.uid() = user_id);
