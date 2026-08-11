# project (pass 3 — menus/nav)

2026-08-11. Whole-project mode, pass 3 of N (menu family + navigation +
misc remaining wrappers, in dependency order — all depend only on the
already-migrated `button`/`tooltip`). `components.json` style stays
`radix-nova` — this was the LAST pass for the 25 stock `ui/*.tsx` wrappers;
the style flip to `base-nova` is a follow-up decision for the user, not
done automatically by this pass (see "Remaining radix-ui count" below).

## Scope

dropdown-menu, select, breadcrumb, item, menubar, navigation-menu, tabs,
toggle-group, sidebar — all 9 migrated. combobox — verified already fully
on Base UI (no Radix imports at all), closed out with its own report per
the task's instruction. See individual `.migration/<component>.md` reports
for per-component detail.

## Rebase note (worktree was behind, again)

Same staleness pattern passes 1 and 2 both hit: this worktree's branch was
created before pass 2 landed on local `main`. Ran `git rebase main` before
starting (first step, per the task instructions) — `git log --oneline
main..HEAD` was empty immediately after rebase (branch had zero commits of
its own yet) and `git merge-base --is-ancestor main HEAD` succeeded,
confirming a clean rebase onto pass 2's actual committed state before any
pass-3 edits began.

## Preflight

- `npx shadcn@latest info --json`: style `radix-nova`, base color
  `neutral`, Tailwind v4, `iconLibrary: lucide`, pnpm package manager, `ui`
  alias `@/components/ui`. Matches passes 1-2's preflight and the task's
  stated context.
- `node_modules` was missing in this fresh worktree checkout — ran `pnpm
  install` first (baseline, not a migration change).
- Baseline `pnpm typecheck` (after rebase + install, before any pass-3
  edits) reproduces the same single pre-existing, unrelated error passes
  1-2 documented: `src/components/custom-ui/CustomErrorOrEmpty.tsx(3,24):
  error TS2307: Cannot find module '@/assets/images/empty.png'`. Confirmed
  pre-existing, not caused by this pass. (Note: this error does NOT
  reproduce inside `pnpm build`'s TypeScript pass, since that file is
  outside the build's reachable module graph — `pnpm build` succeeds
  cleanly, see "Final verification" below.)
- `@base-ui/react@1.7.0` and `radix-ui@1.6.7` (resolved) coexisted at the
  start of this pass; radix-ui is NOT removed from `package.json` yet —
  removal is a follow-up step for whoever flips `components.json`'s style,
  not done in this pass per the task's explicit instruction not to touch
  that yet.

## Classification method

Fetched `https://ui.shadcn.com/r/styles/radix-nova/<component>.json` for
each of the 9 target components (plus `combobox` for verification) and
diffed against the local file, normalizing the same artifacts documented in
passes 1-2: registry-internal alias rewrites
(`@/registry/radix-nova/lib/utils` -> `@/lib/utils`,
`@/registry/radix-nova/ui/*` -> `@/components/ui/*`,
`@/registry/radix-nova/hooks/*` -> `@/hooks/*`), CRLF/LF, and
`IconPlaceholder` -> the project's resolved `lucide-react` icon (confirmed
`iconLibrary: "lucide"` again). One additional artifact confirmed again
this pass, consistent with passes 1-2's finding: this project has **zero**
`cn-*` companion-class hook usage anywhere (`grep -rn "cn-menu\|cn-popover\|
cn-tooltip\|cn-select" src` — zero hits), so every `cn-menu-target
cn-menu-translucent`/`cn-rtl-flip` class the raw registry JSON carries was
dropped as a resolution artifact, not a customization, in every affected
file (`dropdown-menu`, `select`, `breadcrumb`, `menubar`,
`navigation-menu`, `sidebar`).

