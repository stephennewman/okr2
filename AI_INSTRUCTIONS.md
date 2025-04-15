# AI Pair Programming Instructions & Log

This document tracks the development process, decisions made, issues encountered, and potential future improvements for the OKR application, primarily focusing on interactions with the AI assistant.

## Project Setup (Initial)

- **Goal:** Create a new Next.js 14 project with a specific stack (TypeScript, Tailwind, Zustand, Supabase, shadcn/ui, etc.).
- **AI Actions:**
    - Ran `create-next-app` with specified flags.
    - Installed all necessary dependencies (Zustand, Supabase libs, shadcn dependencies, lucide, vitest, openai, reactflow).
    - Installed `@supabase/ssr` due to deprecation warnings for older auth-helpers.
    - Initialized `shadcn/ui`.
    - Created standard project directory structure (`src/components`, `src/lib`, `src/stores`, `src/types`, `src/hooks`).
    - Created Supabase client/server/middleware utility files (`src/lib/supabase/`).
    - Created `.env.local` with placeholder Supabase keys.
    - Created Zustand user store (`src/stores/useUserStore.ts`).
    - Created placeholder service files (`src/lib/okrService.ts` (renamed from `entryService.ts`), `src/lib/openaiService.ts`).
    - Updated root layout (`src/app/layout.tsx`) with basic structure and shadcn `cn` utility.
    - Updated home page (`src/app/page.tsx`) with Supabase Auth UI and redirection logic.
    - Created protected dashboard page (`src/app/dashboard/page.tsx`) with auth checks and logout.
    - Configured Vitest (`vitest.config.ts`, `vitest.setup.ts`).
    - Added Vitest test scripts to `package.json`.
    - Created initial Vitest test for the user store (`src/stores/useUserStore.test.ts`).
    - Created this `AI_INSTRUCTIONS.md` file.
    - Updated `.env.local` with provided Supabase and OpenAI keys.
- **Project Info:**
    - GitHub: https://github.com/stephennewman/okr2.git
    - Vercel: okr2.vercel.app
- **Issues/Notes:**
    - Deprecation warning for `@supabase/auth-helpers-nextjs`, switched to `@supabase/ssr`.
    - Deprecation warning for `npx shadcn-ui@latest init`, switched to `npx shadcn@latest init`.
    - Linter errors appeared in `src/lib/supabase/server.ts` related to `cookies()` from `next/headers`. This seems potentially related to type inference or setup and might resolve or need further investigation. Decided to proceed with middleware setup first.
    - React 19 warning during `shadcn` init, used `--force` as suggested by the CLI for potential peer dependency issues.
    - ~~Supabase RLS (Row Level Security) **needs to be configured** for the `okrs` table (renamed from `entries`) to ensure users can only access their own data. (See instructions provided).~~ (User confirmed RLS enabled & basic policies added, with `ON DELETE SET NULL`).
    - The dashboard page currently uses client-side checks for authentication. For enhanced security and better UX (avoiding flashes of content), server-side protection using the Supabase server client and potentially middleware redirects should be implemented.

## Next Steps & Opportunities

- Configure Supabase project (URL, anon key in `.env.local`).
- Set up Supabase database tables (e.g., `users`, `okrs` with `user_id` foreign key). (User confirmed `okrs` table created).
- ~~**Implement Supabase Row Level Security (RLS) policies.** (User needs to do this in Supabase dashboard).~~ (User confirmed done for `okrs` table).
- ~~Define types in `src/types/index.ts` (e.g., `Okr` type created).~~ (Basic type added, refine as needed).
- Flesh out `okrService.ts` with actual CRUD logic and error handling (Update, Delete implementations added).
- Implement ReactFlow canvas on the dashboard.
- Integrate `openaiService.ts` into a specific feature.