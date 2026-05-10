import { createClient } from "@supabase/supabase-js";
import { educationalArticles } from "../data/educational-articles";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error(
    "Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts,
      model: "text-embedding-3-small",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

async function seed() {
  console.log(`Seeding ${educationalArticles.length} educational articles...`);

  // Generate embeddings in batches of 10
  const batchSize = 10;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < educationalArticles.length; i += batchSize) {
    const batch = educationalArticles.slice(i, i + batchSize);
    const texts = batch.map((a) => `${a.title}\n\n${a.content}`);
    console.log(
      `  Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(educationalArticles.length / batchSize)}...`
    );
    const embeddings = await generateEmbeddings(texts);
    allEmbeddings.push(...embeddings);
  }

  // Insert into knowledge_base
  const rows = educationalArticles.map((article, idx) => ({
    title: article.title,
    content: article.content,
    category: article.category,
    dimension: article.dimension,
    embedding: JSON.stringify(allEmbeddings[idx]),
  }));

  const { error } = await supabase.from("knowledge_base").insert(rows);

  if (error) {
    console.error("Insert error:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${rows.length} articles.`);
}

seed();
