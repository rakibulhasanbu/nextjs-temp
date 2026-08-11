# accordion

2026-08-11. Strategy: golden pair, fetched by URL (base-nova), hand-resolved
icons. Verdict: clean, one flagged behavior delta in a consumer.

## Changed

- `src/components/ui/accordion.tsx` — diffed against the radix-nova golden
  and initially flagged CUSTOMIZED: same registry-fetch artifact as
  `checkbox.tsx` — the local file already has resolved `ChevronDownIcon` /
  `ChevronUpIcon` imports from `lucide-react`, while the raw registry JSON
  serves unresolved `<IconPlaceholder lucide="ChevronDownIcon" .../>` /
  `<IconPlaceholder lucide="ChevronUpIcon" .../>` (the shadcn CLI resolves
  these against `components.json`'s `iconLibrary: "lucide"` at `add` time;
  a raw JSON fetch doesn't run that step). Confirmed not a real
  customization. Fetched the base-nova golden by URL
  (`https://ui.shadcn.com/r/styles/base-nova/accordion.json`) and
  hand-resolved the same two `IconPlaceholder`s to `<ChevronDownIcon
  data-slot="accordion-trigger-icon" className="..." />` /
  `<ChevronUpIcon data-slot="accordion-trigger-icon" className="..." />`,
  matching what was already in the project. Import alias fixed to
  `@/lib/utils`. Now imports `Accordion as AccordionPrimitive` from
  `@base-ui/react/accordion`; `AccordionContent`'s inner div now targets
  Base UI's own `data-open`/`data-closed`/`data-ending-style`/
  `data-starting-style` state attributes and the
  `h-(--accordion-panel-height)` CSS var instead of Radix's
  `data-[state=open]` + `--radix-accordion-content-height`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/accordion.tsx`
  — clean, no hits.

Consumer fix (required to keep the build green — Accordion's `type`/
`collapsible` props were dropped and `value`/`defaultValue` are now always
arrays, per `consumer-props.md`):

- `src/components/custom-ui/custom-collapsible.tsx` — was passing
  `type="single" collapsible={collapsible} defaultValue={title}` (a bare
  string) to `<Accordion>`. This is a TS compile error under Base UI
  (`defaultValue` must be `string[]`). Removed `type` and `collapsible` (Base
  UI accordion defaults to single-open unless `multiple` is set) and wrapped
  `defaultValue` in an array: `defaultValue={[title]}`. The component's own
  `collapsible` prop (controlling `cursor-pointer` vs `cursor-default`
  styling on the trigger) is untouched — only its pass-through to
  `<Accordion>` was removed.

## Left alone

Nothing else related. `CustomCollapsible` itself is not currently imported
anywhere else in `src/` (grepped) — low blast radius for the behavior delta
below.

## Behavior changes

- FLAGGED: `custom-collapsible.tsx` previously passed `collapsible={false}`
  in some call shape to prevent the single open accordion item from being
  closed by re-clicking its trigger (Radix's `type="single" collapsible={false}`
  semantics). Base UI's Accordion has no equivalent "non-collapsible single"
  mode — there is no prop to keep an item permanently open. If any future
  consumer relies on "always one item open, can't collapse to zero," that
  behavior is now lost and would need a manual `value`/`onValueChange`
  workaround (re-force the value if it would become empty). Not silently
  patched; left as a known gap since there is currently no consumer
  exercising it.

## Verify by hand

- Expand/collapse an accordion item by clicking the trigger and via keyboard
  (Tab + Enter/Space); confirm the chevron icon flips and the panel
  height-animates open/closed smoothly.
- If `CustomCollapsible` is used with `collapsible={false}` in the future,
  manually verify whether the "can't fully collapse" behavior is actually
  needed and implement the `value` workaround if so.
