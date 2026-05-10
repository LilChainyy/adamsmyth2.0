-- chat_messages: conversation history between user and AI assistant
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  thread_id uuid not null default gen_random_uuid(),
  ticker text,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_chat_messages_user_thread on public.chat_messages(user_id, thread_id);
create index idx_chat_messages_created_at on public.chat_messages(created_at);

alter table public.chat_messages enable row level security;

create policy "Users can read own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own messages"
  on public.chat_messages for delete
  using (auth.uid() = user_id);
