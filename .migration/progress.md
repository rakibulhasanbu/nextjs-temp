# progress

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/progress.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/progress.json`),
  alias fixed to `@/lib/utils`. Now imports `Progress as ProgressPrimitive`
  from `@base-ui/react/progress` instead of `radix-ui`; Base UI's Progress
  anatomy (`Root`/`Track`/`Indicator`) matches Radix's shape closely so the
  wrapper's structure is unchanged.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/progress.tsx`
  — clean, no hits.

## Left alone

Nothing else related.

## Behavior changes

None observed. `value`/`max` props behave the same.

## Verify by hand

- Confirm a progress bar animates/fills to the correct percentage wherever
  used.
