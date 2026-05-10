import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/embeddings";

export interface KnowledgeResult {
  id: string;
  title: string;
  content: string;
  category: string;
  dimension: string;
  similarity: number;
}

export async function searchKnowledgeBase(
  query: string,
  limit: number = 3
): Promise<KnowledgeResult[]> {
  const embedding = await generateEmbedding(query);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_knowledge", {
    query_embedding: embedding,
    match_count: limit,
  });

  if (error) {
    console.error("[knowledge-search] Error:", error.message);
    return [];
  }

  return data ?? [];
}
