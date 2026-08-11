# menubar

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper, straight write; depends on the already-migrated
`dropdown-menu.tsx` from this same pass (dependency order respected — menu
items and content compose the public `DropdownMenu*` wrappers, matching
`menus.md`'s note that "everything not the root/checkbox/radio items
delegates to the Menu wrappers, radix Menubar.Menu -> Menu.Root").

## Changed

- `src/components/ui/menubar.tsx` — full rewrite. Classified PRISTINE:
  diffed against `https://ui.shadcn.com/r/styles/radix-nova/menubar.json`
  and found only the standard `IconPlaceholder` -> resolved `lucide-react`
  `CheckIcon` and dropped `cn-menu-target`/`cn-menu-translucent` companion
  classes (zero `cn-*` usage anywhere in this project). Fetched
  `https://ui.shadcn.com/r/styles/base-nova/menubar.json`, applied the same
  resolutions, fixed the internal alias imports of
  `@/registry/base-nova/ui/dropdown-menu` -> `@/components/ui/dropdown-menu`
  (this pass's already-migrated file), wrote straight to the file.
  `Radix.Menubar` -> `Menubar` (callable, from `@base-ui/react/menubar`) +
  reuses `Menu` (`@base-ui/react/menu`) for everything else: `MenubarMenu`
  IS `DropdownMenu` (`Menu.Root`), `MenubarTrigger`/`MenubarContent`/
  `MenubarItem`/`MenubarLabel`/`MenubarSeparator`/`MenubarShortcut`/
  `MenubarSub`/`MenubarSubTrigger`/`MenubarSubContent` all compose the
  public `DropdownMenu*` wrappers from `dropdown-menu.tsx` rather than
  reimplementing the Menu primitive; only `MenubarCheckboxItem`/
  `MenubarRadioItem` use `MenuPrimitive.CheckboxItem`/`RadioItem` directly
  (same as the golden). Radix `Menubar.Root`'s `value`/`defaultValue`/
  `onValueChange` (active-menu control) and `loop` are dropped per
  `menus.md` ("Menubar lacks the value/onValueChange system" — hard drop,
  no workaround); this project's local file never used them (confirmed by
  the clean diff), so nothing was lost. Leftover sweep:
  `grep -n "radix-ui\|@radix-ui" src/components/ui/menubar.tsx` — zero hits.

## Left alone

None — single-file component (its `dropdown-menu.tsx` dependency was
migrated earlier in this same pass, not "left alone").

## Behavior changes

- **Menubar active-menu control dropped**: Radix's `Menubar` `value`/
  `onValueChange` for controlling which menu is open is gone with no
  equivalent; control each menu's own `Menu.Root` `open`/`onOpenChange`
  instead. No current consumer of `Menubar` exists in this app, so flagged
  for future use, not patched.
- **CheckboxItem/RadioItem `closeOnClick` default**: same delta as
  `dropdown-menu.tsx` — Base UI defaults `closeOnClick={false}` on these two
  item types (Radix closed on select). Flagged.

## Verify by hand

No live consumer exists yet. When one is added: click a menu trigger to
open it, hover over sibling triggers to confirm the menu switches without a
second click (built-in Menubar hover-switching), verify submenu opens on
hover/arrow-right, and confirm checkbox/radio items reflect the
`closeOnClick={false}` default.
