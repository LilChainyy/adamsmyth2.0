"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Trash2, Plus, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Holding {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string>("");
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicker, setNewTicker] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      const portfolioId = portfolios?.[0]?.id;
      if (portfolioId) {
        const { data } = await supabase
          .from("holdings")
          .select("id, ticker, company_name, shares")
          .eq("portfolio_id", portfolioId);
        setHoldings(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleAddStock() {
    if (!newTicker.trim()) return;
    setAdding(true);
    const ticker = newTicker.trim().toUpperCase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    const portfolioId = portfolios?.[0]?.id;
    if (!portfolioId) {
      setAdding(false);
      return;
    }

    const { data, error } = await supabase
      .from("holdings")
      .insert({ portfolio_id: portfolioId, ticker, company_name: ticker, shares: 0 })
      .select("id, ticker, company_name, shares")
      .single();

    if (!error && data) {
      setHoldings((prev) => [...prev, data]);
      setNewTicker("");
    }
    setAdding(false);
  }

  async function handleRemoveStock(id: string) {
    setRemoving(id);
    const { error } = await supabase.from("holdings").delete().eq("id", id);
    if (!error) {
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    }
    setRemoving(null);
  }

  if (loading) {
    return (
      <div className="space-y-4 px-4 pt-6">
        <div className="h-6 w-32 animate-pulse rounded bg-stone-200" />
        <div className="h-20 animate-pulse rounded-xl bg-stone-100" />
        <div className="h-6 w-40 animate-pulse rounded bg-stone-200" />
        <div className="h-32 animate-pulse rounded-xl bg-stone-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pt-6 pb-24">
      <h2 className="text-xl font-bold text-stone-800">Settings</h2>

      {/* Account */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-stone-500">
          <User className="size-4" />
          Account
        </h3>
        <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
          <p className="text-sm text-stone-600">Email</p>
          <p className="text-sm font-medium text-stone-800">{email}</p>
        </div>
      </section>

      {/* Portfolio */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-stone-500">Portfolio</h3>
        <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
          {holdings.length === 0 ? (
            <p className="text-sm text-stone-500">No stocks in your portfolio yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {holdings.map((h) => (
                <li key={h.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{h.ticker}</p>
                    <p className="text-xs text-stone-500">{h.company_name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveStock(h.id)}
                    disabled={removing === h.id}
                    aria-label={`Remove ${h.ticker}`}
                    className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3">
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddStock()}
              placeholder="Add ticker (e.g. AAPL)"
              aria-label="Add stock ticker"
              className="h-9 flex-1 rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50"
            />
            <Button
              onClick={handleAddStock}
              disabled={adding || !newTicker.trim()}
              size="sm"
              className="h-9 rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left text-sm font-medium text-red-600 ring-1 ring-stone-200/60 transition-colors hover:bg-red-50"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </section>

      {/* About */}
      <section>
        <div className="flex items-start gap-3 rounded-xl bg-stone-50 p-4 ring-1 ring-stone-200/60">
          <Info className="mt-0.5 size-4 shrink-0 text-stone-400" />
          <div>
            <p className="text-sm font-medium text-stone-700">About AdamsMyth</p>
            <p className="mt-1 text-xs text-stone-500">
              An investment learning assistant that helps you understand what you own —
              without telling you what to do. Built for curious beginners.
            </p>
            <p className="mt-2 text-xs text-stone-400">Version 2.0</p>
          </div>
        </div>
      </section>
    </div>
  );
}
