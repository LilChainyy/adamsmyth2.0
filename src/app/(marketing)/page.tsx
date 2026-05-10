import Link from "next/link";
import {
  BookOpen,
  MessageCircle,
  TrendingUp,
  Shield,
  Target,
  Brain,
} from "lucide-react";

const dimensions = [
  { name: "Business Model", icon: BookOpen, color: "bg-amber-100 text-amber-700" },
  { name: "Financials", icon: TrendingUp, color: "bg-emerald-100 text-emerald-700" },
  { name: "Competitive Position", icon: Shield, color: "bg-blue-100 text-blue-700" },
  { name: "Risks", icon: Target, color: "bg-red-100 text-red-700" },
  { name: "News & Catalysts", icon: MessageCircle, color: "bg-purple-100 text-purple-700" },
  { name: "Valuation Context", icon: Brain, color: "bg-stone-100 text-stone-700" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-20 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Understand what you own
            </h1>
            <p className="mt-5 text-lg text-stone-600 sm:text-xl">
              An AI learning assistant that helps you make sense of your
              investment portfolio — without telling you what to do.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-stone-900 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-stone-900/20 hover:bg-stone-800 transition-all hover:shadow-xl hover:shadow-stone-900/25"
              >
                Start learning — it&apos;s free
              </Link>
            </div>
          </div>

          {/* Chat mockup */}
          <div className="mx-auto mt-14 max-w-sm">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-3 shadow-2xl shadow-stone-300/40">
              <div className="rounded-[1.5rem] bg-stone-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-stone-300" />
                  <div className="h-2 w-16 rounded-full bg-stone-200" />
                </div>
                <div className="space-y-3">
                  <div className="ml-auto w-3/4 rounded-2xl rounded-br-md bg-stone-900 px-4 py-2.5 text-sm text-white">
                    What does Apple&apos;s P/E ratio mean?
                  </div>
                  <div className="w-5/6 rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-stone-700 shadow-sm border border-stone-100">
                    Great question! Think of P/E like the price tag on a
                    lemonade stand relative to its earnings...
                  </div>
                  <div className="ml-auto w-2/3 rounded-2xl rounded-br-md bg-stone-900 px-4 py-2.5 text-sm text-white">
                    How does that compare to Microsoft?
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-stone-300 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-stone-300 animate-pulse [animation-delay:150ms]" />
                    <div className="h-2 w-2 rounded-full bg-stone-300 animate-pulse [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-stone-200 bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step
              number="1"
              title="Upload your stocks"
              description="Add the stocks you already own — paste a CSV from your broker or type them in manually."
            />
            <Step
              number="2"
              title="Chat with your learning assistant"
              description="Ask anything about what you hold. Get clear, jargon-free explanations with real data — never advice."
            />
            <Step
              number="3"
              title="Track your progress"
              description="See how your understanding deepens over time across 6 key dimensions for each stock."
            />
          </div>
        </div>
      </section>

      {/* 6 Dimensions */}
      <section className="border-t border-stone-200 px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Learn every angle of a stock
            </h2>
            <p className="mt-3 text-stone-600">
              We break down understanding a company into 6 dimensions. Master
              them all, and you&apos;ll think like an analyst — but make your own
              decisions.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 md:grid-cols-3">
            {dimensions.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className={`rounded-lg p-2 ${d.color}`}>
                  <d.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="border-t border-stone-200 bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            What we don&apos;t do
          </h2>
          <p className="mt-3 text-center text-stone-600">
            This is an education tool, not a robo-advisor.
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-5 sm:grid-cols-3">
            <Pledge text="We never tell you to buy or sell" />
            <Pledge text="We never give price targets" />
            <Pledge text="We teach you to think for yourself" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-stone-200 px-5 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to understand your portfolio?
          </h2>
          <p className="mt-3 text-stone-600">
            Free to use. No credit card. Just curiosity.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-stone-900 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-stone-900/20 hover:bg-stone-800 transition-all hover:shadow-xl hover:shadow-stone-900/25"
            >
              Start learning — it&apos;s free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
        {number}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
    </div>
  );
}

function Pledge({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 text-center">
      <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
        <span className="text-base">&#x2717;</span>
      </div>
      <p className="text-sm font-medium text-stone-800">{text}</p>
    </div>
  );
}
