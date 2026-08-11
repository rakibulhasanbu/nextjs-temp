# project (pass 2 — overlays)

2026-08-11. Whole-project mode, pass 2 of N (overlay/positioner components,
in dependency order — all 6 depend only on the already-migrated `button`).
`components.json` style stays `radix-nova` — flips to `base-nova` only once
every remaining component across future passes is done, not after this pass.

## Scope

dialog, alert-dialog, sheet, popover, tooltip, hover-card — all 6 migrated.
See individual `.migration/<component>.md` reports for per-component detail.

## Rebase note (worktree was behind)

This worktree's branch was created before pass 1 landed on local `main`
(commits `0aec48e`, `030339a`, `1345bc8` — button/label/separator/badge/
avatar; skeleton/progress/switch/checkbox/toggle;
collapsible/accordion/scroll-area/slider/radio-group). Ran
`git rebase main` before starting so this pass builds on pass 1's actual
committed state instead of redoing or conflicting with it. Confirmed after
rebase: `.migration/*.md` for all 15 pass-1 components present, and
`grep -rl "radix-ui\|@radix-ui" src/components/ui/*.tsx` showed exactly the
15 remaining files pass-1's own `project.md` predicted (dialog,
alert-dialog, sheet, popover, tooltip, hover-card among them, plus
breadcrumb, dropdown-menu, item, menubar, navigation-menu, select, sidebar,
tabs, toggle-group).

## Preflight

- `npx shadcn@latest info --json`: style `radix-nova`, base color
  `neutral`, Tailwind v4, `iconLibrary: lucide`, pnpm package manager, `ui`
  alias `@/components/ui`. Matches the task's stated context and pass-1's
  preflight.
- `node_modules` was missing in this worktree (fresh worktree checkout) —
  ran `pnpm install` first (baseline install, not a migration change).
- Baseline `pnpm typecheck` (before any pass-2 edits, after rebase+install)
  reproduces the exact same pre-existing, unrelated error pass-1 documented:
  `src/components/custom-ui/CustomErrorOrEmpty.tsx(3,24): error TS2307:
  Cannot find module '@/assets/images/empty.png'`. Confirmed pre-existing
  again, not caused by this pass.
- `@base-ui/react` and `radix-ui@^1.6.2` (package.json range; `1.6.7`
  resolved) coexist; radix-ui was NOT removed — 9 other
  `src/components/ui/*.tsx` files still depend on it after this pass (see
  count below).

## Classification method

Fetched `https://ui.shadcn.com/r/styles/radix-nova/<component>.json` for
each of the 6 target components and diffed against the local file
(normalizing the registry-internal alias
`@/registry/radix-nova/lib/utils` -> `@/lib/utils`,
`@/registry/radix-nova/ui/button` -> `@/components/ui/button`, and
CRLF/LF). All 6 matched exactly (PRISTINE) once two resolution artifacts
were accounted for — same pattern pass-1 documented for checkbox/accordion:

