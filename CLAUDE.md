# CLAUDE.md

## Project

**AdamsMyth 2.0** — An investment learning assistant web app.

## Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Postgres + Auth), Python FastAPI for AI service
- **Streaming:** Vercel AI SDK for chat streaming

## Architecture

- Two-tab app: **Chat** + **Progress**
- Chat is the primary surface
- AI agent uses tool calling (not multi-agent)
- Supabase handles auth, data, and realtime

## Conventions

- All components in `/components`, pages in `/app`
- Use server components by default; add `'use client'` only when needed
- Zustand for client state, React Query for server state
- All API routes in `/app/api`
- Environment variables for all secrets (never hardcode)
- Mobile-first responsive design
- Every component gets its own file
- Use absolute imports with `@/` prefix

## AI Behavior Rules

These govern the app's AI assistant, not the coding AI.

- NEVER give investment advice (buy/sell/hold)
- NEVER provide price targets or portfolio allocation suggestions
- Always frame responses as educational
- Track learning progress across 6 dimensions per stock

## Do Not

- Use `localStorage` or `sessionStorage`
- Create god components (max 150 lines per component)
- Skip TypeScript types
- Use any CSS framework besides Tailwind
- Put API keys in code
