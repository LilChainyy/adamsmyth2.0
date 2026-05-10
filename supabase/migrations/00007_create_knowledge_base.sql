create extension if not exists vector;

create table knowledge_base (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null,
  dimension text not null check (dimension in (
    'business_model', 'financials', 'competitive_position',
    'risks', 'news_catalysts', 'valuation_context'
  )),
  embedding vector(1536),
  created_at timestamptz default now()
);

create index on knowledge_base using ivfflat (embedding vector_cosine_ops) with (lists = 20);

create function match_knowledge(
  query_embedding vector(1536),
  match_count int default 3
) returns table (
  id uuid,
  title text,
  content text,
  category text,
  dimension text,
  similarity float
) language plpgsql as $$
begin
  return query
  select
    kb.id, kb.title, kb.content, kb.category, kb.dimension,
    1 - (kb.embedding <=> query_embedding) as similarity
  from knowledge_base kb
  order by kb.embedding <=> query_embedding
  limit match_count;
end;
$$;
