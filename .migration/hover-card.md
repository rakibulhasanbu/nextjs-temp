# hover-card

2026-08-11. Pass 2 (overlays). Golden pair via URL fetch (`base-nova` JSON
fetched directly; style stays `radix-nova`). Verdict: clean migration, no
consumer breaks (no file in the codebase imports `HoverCard*` yet).

## Changed

- `src/components/ui/hover-card.tsx` — full rewrite from
  `https://ui.shadcn.com/r/styles/base-nova/hover-card.json`.
  Classification: PRISTINE — byte-identical to `radix-nova` stock once the
  registry-internal alias is normalized.
  - Underlying primitive renamed: Radix `HoverCard` -> Base UI
    `PreviewCard` (`@base-ui/react/preview-card`). Public wrapper names
    stay `HoverCard`/`HoverCardTrigger`/`HoverCardContent` per
    `wrapper-shapes.md` convention — only the internal
    `PreviewCardPrimitive` import/alias changed.
  - `HoverCardContent`: `Content` -> `Portal > Positioner > Popup`. `side`,
    `sideOffset`, `align`, `alignOffset` moved onto `Positioner` and
    explicitly forwarded. `--radix-hover-card-content-transform-origin` ->
    `--transform-origin`.
  - Delays (`openDelay`/`closeDelay`) were never exposed by this wrapper's
    `Root` (no explicit props set), so no delay-prop rename was needed
    here — they still default correctly at the primitive level (Base UI
    moves them to `Trigger.delay`/`closeDelay`, defaults `600`/`300` vs
    Radix `700`/`300`); flagged as a minor timing delta below since no
    consumer overrides them either way.

Leftover sweep:
`grep -n "radix-ui\|@radix-ui" src/components/ui/hover-card.tsx` — clean,
zero hits.

## Left alone

- No consumer files reference `HoverCard`/`HoverCardTrigger`/
  `HoverCardContent` anywhere in `src` (verified by grep) — nothing to
  sweep on the consumer side.

## Behavior changes

- FLAGGED: default open delay shifts `700ms` (Radix) -> `600ms` (Base UI
  Trigger default), since neither this wrapper nor any consumer overrides
  it. Minor, not patched (matches stock `base-nova`).

## Verify by hand

- No live consumer exists yet in this codebase to click through. When a
  `HoverCard` is wired up: hover the trigger and confirm the card appears
  after roughly 0.6s, positions correctly relative to the trigger on all
  sides, and dismisses on mouse-out / focus-out / Escape.
