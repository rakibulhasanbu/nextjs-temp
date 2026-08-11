# tooltip

2026-08-11. Pass 2 (overlays). Golden pair via URL fetch (`base-nova` JSON
fetched directly; style stays `radix-nova`). Verdict: clean migration; 2
consumer call sites fixed for `asChild` -> `render`.

## Changed

- `src/components/ui/tooltip.tsx` — full rewrite from
  `https://ui.shadcn.com/r/styles/base-nova/tooltip.json`. Classification:
  PRISTINE — byte-identical to `radix-nova` stock once the registry-internal
  alias is normalized.
  - `TooltipProvider`: prop renamed `delayDuration` -> `delay` (per
    `consumer-props.md`). No consumer in this codebase passes
    `delayDuration` explicitly (verified by grep), so this is a silent,
    safe rename at the wrapper level.
  - `Tooltip`/`TooltipTrigger` — primitive swap only.
  - `TooltipContent`: `Content` -> `Portal > Positioner > Popup`. `side`,
    `sideOffset`, `align`, `alignOffset` moved onto the new `Positioner`
    and explicitly forwarded (declared -> destructured -> forwarded, per
    the "Pick means forward" rule). `sideOffset` default changed from
    Radix's `0` to this wrapper's still-explicit `4` (the local file already
    had `sideOffset = 0` as its own default before migration; the
    `base-nova` stock wrapper defaults it to `4` — since the local file was
    otherwise pristine, took the stock default rather than preserving the
    old `0`, matching what a straight `shadcn add --overwrite` would
    deliver. FLAGGED as a small visual delta: tooltips will now sit 4px
    further from their trigger than before).
  - `--radix-tooltip-content-transform-origin` -> `--transform-origin`.
  - `TooltipPrimitive.Arrow` gained explicit per-side positioning classes
    (`data-[side=bottom]:top-1`, etc.) since Base UI's Arrow doesn't
    auto-position the way Radix's did — carried over verbatim from stock.

Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/tooltip.tsx`
— clean, zero hits.

## Consumer sweep (asChild -> render)

`grep -rln "from \"@/components/ui/tooltip\"" src` found 2 consumers using
`asChild`:

- `src/components/custom-ui/custom-tooltip.tsx:24` — this wrapper threads
  its own `asChild?: boolean` prop straight into `TooltipTrigger`'s
  `asChild`. Since Base UI's `render` isn't a boolean toggle (it's
  `ReactElement | function | undefined`), converted to:
  ```tsx
  <TooltipTrigger
      className="cursor-pointer"
      render={asChild ? (trigger as React.ReactElement) : undefined}
  >
      {asChild ? undefined : trigger}
  </TooltipTrigger>
  ```
  When `asChild` is true, `trigger` becomes the rendered element (props
  merged onto it, matching old Radix `asChild` semantics). When false,
  `trigger` is passed as ordinary children into the default trigger
  element, matching Radix's non-asChild default. NOTE: `CustomTooltip` has
  zero consumers anywhere in `src` today (verified by grep) — dead code,
  fixed only to keep `tsc` green, not exercised at runtime.
- `src/components/ui/sidebar.tsx:529` — `<TooltipTrigger asChild>{button}</TooltipTrigger>`
  -> `<TooltipTrigger render={button}></TooltipTrigger>`. `sidebar.tsx`
  itself is still fully on Radix (out of scope this pass) and was touched
  only at this one call site because it consumes the now-migrated
  `Tooltip` wrapper — same "fix the specific broken call site only"
  treatment pass-1 used for `alert-dialog.tsx`/`pagination.tsx`/
  `combobox.tsx`.

## Left alone

- `sidebar.tsx`'s own `asChild` props (its `SidebarMenuButton`,
  `SidebarMenuAction`, etc. — lines 394, 414, 491, 542, 650) use a
  hand-rolled `Slot.Root` idiom unrelated to `Tooltip`; not touched, that's
  `sidebar.tsx`'s own future migration scope.

## Behavior changes

- FLAGGED: `sideOffset` default changed `0` -> `4` (see above) — tooltips
  now render with a small gap instead of touching the trigger.
- FLAGGED (family-wide, not tooltip-specific behavior introduced here):
  `TooltipProvider`'s `skipDelayDuration` concept has no Base UI
  equivalent under that name; Base UI's `Provider` has `timeout` (default
  `400` vs Radix's `skipDelayDuration` default `300`) covering the "next
  tooltip opens instantly" window. This wrapper doesn't set either prop
  explicitly (both providers just pass through `delay`), so no consumer
  code needs a change, but delay-and-hover "feel" may shift slightly —
  flagged per the skill's explicit callout for this family, not patched.
- `disableHoverableContent` (Radix, was never used by this wrapper or any
  consumer) has no Provider-level Base UI equivalent; only exists per-Root
  as `disableHoverablePopup`. Not applicable here (nothing used it), noted
  for completeness.

## Verify by hand

- Hover over `SidebarMenuButton`s with a tooltip (in the sidebar, when
  collapsed) and confirm the tooltip still appears on the right side after
  a short delay, and that clicking still works (the `render={button}`
  swap didn't turn the button into a non-interactive wrapper).
- Check the delay "feel" — default trigger delay is now `600` (Base UI) vs
  the project's tooltip provider set `delayDuration={0}` originally, now
  `delay={0}` — same effectively-instant behavior at the Provider level,
  should feel unchanged in this app specifically since delay is explicitly
  zeroed.
- Confirm the tooltip arrow points at the trigger correctly on all 4 sides
  if any tooltip in the app uses a non-default `side`.
