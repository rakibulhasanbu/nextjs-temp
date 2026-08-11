# dropdown-menu

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch (style stays
`radix-nova`; fetched `base-nova` directly rather than `shadcn add
--overwrite`, same reasoning as passes 1-2). Verdict: pristine wrapper,
straight write of the base-nova golden with alias/icon resolution — no
local customizations to replay, no live consumers yet, no consumer sweep
breaks.

## Changed

- `src/components/ui/dropdown-menu.tsx` — full rewrite. Classified PRISTINE:
  diffed the local file against
  `https://ui.shadcn.com/r/styles/radix-nova/dropdown-menu.json` and the only
  differences were the two known resolution artifacts documented in passes
  1-2 (`IconPlaceholder` -> resolved `lucide-react` icons `CheckIcon` /
  `ChevronRightIcon`; the registry's `cn-menu-target cn-menu-translucent`
  companion classes dropped, since `grep -rn "cn-menu\|cn-popover\|cn-tooltip\|cn-select" src`
  returns zero hits anywhere in this project — confirmed no cn-* hook usage
  exists, consistent with prior passes' "plain-Tailwind project" finding).
  Fetched `https://ui.shadcn.com/r/styles/base-nova/dropdown-menu.json`,
  applied the same two resolutions (alias `@/registry/base-nova/lib/utils`
  -> `@/lib/utils`; `IconPlaceholder` -> `CheckIcon`/`ChevronRightIcon`;
  dropped `cn-menu-target`/`cn-menu-translucent`/`cn-rtl-flip`), wrote the
  result straight to the file. `Radix.DropdownMenu` -> `Menu` from
  `@base-ui/react/menu`; `Content` -> `Portal > Positioner > Popup`;
  `Label` -> `GroupLabel`; `Sub`/`SubTrigger` -> `SubmenuRoot`/
  `SubmenuTrigger`; `ItemIndicator` -> `CheckboxItemIndicator`/
  `RadioItemIndicator`; `SubContent` composes the public `DropdownMenuContent`
  wrapper (matches `wrapper-shapes.md`'s documented dropdown-menu SubContent
  shape: `align="start" alignOffset={-3} side="right" sideOffset={0}`, full
  translucent class list duplicated rather than composed minimally).
  Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/dropdown-menu.tsx`
  — zero hits.

## Left alone

None — single-file component, no other files touched for this component.

## Behavior changes

- **Menu items closing on click**: `DropdownMenuCheckboxItem` /
  `DropdownMenuRadioItem` now default `closeOnClick={false}` (Base UI
  default for these two item types), whereas Radix closed the menu on
  select unless `event.preventDefault()` was called in `onSelect`. No
  current consumer of `DropdownMenu` exists in this app (`grep -rln
  "DropdownMenu" src` outside `ui/dropdown-menu.tsx` returns nothing), so
  this is flagged for future consumers, not patched — add `closeOnClick`
  explicitly only if a future usage needs Radix parity.
- `onSelect(event) => preventDefault()` pattern (keep menu open) is gone;
  future consumers must use `onClick` + `closeOnClick={false}` instead.

## Verify by hand

No live consumer exists yet to click-test. When a consumer is added: open
the menu via trigger click, verify arrow-key navigation + typeahead,
confirm `Escape` and outside-click close it, confirm submenu opens on
hover/arrow-right and its position aligns (`align="start" alignOffset={-3}
side="right"`), and confirm checkbox/radio items reflect the new
`closeOnClick={false}` default (menu stays open after toggling).
