# select

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper, straight write of the base-nova golden with alias/icon
resolution; two live consumers needed a one-line `onValueChange` widen fix
outside `components/ui`.

## Changed

- `src/components/ui/select.tsx` — full rewrite. Classified PRISTINE against
  `https://ui.shadcn.com/r/styles/radix-nova/select.json`: only the standard
  `IconPlaceholder` -> resolved `lucide-react` icons
  (`ChevronDownIcon`/`CheckIcon`/`ChevronUpIcon`) and dropped
  `cn-menu-target`/`cn-menu-translucent` artifacts (confirmed zero `cn-*`
  hook usage anywhere in `src`, same as dropdown-menu). Fetched
  `https://ui.shadcn.com/r/styles/base-nova/select.json`, applied the same
  resolutions, wrote straight to the file. `Radix.Select` ->
  `@base-ui/react/select`; bare `const Select = SelectPrimitive.Root`
  re-export per `wrapper-shapes.md` (Root.Props is generic, sidesteps the
  usual `ComponentProps` pattern); `Content` split into
  `Portal > Positioner > Popup`; `Viewport` -> `List`; `ScrollUp/DownButton`
  -> `ScrollUp/DownArrow`; `Label` -> `GroupLabel`; radix `position`
  prop dropped entirely in favor of `alignItemWithTrigger` (default `true`)
  per the golden shape — this project's local file had no custom
  `position`-based translate classes to preserve (confirmed clean diff), so
  nothing was lost. Leftover sweep:
  `grep -n "radix-ui\|@radix-ui" src/components/ui/select.tsx` — zero hits.
- `src/components/custom-ui/custom-select.tsx:46` — `onValueChange={onChange}`
  -> `onValueChange={(value) => onChange(value ?? "")}`. Base UI's
  `onValueChange` signature widens to `(value: string | null, eventDetails) =>
  void` (`null` = no value / placeholder shown); the component's own
  `onChange: (value: string) => void` prop couldn't accept `null`, so the
  call site coerces `null` to `""` to preserve the existing string-only
  contract for its callers.
- `src/components/custom-ui/custom-pagination.tsx:155` — same fix:
  `onValueChange={handleLimitChange}` -> `onValueChange={(value) =>
  handleLimitChange(value ?? "")}` (`handleLimitChange: (limit: string) =>
  void`).

## Left alone

- `src/components/custom-ui/custom-form-select.tsx:51` —
  `onValueChange={field.onChange}` (react-hook-form `Controller` field
  setter) compiled clean with no change: `field.onChange` accepts `any`, so
  the widened `string | null` type passes through without a type error. Not
  touched.

## Behavior changes

- **Select anatomy**: `SelectValue` in Base UI renders the raw value string
  by default rather than the selected `Item`'s `ItemText` content (Radix
  behavior). None of the three consumers pass an `items` prop or format via
  `children`, and all three use plain string values equal to their labels
  (`custom-select.tsx`, `custom-form-select.tsx`) or numeric-string page
  sizes (`custom-pagination.tsx`), so the rendered text is unaffected in
  practice — flagged in case a future consumer's item `label` differs from
  its `value`.
- `position="popper"` / `"item-aligned"` is gone in favor of
  `alignItemWithTrigger` (default `true`, i.e. `item-aligned`-like).
  `grep -rn 'position=' src` outside `sonner`'s unrelated `Toaster
  position="top-right"` found zero Select consumers using the old prop, so
  no call-site fix was needed, only flagged for awareness.
- `collisionPadding` default changes `10` -> `5`, `arrowPadding` `0` -> `5`
  (stock registry defaults, not consumer-visible currently since no
  consumer sets these).

## Verify by hand

For each of the three consumers (`custom-select.tsx`,
`custom-form-select.tsx`, `custom-pagination.tsx` row-size picker): open the
select, confirm keyboard arrow navigation + typeahead work, confirm the
popup width matches the trigger (`w-(--anchor-width)`), confirm selecting an
item updates the displayed value and calls the consumer's `onChange`/
`field.onChange`/`handleLimitChange` with the right string, and confirm
`custom-pagination.tsx`'s `side="top"` popup still opens upward.
