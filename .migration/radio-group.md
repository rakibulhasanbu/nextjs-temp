# radio-group

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/radio-group.tsx` — classified PRISTINE. Replaced with
  the base-nova golden
  (`https://ui.shadcn.com/r/styles/base-nova/radio-group.json`), alias fixed
  to `@/lib/utils`. Now imports `RadioGroup as RadioGroupPrimitive` from
  `@base-ui/react/radio-group` and `Radio as RadioPrimitive` from
  `@base-ui/react/radio` (Base UI splits Radix's single `RadioGroupItem`
  into a group root + individual `Radio.Root`/`Radio.Indicator`, matching the
  base-nova registry's anatomy exactly).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/radio-group.tsx`
  — clean, no hits.

Consumer check: `src/components/custom-ui/custom-radio-group.tsx` and
`src/components/custom-ui/custom-radio-group-card.tsx` both use
`onValueChange`/`value`/`defaultValue` with plain string handlers — stays
type-safe per the callback-signature rule (Base UI's `onValueChange` gains
an event-details 2nd arg but single-arg handlers remain valid). `pnpm
typecheck` confirmed both files compile clean with no changes needed.

## Left alone

Nothing else related.

## Behavior changes

None observed.

## Verify by hand

- In `CustomRadioGroup`/`CustomRadioGroupCard` consumers: select a radio
  option with mouse click and with keyboard (Tab + Arrow keys); confirm only
  one option is selected at a time and the indicator dot renders correctly.
