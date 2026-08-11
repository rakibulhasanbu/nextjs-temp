# combobox

2026-08-11. Pass 3 (menus/nav). Verdict: already fully migrated, no changes
needed. Verified and closed out as its own item per the task's explicit
instruction, since it's one of the 25 stock `ui/*.tsx` files and had a
prior partial fix from pass 1.

## Changed

Nothing. `src/components/ui/combobox.tsx` already imports directly from
`@base-ui/react` (`import { Combobox as ComboboxPrimitive } from
"@base-ui/react"`) with zero Radix imports of any kind — it is not built
"on top of" `popover.tsx`/`command.tsx` internally the way a naive reading
of "compound component" might suggest; it only imports `Button`
(`@/components/ui/button`, already Base UI since pass 1) and `InputGroup*`
(`@/components/ui/input-group`, never Radix — a plain-div compound
component). `grep -n "radix-ui\|@radix-ui" src/components/ui/combobox.tsx`
— zero hits, confirmed before touching anything.

Diffed against `https://ui.shadcn.com/r/styles/base-nova/combobox.json`:
same 16 exported functions in the same order
(`Combobox`/`ComboboxValue`/`ComboboxTrigger`/`ComboboxClear`/
`ComboboxInput`/`ComboboxContent`/`ComboboxList`/`ComboboxItem`/
`ComboboxGroup`/`ComboboxLabel`/`ComboboxCollection`/`ComboboxEmpty`/
`ComboboxSeparator`/`ComboboxChips`/`ComboboxChip`/`ComboboxChipsInput`/
`useComboboxAnchor`), same structure per function. The only differences
were the standard registry-internal alias resolution
(`@/registry/base-nova/...` -> `@/lib/utils` /
`@/components/ui/button`/`input-group`) already applied, `IconPlaceholder`
already resolved to `lucide-react` (`ChevronDownIcon`/`XIcon`/`CheckIcon`),
and this file's pre-existing semicolon-terminated formatting (this single
file in `src/components/ui` uses semicolons throughout, unlike its
sibling wrappers — pre-existing project style from whenever combobox was
originally added, not something this migration pass introduced or should
"fix" unprompted).

Confirmed the one pass-1-documented fix (`ComboboxTrigger`'s `Button`
usage, `asChild` -> `render`) is present and correct: `ComboboxTrigger`
itself IS the `render` target passed into `InputGroupButton` at
`combobox.tsx:63` (`render={<ComboboxTrigger />}`), and `ComboboxClear`/
`ComboboxChip`'s `ChipRemove` both use `render={<InputGroupButton .../>}`/
`render={<Button .../>}` — no lingering `asChild` boolean usage anywhere
in the file (`grep -n "asChild" src/components/ui/combobox.tsx` — zero
hits).

## Left alone

`src/components/ui/popover.tsx` and `src/components/ui/command.tsx` —
despite the task's framing ("built on top of popover.tsx/command.tsx"),
this file does not actually import either. `popover.tsx` was already
migrated in pass 2; `command.tsx` is cmdk (never a migration target, per
the hard rules) and untouched.

## Behavior changes

None — no changes made. Whatever behavior deltas apply to Base UI's native
`Combobox` primitive (a Base-UI-only capability per `universal-patterns.md`
— "Base UI-only, NOT migration targets: ... Combobox") were already
present before this pass; there is no Radix Combobox this file was ever
migrated FROM.

## Verify by hand

No live consumer exists (`grep -rln 'from "@/components/ui/combobox"' src`
returns nothing). No manual QA needed this pass since nothing changed;
future consumers should verify typeahead filtering, the `Chips`
multi-select variant, and the `Clear`/`ChipRemove` buttons.