1. `IconPlaceholder` (raw registry template placeholder for
   `dialog`/`sheet`'s close-button icon) -> `XIcon` from `lucide-react`
   (this project's resolved `iconLibrary: "lucide"`).
2. **New in this pass**: a `cn-font-heading` utility class appears on
   `DialogTitle`/`SheetTitle`/`AlertDialogTitle` in the raw registry JSON
   but not in any local file. Confirmed via `grep` that `cn-font-heading`
   is not defined in `src/app/globals.css` or referenced anywhere else in
   the project — this project's resolved preset has `fontHeading:
   "inherit"` (no distinct heading font configured), and the CLI's real
   resolution drops the class in that case the same way it resolves
   `IconPlaceholder` against `iconLibrary`. Treated as a resolution
   artifact, not a customization, and dropped in all 3 affected files to
   match what `shadcn add --overwrite` would have delivered if the style
   were already `base-nova`.

`alert-dialog.tsx` additionally differed in **formatting only**: it already
carried prettier's `semi: true` style (semicolons) because pass-1's
consumer sweep touched it for a `Button asChild -> render` fix, which is
one of the 4 files pass-1's `project.md` explicitly flagged as
non-migration touches that happened to pick up prettier formatting. This
pass's full-file rewrite reverts it to the same no-semicolon style as
every other file in this pass (and every other `ui/*.tsx` file in the
repo), consistent with pass-1's note that a repo-wide format pass is a
deliberate future decision, not something migrations should do
incidentally.

## Why URL-fetch instead of `shadcn add --overwrite`

Same reasoning as pass 1: `components.json`'s `style` stays `radix-nova`
until every remaining component is migrated, so `shadcn add --overwrite`
right now would re-deliver the *radix* variant. Fetched
`https://ui.shadcn.com/r/styles/base-nova/<component>.json` directly for
each of the 6 and wrote the (alias-fixed, icon/heading-resolved) content
straight to `src/components/ui/<component>.tsx`.

## Behavior-delta flags (per the task's explicit callouts for this family)

- **Dialog/Sheet focus return**: no delta found for `dialog.tsx` itself
  (no consumer used `onOpenAutoFocus`/`onCloseAutoFocus`). `alert-dialog.tsx`
  DOES have a real delta: Radix auto-focuses `Cancel` on open, Base UI
  focuses the first tabbable element instead — flagged in `alert-dialog.md`,
  not patched (no live consumer depends on it; the one file that uses these
  parts, `custom-alert-dialogue.tsx`, is unused dead code in this repo).
- **Popover Anchor**: confirmed no Base UI equivalent exists. Kept
  `PopoverAnchor` as an inert `<div>` passthrough (renders children, does
  nothing else) so any future import keeps compiling — flagged in
  `popover.md`, not silently reimplemented. Zero current consumers use it.
- **Tooltip delay feel**: `TooltipContent`'s `sideOffset` default shifted
  `0` (old, stock radix-nova) -> `4` (stock base-nova) since the local file
  was otherwise pristine — took the stock default rather than preserving
  the old value. `TooltipProvider`'s `delayDuration` -> `delay` rename is
  transparent (no consumer overrides it; both this app's Provider and
  every consumer leave delay at the wrapper's explicit `0`). HoverCard's
  default open delay also shifts `700ms` -> `600ms` (Base UI Trigger
  default) since neither the wrapper nor any consumer overrides it. All
  flagged in their respective `.md` files, none patched.
- **Sheet slide animation mechanism**: stock `base-nova` sheet swapped
  Radix's `animate-in`/`animate-out` keyframe utilities for Base UI's
  `data-starting-style`/`data-ending-style` transition-based hooks with
  explicit per-side translate values. Carried over verbatim from the
  registry pair (not introduced by this migration); flagged in `sheet.md`
  since there's no live `Sheet` consumer yet to visually confirm against.

## App-code sweep

Consumer break surface for this pass, swept via
`grep -rln "from \"@/components/ui/<dialog|alert-dialog|sheet|popover|tooltip|hover-card>\"" src`
plus a full-repo grep for every `consumer-props.md` token
(`onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`,
`onPointerDownOutside`, `onInteractOutside`, `disableHoverableContent`,
`openDelay`, `closeDelay`, `delayDuration`) and a final full-repo
`asChild` grep to confirm nothing outside this pass's scope was missed:

- `src/components/custom-ui/custom-form-date-picker.tsx:60`,
  `custom-form-date-range-picker.tsx:87`,
  `custom-form-search-select.tsx:63`, `custom-search-select.tsx:55` —
  `PopoverTrigger asChild` -> `render={<Button .../>}` with the
  icon/text content moved to be the trigger's own children (Base UI merges
  them onto the rendered element — verified against the stock `base-nova`
  dialog/sheet close-button pattern, which uses the identical shape).
  `custom-form-search-select.tsx` and `custom-search-select.tsx` also had
  `className="w-(--radix-popover-trigger-width)! p-0"` on their
  `PopoverContent` — renamed to `w-(--anchor-width)!` (the Radix CSS
  custom property doesn't exist on Base UI's Positioner; without this fix
  the dropdown width would have silently collapsed to content width
  instead of matching the trigger).
- `src/components/custom-ui/custom-tooltip.tsx:24` — its own
  pass-through `asChild?: boolean` prop into `TooltipTrigger` converted to
  a `render`/children ternary (`render` isn't a boolean toggle in Base UI).
  Dead code (zero consumers anywhere in `src`), fixed only to keep `tsc`
  green.
- `src/components/ui/sidebar.tsx:529` — `TooltipTrigger asChild` ->
  `render={button}`. `sidebar.tsx` itself is still fully Radix (out of
  scope this pass, deferred to a future pass) and was touched ONLY at this
  one call site because it consumes the now-migrated `Tooltip` wrapper —
  same "fix the specific broken call site only" treatment pass-1 applied
  to `alert-dialog.tsx`/`pagination.tsx`/`combobox.tsx`.
- `src/components/ui/command.tsx:43-48` — `CommandDialog`'s prop type
  inherited `Dialog.Root`'s widened `children?: ReactNode |
  PayloadChildRenderFunction` (a new Base UI capability), which didn't
  assign into `DialogContent`'s `children: ReactNode`-only slot. Narrowed
  the local prop type to `Omit<..., "children"> & { children?:
  React.ReactNode }`. `command.tsx` is cmdk (never a migration target, per
  the hard rules) — only this one type annotation was touched, no cmdk
  logic changed.

No other `consumer-props.md` tokens for this family (`onOpenAutoFocus`,
`onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`,
`onInteractOutside`, `disableHoverableContent`, `openDelay`, `closeDelay`,
`delayDuration`) appear anywhere in `src` outside the wrappers themselves —
confirmed via grep, zero hits.

## Left alone (explicitly out of scope)

- Not Radix, never touch: `command.tsx` (cmdk, touched only for the one
  forced type fix above), `drawer.tsx` (vaul), `sonner.tsx`,
  `input-otp.tsx`, `calendar.tsx` (react-day-picker), `chart.tsx`
  (recharts).
- Radix-based, deferred to a future pass: everything still importing
  `radix-ui` — see live count below.
- `src/components/custom-ui/custom-alert-dialogue.tsx` — consumes
  `ui/alert-dialog.tsx`'s Content/Header/Footer/Title/Description via
  plain `Button` (not `AlertDialogAction`/`Cancel`), already compiled
  clean with no changes needed. Also dead code (zero consumers).
- `src/components/shared/alert-dialogue.tsx` /
  `src/providers/AlertProvider.tsx` — consume `ui/dialog.tsx`, not
  `ui/alert-dialog.tsx`; compiled clean with no changes needed (no
  `asChild`, no changed-shape props in use).

## Final verification

- `pnpm typecheck` — clean (0 errors) after the fixes above; the one
  pre-existing baseline error (`CustomErrorOrEmpty.tsx` missing asset)
  reproduces identically to pass-1's baseline, confirmed not caused by
  this pass.
- `pnpm lint` — clean (0 errors, 0 warnings).
- `pnpm build` (Turbopack, Next 16.3.0) — succeeds: compiles, typechecks,
  generates all routes, no errors.

## Remaining radix-ui count

Derived from disk, not tracked: `grep -rl "radix-ui\|@radix-ui" src/components/ui/*.tsx`
after this pass returns exactly **9 files** still importing Radix directly:
`breadcrumb.tsx`, `dropdown-menu.tsx`, `item.tsx`, `menubar.tsx`,
`navigation-menu.tsx`, `select.tsx`, `sidebar.tsx`, `tabs.tsx`,
`toggle-group.tsx`.

Combined with pass 1 (15 migrated) and pass 2 (6 migrated), 21 of the 30
Radix-based `ui/*.tsx` wrappers identified across both passes are now on
Base UI. Trust the live grep over any narrative count in future passes.
