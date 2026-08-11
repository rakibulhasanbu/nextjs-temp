# collapsible

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/collapsible.tsx` — classified PRISTINE. Replaced with
  the base-nova golden
  (`https://ui.shadcn.com/r/styles/base-nova/collapsible.json`), alias fixed
  to `@/lib/utils`. Now imports `Collapsible as CollapsiblePrimitive` from
  `@base-ui/react/collapsible`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/collapsible.tsx`
  — clean, no hits.

## Left alone

Nothing else related. No consumer in `src/` imports this `collapsible.tsx`
wrapper directly (the app's `CustomCollapsible` component is actually built
on the `accordion.tsx` wrapper, not this one — see `accordion.md`).

## Behavior changes

None observed.

## Verify by hand

- If/when a consumer starts using this wrapper: click the trigger and
  confirm the panel expands/collapses with the height animation intact.
