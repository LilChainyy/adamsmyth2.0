import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900">
      <header className="fixed top-0 z-50 w-full border-b border-stone-200/60 bg-stone-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="text-lg font-bold tracking-tight">
            AdamsMyth
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-14">{children}</main>
      <footer className="border-t border-stone-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-stone-900">AdamsMyth</p>
            <p className="text-xs text-stone-500">
              An investment learning assistant. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