All 9 target components classified PRISTINE — no real local customizations
found beyond the resolution artifacts above, EXCEPT one already-applied fix
that had to be identified and correctly carried forward rather than
duplicated: `sidebar.tsx`'s pass-2 `TooltipTrigger asChild` -> `render`
one-off fix (documented in pass 2's `project.md`) was present in the
pre-pass-3 file and is subsumed by this pass's full golden rewrite (the
base-nova golden's `SidebarMenuButton` already expresses the fixed shape
natively via `useRender`). `item.tsx` was specifically re-checked for local
customizations per the task's explicit callout and found byte-identical to
the golden (no customization at all).

`combobox.tsx` was NOT classified via the pristine/customized diff
methodology above, since it carries zero Radix imports to begin with (built
directly on Base UI's native `Combobox` primitive from `@base-ui/react`,
not composed from `popover.tsx`/`command.tsx` as a naive reading of "built
on top of" might suggest). Verified clean and closed out with its own
report; see `combobox.md`.

## Why URL-fetch instead of `shadcn add --overwrite`

Same reasoning as passes 1-2: `components.json`'s `style` stays
`radix-nova` (this pass was told explicitly not to flip it yet, even though
it is the last pass for the 25 stock wrappers — that decision belongs to
the user). Fetched `https://ui.shadcn.com/r/styles/base-nova/<component>.json`
directly for each of the 9 targets and wrote the (alias-fixed,
icon-resolved, `cn-*`-stripped) content straight to
`src/components/ui/<component>.tsx`.

## Behavior-delta flags (per the task's explicit callouts for this family)

- **Menu items not closing on click**: `DropdownMenuCheckboxItem`/
  `DropdownMenuRadioItem`/`MenubarCheckboxItem`/`MenubarRadioItem` now
  default `closeOnClick={false}` (Base UI default for these two item
  types), vs. Radix's close-on-select-unless-prevented default. No live
  consumer of either wrapper exists in this app; flagged in
  `dropdown-menu.md`/`menubar.md`, not patched.
- **NavigationMenu 50ms delay**: Root `delayDuration`(200ms Radix default)
  -> `delay`(50ms Base UI default); `skipDelayDuration` dropped with no
  equivalent. Flagged in `navigation-menu.md`, not patched.
- **Tabs manual activation default**: Base UI 1.7.0 defaults
  `List.activateOnFocus` to `false` (Radix defaulted to automatic
  activation). Per the skill's explicit rule and `wrapper-shapes.md`'s tabs
  note, the base-nova golden does NOT add `activateOnFocus` — matched
  exactly, flagged in `tabs.md`, not silently patched.
- **Select anatomy**: `SelectValue` renders the raw value string by default
  rather than the selected Item's `ItemText` content (no `items`/`children`
  formatter wired up by any of this app's 3 consumers, so no visible
  difference in practice — flagged in `select.md` for awareness).
  `position="popper"|"item-aligned"` dropped in favor of
  `alignItemWithTrigger`; zero consumers used the old prop.
- **ToggleGroup `rovingFocus={false}`**: no equivalent, roving focus always
  on in Base UI. No consumer used it; flagged in `toggle-group.md`.
- **NavigationMenu Indicator**: per the skill's hard-rule list ("Popover
  Anchor and NavigationMenu Indicator have no equivalent: inert passthrough
  + flag"), this was checked carefully against the ACTUAL installed
  `@base-ui/react@1.7.0` package rather than assumed inert — a real
  `NavigationMenuPrimitive.Icon` part does exist
  (`node_modules/@base-ui/react/navigation-menu/icon/`), and the base-nova
  golden registry repurposes it as a floating popup-caret indicator, not an
  inert stub. Kept the golden's real (compiling, rendering) implementation
  rather than hand-rolling a passthrough, but flagged clearly in
  `navigation-menu.md`: it does not reproduce Radix's sliding
  underline-tracks-the-active-trigger visual — there is no Base UI part
  that does.

## App-code sweep

This pass's task brief called out dropdown-menu/select/navigation-menu/tabs
as the components most likely to have consumer breakage, since they're
commonly used directly in app/feature code. Swept two ways: (1)
`grep -rln 'from "@/components/ui/<component>"' src` for each of the 9
targets plus `combobox`, across the ENTIRE `src` tree (not just
`components/`); (2) a full-repo `grep -rn "asChild"` to catch any
lingering boolean usage anywhere.

