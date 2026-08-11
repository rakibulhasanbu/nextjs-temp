# skeleton

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/skeleton.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/skeleton.json`),
  alias fixed to `@/lib/utils`. Skeleton was never Radix-based (plain `<div>`
  with a `cn()`-driven pulse animation class) in either variant, so this is a
  no-op content-wise beyond the import alias.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/skeleton.tsx`
  — clean, no hits (none expected).

## Left alone

Nothing else related.

## Behavior changes

None.

## Verify by hand

- Visually confirm skeleton loading placeholders still pulse/animate
  correctly wherever used.
