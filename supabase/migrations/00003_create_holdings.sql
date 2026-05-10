-- holdings: individual stock positions within a portfolio
create table public.holdings (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  ticker text not null,
  company_name text,
  shares decimal,
  avg_cost_basis decimal,
  added_at timestamptz not null default now(),
  unique (portfolio_id, ticker)
);

create index idx_holdings_portfolio_id on public.holdings(portfolio_id);

alter table public.holdings enable row level security;

create policy "Users can read own holdings"
  on public.holdings for select
  using (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
        and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can insert own holdings"
  on public.holdings for insert
  with check (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
        and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can update own holdings"
  on public.holdings for update
  using (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
        and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can delete own holdings"
  on public.holdings for delete
  using (
    exists (
      select 1 from public.portfolios
      where portfolios.id = holdings.portfolio_id
        and portfolios.user_id = auth.uid()
    )
  );
