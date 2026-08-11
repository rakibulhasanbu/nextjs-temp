# switch

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/switch.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/switch.json`),
  alias fixed to `@/lib/utils`. Now imports `Switch as SwitchPrimitive` from
  `@base-ui/react/switch`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/switch.tsx`
  — clean, no hits.

Consumer check: `src/components/custom-ui/custom-form-switch.tsx` uses
`checked`/`onCheckedChange` with a plain single-arg handler
(`onCheckedChange={field.onChange}`) — stays type-safe per the "Callback
signature rule" (Base UI's `onCheckedChange` gains an event-details 2nd
arg, but existing single-arg handlers remain valid). No change needed there.

## Left alone

Nothing else related.

## Behavior changes

None observed.

## Verify by hand

- Toggle a switch (e.g. in a settings/form UI) with mouse click and with
  keyboard (Tab + Space); confirm state and styling update correctly.
