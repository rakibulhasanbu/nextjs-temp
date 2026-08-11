# badge

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/badge.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/badge.json`),
  alias fixed to `@/lib/utils`. Badge was already a `Slot`-based component in
  the radix variant (uses `radix-ui`'s `Slot` for `asChild` support, not a
  dedicated Radix primitive); the base-nova variant uses Base UI's own
  `useRender` hook (`@base-ui/react/use-render`) to provide the same
  `render`-prop-based polymorphism. Public API changed from `asChild` to
  `render` on this component too.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/badge.tsx`
  — clean, no hits.

## Left alone

Nothing else related. Grepped `src/` for `<Badge` usages with `asChild` —
none found, so no consumer fix was required.

## Behavior changes

None observed; visuals (cva variants) are unchanged.

## Verify by hand

- Visually confirm badge variants render with correct colors/padding
  wherever used.
