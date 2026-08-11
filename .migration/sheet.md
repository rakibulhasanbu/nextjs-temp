# sheet

2026-08-11. Pass 2 (overlays). Golden pair via URL fetch (`base-nova` JSON
fetched directly; style stays `radix-nova`). Verdict: clean migration, no
consumer breaks (no file in the codebase imports `Sheet*` yet).

## Changed

- `src/components/ui/sheet.tsx` — full rewrite from
  `https://ui.shadcn.com/r/styles/base-nova/sheet.json`. Classification:
  PRISTINE, same two resolution artifacts as `dialog.tsx`
  (`IconPlaceholder` -> `XIcon` from `lucide-react`; `cn-font-heading`
  dropped from `SheetTitle` — not defined anywhere in the project, not a
  real customization).
  - Sheet wraps Base UI's `Dialog` primitive (`SheetPrimitive = Dialog`),
    same as the Radix original wrapped Radix's `Dialog`. `Overlay` ->
    `Backdrop`, `Content` -> `Popup`, positioned via `data-side` +
    Tailwind data-attribute selectors (no Positioner — sheet is a
    slide-in panel, not an anchored popup).
  - Close button: `asChild` -> `render={<Button .../>}`, icon + sr-only
    span passed as children (merged onto the Button by Base UI, same
    pattern as dialog.tsx).

Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/sheet.tsx`
— clean, zero hits.

## Left alone

- No consumer files reference `Sheet`/`SheetContent`/etc. anywhere in
  `src` (verified by grep) — nothing to sweep on the consumer side.

## Behavior changes

- FLAGGED: the slide-in/out animation mechanism changed. Radix's stock
  wrapper used `animate-in`/`animate-out` + `slide-in-from-*`/
  `slide-out-to-*` utility classes keyed off `data-[state=open/closed]`.
  The `base-nova` stock wrapper instead uses `data-starting-style` /
  `data-ending-style` (Base UI's native transition-based presence hooks)
  with explicit `translate-x`/`translate-y` values per side
  (e.g. `data-[side=left]:data-starting-style:translate-x-[-2.5rem]`).
  This is a real mechanism change carried over verbatim from the shadcn
  `base-nova` registry pair (not introduced by this migration) — the visual
  result should be very close (still a slide-in from the given side) but
  timing/easing curves come from CSS `transition` now instead of Tailwind's
  `animate-in`/`animate-out` keyframe utilities. Worth a visual check since
  there's currently no live consumer to eyeball it against.
- Overlay fade also switched from `data-open:animate-in data-open:fade-in-0`
  to a plain `transition-opacity` + `data-ending-style:opacity-0
  data-starting-style:opacity-0` pair. Same category of change as above.

## Verify by hand

- No live consumer exists yet in this codebase to click through. When a
  `Sheet` is wired up: open it from each of the 4 `side` values (top,
  right, bottom, left) and confirm the panel slides in/out smoothly from
  the correct edge, the backdrop fades, and the close button (`X` icon,
  top-right/top-left depending on side) works. Also confirm focus moves
  into the panel on open and returns to the trigger on close.
