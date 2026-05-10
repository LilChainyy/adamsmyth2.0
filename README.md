# AdamsMyth 2.0

An AI learning assistant that helps you understand your investment portfolio — without telling you what to do.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (Postgres + Auth + pgvector)
- **AI:** Anthropic Claude (via Vercel AI SDK) + OpenAI embeddings
- **Data:** Financial Modeling Prep API

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`. See the file for descriptions of each variable.

### 3. Set up Supabase

Run all migrations in order:

```bash
# Apply migrations to your Supabase project
supabase db push
```

Or manually run each file in `supabase/migrations/` against your database.

### 4. Seed the knowledge base (optional)

```bash
npm run seed-knowledge
```

Requires `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run tests (vitest) |
| `npm run lint` | Run ESLint |
| `npm run seed-knowledge` | Seed educational articles into knowledge base |
| `npm run crawl-knowledge` | Crawl external sources into knowledge base (requires FIRECRAWL_API_KEY) |

## Deployment (Vercel)

### Prerequisites

1. A Vercel account connected to this repo
2. A Supabase project with all migrations applied
3. All environment variables configured in Vercel dashboard

### Steps

1. Push to `main` branch (auto-deploys if connected), or:

```bash
vercel deploy --prod
```

2. Set environment variables in Vercel dashboard → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `FINANCIAL_DATA_API_KEY`
   - `OPENAI_API_KEY`
   - `FIRECRAWL_API_KEY` (optional)

3. Verify Supabase RLS policies are enabled and correct for production.

### Vercel Configuration

The `vercel.json` file includes:
- Region: `iad1` (US East)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

## Architecture

```
src/
├── app/
│   ├── (marketing)/     # Public landing page
│   ├── (auth)/          # Login, signup
│   ├── (app)/           # Authenticated app (chat, progress, settings)
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utilities, API clients, helpers
├── hooks/               # Custom React hooks
├── data/                # Static data (articles, sources)
└── scripts/             # CLI scripts (seed, crawl)
```

## Testing

```bash
npm run test
```

Tests cover:
- Learning framework logic
- API caching behavior
- CSV parsing
- Onboarding flow validation
- AI safety rules (investment advice refusal)
