import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches the portfolio ID for a given user.
 * Returns null if no portfolio exists.
 */
export async function getPortfolioId(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    throw error;
  }

  return data?.id ?? null;
}
