import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { TabViews } from "@/components/tab-views";
import { Providers } from "@/components/providers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check onboarding status — redirect if not completed (unless already on onboarding page)
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  const isOnboarding = !profile?.onboarding_completed;

  // Onboarding page gets a minimal shell (no bottom nav)
  if (isOnboarding) {
    return (
      <Providers>
        <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-stone-50">
          <TopBar />
          <main className="flex-1">{children}</main>
        </div>
      </Providers>
    );
  }

  return (
    <Providers>
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-stone-50">
        <TopBar />
        <main className="flex flex-1 flex-col pb-16">
          <TabViews />
        </main>
        <BottomNav />
      </div>
    </Providers>
  );
}
