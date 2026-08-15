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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
