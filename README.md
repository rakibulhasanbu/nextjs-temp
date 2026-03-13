# Next.js Auth Template

A production-ready Next.js template with App Router, shadcn/ui, Tailwind CSS v4, Redux Toolkit, and a pre-integrated authentication system.

## What is included

- Next.js 16 + React 19 (App Router)
- Tailwind CSS v4 + shadcn/ui component setup
- Redux Toolkit + RTK Query + redux-persist
- Server action based authentication helpers
- Route protection and role-based redirects with `proxy.ts`
- OTP email verification flow

## Authentication system (implemented)

This template already contains the core authentication infrastructure:

- **Sign up** via server action (`/auth/signup`) and token cookie storage
- **Sign in** via server action (`/auth/signin`) and token cookie storage
- **Email verification (OTP)** via `/auth/verify-signup-token`
- **Resend signup OTP** via `/auth/resend-signup-email/:email`
- **Token refresh flow** on `401` responses via `/auth/refresh-token`
- **Cookie + Redux state sync** (tokens and user data are initialized from cookies)
- **Protected route logic** using `proxy.ts` and route groups in `src/routes`
- **Role-based checks** for admin/super-admin route access

Current auth pages:

- `/auth/sign-up`
- `/auth/sign-in`
- `/auth/verify-email`
- `/auth/forgot-password` (UI scaffold)

## Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SERVER_URL=https://your-api-base-url
```

`NEXT_PUBLIC_SERVER_URL` is used as the API base URL for auth and user endpoints.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` - run development server
- `pnpm build` - build for production
- `pnpm start` - run production server
- `pnpm lint` - run ESLint
- `pnpm typecheck` - run TypeScript checks
- `pnpm format` - format TypeScript files

## Project structure

```text
src/
  app/
    auth/
      sign-in/
      sign-up/
      verify-email/
      forgot-password/
    globals.css
    layout.tsx
    page.tsx
  components/
    custom-ui/               # Reusable custom form and UI helpers
    shared/                  # Shared cross-feature components
    ui/                      # shadcn/ui components
  config/
    index.ts                 # App config (server URL, etc.)
  features/
    auth/
      actions.ts             # Server actions (sign in/up, verify, logout, cookie ops)
      api.ts                 # RTK Query auth/user endpoints
      schemas.ts             # zod form validation
      slice.ts               # Auth Redux state and thunks
      types.ts               # User/auth types
      components/            # Auth UI components and initializers
      hooks/                 # Auth-related hooks
  hooks/
    use-time-counter.ts      # OTP resend timer helper
  lib/
    utils.ts                 # Utility helpers
  providers/
    index.tsx                # App providers composition
    store-provider.tsx       # Redux provider + persistence gate
    theme-provider.tsx       # Theme provider
  redux/
    api.ts                   # RTK Query base query + token refresh
    hook.ts                  # Typed Redux hooks
    store.ts                 # Store setup
    storage.ts               # Persist storage
    types.ts                 # Shared Redux/API types
  routes/
    index.ts                 # Route groups used by proxy guards
  proxy.ts                   # Route auth/role protection middleware
```

## Notes

- Access and refresh tokens are stored in secure, HTTP-only cookies.
- The app reads cookie tokens on load and hydrates auth state into Redux.
- You can customize route behavior in `src/routes/index.ts` and `src/proxy.ts`.
