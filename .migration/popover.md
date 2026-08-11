# popover

2026-08-11. Pass 2 (overlays). Golden pair via URL fetch (`base-nova` JSON
fetched directly; style stays `radix-nova`). Verdict: clean migration;
`PopoverAnchor` has no Base UI equivalent (flagged, kept as an inert
passthrough per the skill's hard rule); 4 consumer call sites fixed for
`asChild` -> `render` and 2 for the `--radix-popover-trigger-width` CSS var
rename.

## Changed

- `src/components/ui/popover.tsx` — full rewrite from
  `https://ui.shadcn.com/r/styles/base-nova/popover.json`. Classification:
  PRISTINE — byte-identical to `radix-nova` stock once the registry-internal
  alias is normalized (`@/registry/radix-nova/lib/utils` -> `@/lib/utils`);
  no icon or heading-class usage in this file, so no resolution-artifact
  noise to account for.
  - `Root`/`Trigger` — primitive swap only (`radix-ui` ->
    `@base-ui/react/popover`), prop types `PopoverPrimitive.X.Props`.
  - `PopoverContent`: `Content` -> `Portal > Positioner > Popup`. `align`,
    `alignOffset`, `side`, `sideOffset` moved from Content onto the new
    `Positioner` — destructured and explicitly forwarded (the "Pick means
    forward" rule from `universal-patterns.md`), not left to fall through
    `...props` onto Popup. `--radix-popover-content-transform-origin` ->
    `--transform-origin` in the `origin-(...)` class.
  - `PopoverAnchor` — **no Base UI equivalent** (Base UI has no Anchor
    part; the replacement is passing an `anchor` prop to
    `Positioner` inside `PopoverContent`, which this wrapper doesn't
    surface). Per the skill's hard rule ("Popover Anchor... no equivalent:
    inert passthrough + flag"), kept as an inert `<div data-slot="popover-anchor">`
    passthrough so any future/legacy import of `PopoverAnchor` keeps
    compiling, but it does NOT anchor anything anymore. FLAGGED, not
    silently dropped or silently reimplemented. Verified via
    `grep -rn "PopoverAnchor" src` that zero consumers currently use it, so
    this is a forward-compat safety net, not an active behavior change.
  - `PopoverHeader`/`Title`/`Description` — plain divs / prop-type-only
    changes, no logic difference.

Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/popover.tsx`
— clean, zero hits.

## Consumer sweep (asChild -> render, plus the CSS var rename)

`grep -rln "from \"@/components/ui/popover\"" src` found 4 consumers, all
using `<PopoverTrigger asChild><Button ...>...</Button></PopoverTrigger>`:

- `src/components/custom-ui/custom-form-date-picker.tsx:60` — converted to
  `<PopoverTrigger render={<Button .../>}>` with the icon/text moved to be
  `PopoverTrigger`'s own children (merged onto the rendered Button by Base
  UI, same pattern the `base-nova` dialog/sheet stock wrappers use for their
  close buttons).
- `src/components/custom-ui/custom-form-date-range-picker.tsx:87` — same
  conversion.
- `src/components/custom-ui/custom-form-search-select.tsx:63` — same
  conversion. Also fixed `PopoverContent`'s
  `className="w-(--radix-popover-trigger-width)! p-0"` (line 86 originally)
  -> `w-(--anchor-width)!` — the Radix CSS custom property
  `--radix-popover-trigger-width` doesn't exist on Base UI's Positioner;
  the equivalent is `--anchor-width` (see `overlays.md`'s popover CSS
  variable table). Without this fix the dropdown width would have silently
  collapsed to its content width instead of matching the trigger.
- `src/components/custom-ui/custom-search-select.tsx:55` — same `asChild`
  conversion, same `--radix-popover-trigger-width` -> `--anchor-width` fix
  (line 73).

All 4 are hand-rolled `custom-ui` components (not shadcn wrappers), touched
only at the specific broken call sites — no other logic in these files was
changed.

## Left alone

- `src/components/ui/command.tsx`, `src/components/ui/sidebar.tsx`, and
  other still-Radix `ui/*.tsx` files do not import Popover — nothing else
  to sweep.

## Behavior changes

- FLAGGED: `PopoverAnchor` no longer anchors — see above. No active
  consumer today, so no visible regression, but flagging for whoever adds
  one later.
- Base UI's Positioner `collisionPadding`/`arrowPadding` default to `5`
  (was `0` on Radix); this wrapper doesn't set either explicitly, so the
  popover now gets a small default clearance from viewport edges it didn't
  have before. Minor, cosmetic, not patched (matches stock `base-nova`
  behavior).

## Verify by hand

- Open each of the 4 fixed consumers (date picker, date range picker,
  search-select form field, standalone search-select) and confirm:
  1. The trigger button still looks and behaves like a button (the
     `render` merge didn't break styling/disabled state).
  2. The popover content is still full trigger-width where the CSS var fix
     applies (the two search-select variants).
  3. Click-outside and Escape close the popover.
