# separator

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/separator.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/separator.json`),
  alias fixed to `@/lib/utils`. Now imports `Separator as SeparatorPrimitive`
  from `@base-ui/react/separator` instead of `radix-ui`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/separator.tsx`
  — clean, no hits.

## Left alone

Nothing else related.

## Behavior changes

- Per `consumer-props.md`, Radix's `decorative` prop is dropped in Base UI
  (Base UI's Separator is always `role="separator"` / `aria-orientation`
  driven, no decorative escape hatch). Grepped the whole `src/` tree for
  `decorative` — zero usages, so this is a no-op for this project, noted
  only for completeness.

## Verify by hand

- Visually confirm horizontal/vertical separators still render with the
  correct thin border line and orientation in any layout using them.
