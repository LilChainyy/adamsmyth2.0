import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortfolioUpload } from "@/components/onboarding/portfolio-upload";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If already onboarded, skip to chat
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect("/chat");
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <PortfolioUpload />
    </div>
  );
}
