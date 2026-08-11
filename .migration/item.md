# item

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper (checked carefully per the task's explicit callout that
`item.tsx` might carry local customizations — it does not), straight write,
zero live consumers.

## Changed

- `src/components/ui/item.tsx` — full rewrite. Classified PRISTINE: diffed
  against `https://ui.shadcn.com/r/styles/radix-nova/item.json` after alias
  normalization and the diff was byte-identical (no icon placeholders, no
  `cn-*` hooks in this component at all, no other customization). Fetched
  `https://ui.shadcn.com/r/styles/base-nova/item.json`, fixed the two
  registry-internal aliases (`@/registry/base-nova/lib/utils` ->
  `@/lib/utils`, `@/registry/base-nova/ui/separator` ->
  `@/components/ui/separator`, which now resolves to the already-migrated
  Base UI `Separator` from pass 1), wrote straight to the file. Only `Item`
  itself changes shape: `asChild` boolean + manual `Slot.Root : "div"`
  ternary -> `useRender` + `mergeProps` with `render` prop, following the
  exact same pattern already proven in this codebase by `badge.tsx` (pass
  1) and this pass's own `breadcrumb.tsx`. One behavioral note: the old
  hand-rolled version set `data-variant`/`data-size` directly on the
  rendered element; the new version passes `variant`/`size` through
  `useRender`'s `state` object instead (`state: { slot: "item", variant,
  size }`) — Base UI's `useRender` derives the `data-*` attributes from
  `state` automatically, same mechanism `badge.tsx` already relies on, so
  the rendered `data-slot`/`data-variant`/`data-size` attributes are
  unchanged in practice. `ItemGroup`/`ItemMedia`/`ItemContent`/
  `ItemTitle`/`ItemDescription`/`ItemActions`/`ItemHeader`/`ItemFooter`/
  `ItemSeparator` are all plain `<div>`/`<p>` wrappers around
  `@/components/ui/separator` — untouched beyond the import path fix.
  Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/item.tsx`
  — zero hits.

## Left alone

None — single-file component.

## Behavior changes

None functionally. `asChild` -> `render` is a call-site signature change
only (no current consumer: `grep -rln 'from "@/components/ui/item"' src`
returns nothing).

## Verify by hand

No live consumer exists yet to click-test. When a consumer is added:
confirm `Item render={<a href="..." />}` merges classes/props correctly,
confirm `data-slot`/`data-variant`/`data-size` attributes are present on the
rendered element (drives the `itemVariants` CSS selectors like
`group-data-[size=xs]/item:gap-0`), and confirm `ItemSeparator` (built on
the pass-1-migrated `Separator`) still renders a horizontal rule.
