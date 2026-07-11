# Agent notes

Compact repo guidance for OpenCode sessions. Skip anything already obvious from filenames.

## Stack & tooling

- **Package manager:** pnpm. Use `pnpm ...`; do not use npm/yarn.
- **Next.js 16 + React 19**, App Router. Dev server uses Turbopack: `pnpm dev`.
- **Tailwind CSS v4** — configured in CSS only (`src/app/globals.css`) via `@import "tailwindcss"`. There is no `tailwind.config.*`.
- **shadcn/ui v4** (`components.json`, style `radix-nova`). Add components with `pnpm dlx shadcn@latest add <component>`.
- **State:** Redux Toolkit + RTK Query + redux-persist. Typed hooks are in `src/redux/hook.ts`.

## Required env

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SERVER_URL=https://your-api-base-url
```

No other env variables are wired in; `src/config/index.ts` only reads this one.

## Developer commands

| Command | What it does |
|---------|---------------|
| `pnpm install` | Install deps |
| `pnpm dev` | Start Turbopack dev server on http://localhost:3000 |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint (flat config in `eslint.config.mjs`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Format `.ts`/`.tsx` with Prettier + import sorting + Tailwind class sorting |
| `pnpm restart` | Nuclear reset: removes `node_modules`, `.next`, lockfile, reinstalls, and starts dev |

There are **no tests** configured in this repo (no Jest/Vitest/Playwright).

## Code style

- Prettier: `printWidth: 120`, `semi: true`, double quotes, trailing commas `es5`, LF line endings.
- Imports are auto-sorted by `@ianvs/prettier-plugin-sort-imports` in the order shown in `.prettierrc`.
- Tailwind classes are auto-sorted by `prettier-plugin-tailwindcss`.
- Prefer running `pnpm format` before committing; `pnpm lint` and `pnpm typecheck` are separate steps.

## Architecture

- **App entry:** `src/app/layout.tsx` wraps children in `src/providers/index.tsx`.
- **Providers order (outer → inner):** `StoreProvider` → `ThemeProvider` → `AuthInitiatorFromCookies` → `TokenInitiatorInStore` → `AlertProvider` → `TooltipProvider` → `Toaster`.
- **Path alias:** `@/*` resolves to `./src/*`.
- **Auth server actions:** `src/features/auth/actions.ts` (login, register, email OTP verify, Google login, logout, cookie helpers). Cookies are `httpOnly`, `secure`, `sameSite: lax`, 90 days.
- **API layer:** `src/redux/api.ts` defines the RTK Query base query, 2-minute timeout, bearer-token injection, and `/auth/refresh-token` re-auth flow. Inject feature endpoints (see `src/features/auth/api.ts`) instead of creating new APIs.
- **Route protection:** `src/proxy.ts` is the Next.js middleware. Route lists live in `src/routes/index.ts`.
  - Unauthenticated users hitting `/` or super-admin routes are redirected to `/auth/sign-in` with `callbackUrl`.
  - Authenticated but unverified users are redirected to `/auth/verify-email`.
  - `superAdminRoutes` require `UserRole.ADMIN` or `SUPER_ADMIN`.
  - Matcher in `src/proxy.ts` excludes API routes and Next.js static assets.

## Feature folder conventions

Mirror `src/features/auth/` for new features (e.g., `src/features/pricing/`):

```text
src/features/<feature>/
  actions.ts          # Next.js server actions (if needed)
  api.ts              # RTK Query endpoints injected into base api
  schemas.ts          # zod form/validation schemas
  slice.ts            # Redux slice + thunks
  types.ts            # Feature-specific types/enums
  components/         # Feature UI components
  hooks/              # Feature-specific React hooks
```

- **File names:** kebab-case — `pricing-form.tsx`, `use-pricing.tsx`, `pricing-card.tsx`.
- **API endpoints:** always inject into the base `api` from `src/redux/api.ts` using `api.injectEndpoints(...)`. Do not create separate `createApi` instances.
- **Redux wiring:** register the slice reducer in `src/redux/store.ts`. Add cache tags to `TagType` in `src/redux/types.ts` if the feature uses `providesTags` / `invalidatesTags`.
- **Shared code:** keep reusable cross-feature UI in `src/components/shared/`, generic helpers in `src/lib/utils.ts`, and cross-feature hooks in `src/hooks/`.

## Common gotchas

- Auth uses **HTTP-only cookies** on the server plus Redux persistence on the client; token init happens via `AuthInitiatorFromCookies` / `TokenInitiatorInStore`.
- `API_BASE_URL` comes from `NEXT_PUBLIC_SERVER_URL`; if it is missing at build/runtime, API calls will fail against `undefined`.
- `pnpm restart` is destructive (deletes lockfile). Use it only when deps are suspect.
- `tsconfig.tsbuildinfo` and `.next/` are gitignored but may need manual deletion if type-check or build behaves oddly.
