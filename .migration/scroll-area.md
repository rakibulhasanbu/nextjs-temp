# scroll-area

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/scroll-area.tsx` — classified PRISTINE. Replaced with
  the base-nova golden
  (`https://ui.shadcn.com/r/styles/base-nova/scroll-area.json`), alias fixed
  to `@/lib/utils`. Now imports `ScrollArea as ScrollAreaPrimitive` from
  `@base-ui/react/scroll-area`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/scroll-area.tsx`
  — clean, no hits.

## Left alone

Nothing else related.

## Behavior changes

- Per `consumer-props.md`, Radix's `type="always"|"scroll"|...` prop on
  ScrollArea is dropped in Base UI (no equivalent auto-hide-mode control).
  Grepped `src/` for a `type=` prop passed to any ScrollArea usage — none
  found, so this is a no-op for this project.

## Verify by hand

- Scroll content inside any ScrollArea-wrapped container (mouse wheel,
  trackpad, and dragging the scrollbar thumb) and confirm the custom
  scrollbar track/thumb still render and track scroll position correctly.
