# Architecture

- Path alias: `@/*` → `./src/*`
- API layer: `redux/api.ts` — RTK Query base query, 2min timeout, bearer injection, `/auth/refresh` re-auth
- Route protection: `proxy.ts` (middleware), route lists in `routes/index.ts`
  - unauth on `/` or protected route → `/auth/sign-in?callbackUrl=`
  - auth but unverified → `/auth/verify-email`

## Feature folder (`src/features/<feature>/`)

```
actions.ts    server actions (if needed)
api.ts        RTK Query endpoints, injected into base api
schemas.ts    zod schemas
slice.ts      redux slice + thunks
types.ts      feature types/enums
components/   feature UI
hooks/        feature hooks
lib/          feature helpers
```

## Rules

- File names: kebab-case
- API endpoints: `api.injectEndpoints(...)` into base `api` (redux/api.ts) — never a separate `createApi`
- New slice → register in `redux/store.ts`; new cache tag → add to `TagType` in `redux/types.ts`
- Cross-feature UI → `components/shared/`; generic helpers → `lib/utils.ts`; cross-feature hooks → `hooks/`
