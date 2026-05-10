import { createClient } from "@supabase/supabase-js";
import { scrapeUrl } from "../lib/firecrawl";
import knowledgeSources from "../data/knowledge-sources.json";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error(
    "Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY"
  );
  process.exit(1);
}

if (!FIRECRAWL_API_KEY) {
  console.error("FIRECRAWL_API_KEY is required for crawling");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface KnowledgeSource {
  url: string;
  title: string;
  dimension: string;
  category: string;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-3-small",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

function chunkText(text: string, maxWords: number = 400): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const combined = currentChunk ? `${currentChunk}\n\n${para}` : para;
    const wordCount = combined.split(/\s+/).length;

    if (wordCount > maxWords && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk = combined;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Filter out very short chunks (less than 50 words)
  return chunks.filter((c) => c.split(/\s+/).length >= 50);
}

async function crawl() {
  const sources = knowledgeSources as KnowledgeSource[];
  console.log(`Crawling ${sources.length} knowledge sources...\n`);

  let totalInserted = 0;

  for (const source of sources) {
    console.log(`Scraping: ${source.title} (${source.url})`);

    try {
      const result = await scrapeUrl(source.url);
      if (!result) {
        console.log(`  SKIPPED - scrape failed or no content\n`);
        continue;
      }

      const chunks = chunkText(result.markdown);
      console.log(`  Got ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const title =
          chunks.length > 1
            ? `${source.title} (Part ${i + 1})`
            : source.title;

        const embedding = await generateEmbedding(`${title}\n\n${chunk}`);

        const { error } = await supabase.from("knowledge_base").insert({
          title,
          content: chunk,
          category: source.category,
          dimension: source.dimension,
          embedding: JSON.stringify(embedding),
        });

        if (error) {
          console.log(`  ERROR inserting chunk ${i + 1}: ${error.message}`);
          continue;
        }

        totalInserted++;
      }

      console.log(`  Inserted ${chunks.length} chunks\n`);

      // Rate limit: wait 1 second between sources
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.log(
        `  FAILED: ${err instanceof Error ? err.message : "Unknown error"}\n`
      );
      continue;
    }
  }

  console.log(`\nDone! Inserted ${totalInserted} total chunks.`);
}

crawl();
