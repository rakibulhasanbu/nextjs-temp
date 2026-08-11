# toggle

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/toggle.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/toggle.json`),
  alias fixed to `@/lib/utils`. Now imports `Toggle as TogglePrimitive` from
  `@base-ui/react/toggle`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/toggle.tsx`
  — clean, no hits.

## Left alone

- `src/components/ui/toggle-group.tsx` imports `toggleVariants` from this
  file for its cva classes but is itself still built on Radix's
  `ToggleGroupPrimitive` — untouched, deferred (not in this pass's scope;
  `pnpm typecheck` confirmed the shared `toggleVariants` import still works
  fine across the boundary).

## Behavior changes

None observed for the standalone Toggle component itself.

## Verify by hand

- Click a standalone toggle button (if any exist outside toggle-group) and
  confirm pressed state styling toggles correctly.
