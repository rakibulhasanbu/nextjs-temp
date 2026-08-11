# slider

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/slider.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/slider.json`),
  alias fixed to `@/lib/utils`. Now imports `Slider as SliderPrimitive` from
  `@base-ui/react/slider`; anatomy (`Root`/`Control`/`Track`/`Indicator`/
  `Thumb`) restructured to match Base UI's shape (`Control` wraps
  `Track`+`Thumb`, matching the base-nova registry exactly).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/slider.tsx`
  — clean, no hits.

## Left alone

Nothing else related. No consumer in `src/` currently imports this wrapper
(grepped) — no call-site sweep needed for `onValueChange`/`onValueCommit`/
`inverted` this pass.

## Behavior changes

- Per `consumer-props.md`, if a future consumer uses `onValueCommit`, it
  must be renamed to `onValueCommitted`, `onValueChange` handlers gain an
  event-details 2nd argument, and Radix's `inverted` prop (for RTL/vertical
  flip) is removed entirely in Base UI with no direct equivalent — flagged
  for whoever wires up the first Slider consumer.

## Verify by hand

- Once a consumer exists: drag the thumb with mouse and adjust with
  keyboard arrows; confirm the value updates and the track fill matches.
