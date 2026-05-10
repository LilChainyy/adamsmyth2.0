const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = "text-embedding-3-small";

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: EMBEDDING_MODEL,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI embeddings API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts,
      model: EMBEDDING_MODEL,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI embeddings API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}