Result: **zero live consumers** of any of the 9 migrated wrappers (or
`combobox`) exist anywhere in `src` outside their own `ui/*.tsx` files —
this app has not yet built out menus, a select-driven form beyond the two
below, navigation, tabs, toggle groups, or a sidebar shell. The only
`asChild` hits anywhere in `src` are inside
`src/components/custom-ui/custom-tooltip.tsx` (its own pass-through prop,
already converted to a `render`/children ternary in pass 2, dead code, zero
consumers — not re-touched this pass).

Real consumer fixes needed (both for `select.tsx`'s `onValueChange`
signature widening to `(value: string | null, eventDetails) => void`,
since Base UI's `null` = "no value" has no Radix equivalent):

- `src/components/custom-ui/custom-select.tsx:46` —
  `onValueChange={onChange}` -> `onValueChange={(value) => onChange(value
  ?? "")}` (component's own `onChange: (value: string) => void` contract
  preserved by coercing `null` to `""`).
- `src/components/custom-ui/custom-pagination.tsx:155` — same fix for its
  row-size-picker `Select`, coercing into `handleLimitChange(limit: string)
  => void`.
- `src/components/custom-ui/custom-form-select.tsx:51` — checked, needed NO
  change: its `onValueChange={field.onChange}` (react-hook-form
  `Controller`) accepts `any`, so the widened type passes through without
  error.

No other `consumer-props.md` tokens for this family (`activationMode`,
`rovingFocus`, `loop`, `position=`, `viewport=`, `delayDuration`,
`skipDelayDuration`, `disableHoverableContent`) appear anywhere in `src`
outside the wrappers themselves — confirmed via grep, zero hits.

## Left alone (explicitly out of scope)

- Not Radix, never touch: `command.tsx` (cmdk), `drawer.tsx` (vaul),
  `sonner.tsx`, `input-otp.tsx`, `calendar.tsx` (react-day-picker),
  `chart.tsx` (recharts). Untouched this pass.
- `src/components/custom-ui/custom-tooltip.tsx` — dead code, zero
  consumers, already fixed in pass 2; not re-touched.
- `src/components/ui/popover.tsx`, `src/components/ui/command.tsx` — the
  task's framing suggested `combobox.tsx` was "built on top of" these; it
  is not (verified: zero imports of either). Left untouched, noted in
  `combobox.md`.

## Final verification

- `pnpm typecheck` — clean; the one pre-existing baseline error
  (`CustomErrorOrEmpty.tsx` missing asset) reproduces identically to passes
  1-2's baseline, confirmed not caused by this pass.
- `pnpm lint` — clean (0 errors, 0 warnings).
- `pnpm build` (Turbopack, Next 16.3.0) — succeeds: compiles, typechecks
  (this pass's TypeScript run inside `next build` does NOT hit the
  `CustomErrorOrEmpty.tsx` error, since that file sits outside the app's
  actual route/import graph), generates all routes, no errors.

## Remaining radix-ui count

Derived from disk, not tracked: `grep -rl "radix-ui\|@radix-ui"
src/components/ui/*.tsx` after this pass returns **zero files**. This was
the last pass for the 25 stock `ui/*.tsx` wrappers — every one of them is
now on Base UI. A full-repo sweep (`grep -rl "radix-ui\|@radix-ui" src`,
not just `components/ui`) also returns **zero files**: the "5 custom-ui
files with direct Radix imports" the task brief flagged as still pending a
future pass were not found with any direct `radix-ui`/`@radix-ui` import at
the time this pass ran — either they were already resolved as
consumer-sweep side effects of passes 1-2 (several `custom-ui/*.tsx` files
were touched for `asChild` -> `render` fixes in those passes, per their
`project.md` notes), or the count in the task brief was stale. Either way,
trust the live grep over any narrative count in future passes: `radix-ui`
and `@radix-ui/react-*` remain installed in `package.json` (not removed —
that's the user's call alongside the `components.json` style flip to
`base-nova`), but nothing in `src` imports them anymore.
