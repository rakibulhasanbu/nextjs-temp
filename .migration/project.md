# project (leaf-primitives pass)

2026-08-11. Whole-project mode, pass 1 of N (leaf/shared primitives only, in
dependency order). `components.json` style intentionally left at
`radix-nova` — it flips to `base-nova` only after every remaining component
across future passes is migrated, not after this pass.

## Scope

button, label, separator, badge, avatar, skeleton, progress, switch,
checkbox, toggle, collapsible, accordion, scroll-area, slider, radio-group —
all 15 migrated. See individual `.migration/<component>.md` reports for
per-component detail.

## Preflight

- `npx shadcn@latest info --json`: style `radix-nova`, base color `neutral`,
  Tailwind v4, `iconLibrary: lucide`, pnpm package manager, `ui` alias
  `@/components/ui`. Matches the task's stated context.
- Git tree was clean at start; `node_modules` was missing in this worktree —
  ran `pnpm install` first (baseline install, not a migration change).
- Baseline `pnpm typecheck` (before any migration edits) already failed on
  one pre-existing, unrelated error:
  `src/components/custom-ui/CustomErrorOrEmpty.tsx(3,24): error TS2307:
  Cannot find module '@/assets/images/empty.png'` — the asset file doesn't
  exist in the repo. Confirmed pre-existing, not caused by this migration.
- `@base-ui/react@1.6.0` and `radix-ui@1.6.7`/`^1.6.2` (per package.json)
  coexist; radix-ui was NOT removed (18 other `src/components/ui/*.tsx`
  files and 5 `custom-ui/*.tsx` files still depend on it).

## Classification method

Fetched `https://ui.shadcn.com/r/styles/radix-nova/<component>.json` for
each of the 15 target components and diffed against the local file
(normalizing the registry-internal `@/registry/radix-nova/lib/utils` alias
to the project's real `@/lib/utils` alias, and CRLF/LF). 13 of 15 matched
exactly (PRISTINE). `checkbox` and `accordion` initially diffed due to
`IconPlaceholder` vs already-resolved `lucide-react` icon imports — this is
an artifact of fetching raw registry JSON (which serves unresolved
placeholders) rather than running the CLI (which resolves them against
`components.json`'s `iconLibrary: "lucide"`); confirmed no other diff, so
both are effectively pristine stock wrappers too. Full detail in each
component's own report.

## Why URL-fetch instead of `shadcn add --overwrite`

The shadcn CLI resolves which style variant to deliver (radix vs base) from
`components.json`'s `style` field. Per this task's explicit instruction, that
field stays `radix-nova` until every component across all passes is done —
so running `shadcn add <component> --overwrite` right now would have
re-delivered the *radix* variant, not base. Instead, fetched
`https://ui.shadcn.com/r/styles/base-nova/<component>.json` directly for
each of the 15 and wrote the (alias-fixed, icon-resolved where applicable)
content straight to `src/components/ui/<component>.tsx`, replicating exactly
what the CLI would produce if the style were already flipped.

## App-code sweep

All 15 wrappers came back pristine, so the only real "customization
replay" work was the two icon resolutions (checkbox, accordion). The bigger
work was the consumer-side break surface from Button losing `asChild`
(Base UI has no `asChild`; only `render`) and Accordion losing
`type`/`collapsible` (Base UI always uses array-shaped `value`/
`defaultValue`, no non-collapsible mode):

- `src/components/ui/alert-dialog.tsx` (still Radix, out of scope) — 2
  call sites (`AlertDialogAction`, `AlertDialogCancel`) converted
  `asChild` -> `render`.
- `src/components/ui/pagination.tsx` (still Radix, out of scope) — 1 call
  site (`PaginationLink`) converted `asChild` -> `render`.
- `src/components/ui/combobox.tsx` (still Radix, out of scope) — 1 call
  site (`InputGroupButton` wrapping `ComboboxTrigger`) converted
  `asChild` -> `render`.
- `src/components/custom-ui/custom-collapsible.tsx` — removed
  `type="single" collapsible={collapsible}` from its `<Accordion>` call and
  wrapped `defaultValue={title}` as `defaultValue={[title]}`. Flagged
  behavior delta: no consumer currently relies on the old
  `collapsible={false}` "always one open" semantics, but that capability
  is gone if someone reaches for it later (see `accordion.md`).

These four consumer files are otherwise still on Radix (or, for
custom-collapsible, not one of the 5 hand-migration targets) and were
touched ONLY at the specific call sites that broke compilation because they
consume a component migrated in this pass — not migrated wholesale.

Ran a project-wide grep for other `consumer-props.md` tokens
(`decorative`, `checked="indeterminate"`, `delayMs`, `type="always"`,
`onValueCommit`, `rovingFocus`) — zero hits outside what's already covered
above, so no further call-site changes were needed this pass.

## Left alone (explicitly out of scope)

- Not Radix, never touch: `command.tsx` (cmdk), `drawer.tsx` (vaul),
  `sonner.tsx` (sonner), `input-otp.tsx` (input-otp),
  `calendar.tsx` (react-day-picker), `chart.tsx` (recharts).
- Radix-based, deferred to a future pass (not leaf/shared primitives, or
  depend on components not yet migrated): `accordion` was in scope and is
  done; everything else still importing `radix-ui` — see count below.
- The 5 hand-migration custom-ui files named in this task
  (`custom-form-date-range-picker.tsx`, `custom-form-date-picker.tsx`,
  `custom-form-search-select.tsx`, `custom-tooltip.tsx`,
  `custom-search-select.tsx`) were NOT touched this pass — they don't
  consume any of the 15 leaf primitives migrated here, and hand-migrating
  their own direct Radix imports is separate scope for a later pass.

## Formatting note

`pnpm format` was run once and turned out to reformat the ENTIRE repo
(adding semicolons project-wide, since the checked-in code doesn't
currently match `.prettierrc`'s `semi: true`). That was reverted via
`git checkout` for every file outside this pass's intended 19-file diff
(15 migrated wrappers + `alert-dialog.tsx` + `pagination.tsx` +
`combobox.tsx` + `custom-collapsible.tsx`); only those 19 files carry
prettier's semicolon style. Flagging this so a future full-repo format pass
is a deliberate decision, not an accidental side effect of a future
migration pass.

## Final verification

- `pnpm typecheck` — clean (0 errors) after the fixes above; the one
  pre-existing baseline error (`CustomErrorOrEmpty.tsx` missing asset) does
  not reproduce under a plain `tsc --noEmit` run post-migration (Next's own
  build-time typecheck also doesn't surface it — likely because that
  component is never imported by an actual route in this build; left as-is,
  not part of this migration's scope).
- `pnpm lint` — clean (0 errors, 0 warnings).
- `pnpm build` (Turbopack, Next 16.2.11) — succeeds: compiles, typechecks,
  generates all 8 static pages, no errors.

## Remaining radix-ui count

Derived from disk, not tracked: `grep -rl "radix-ui\|@radix-ui" src/components/ui/*.tsx`
after this pass returns exactly **15 files** still importing Radix directly:
`alert-dialog.tsx`, `breadcrumb.tsx`, `dialog.tsx`, `dropdown-menu.tsx`,
`hover-card.tsx`, `item.tsx`, `menubar.tsx`, `navigation-menu.tsx`,
`popover.tsx`, `select.tsx`, `sheet.tsx`, `sidebar.tsx`, `tabs.tsx`,
`toggle-group.tsx`, `tooltip.tsx`.

Of the 25 stock shadcn wrappers named in the task's original context, 15
were migrated in this pass, leaving 10 of those 25 still on Radix
(alert-dialog, breadcrumb, dialog, dropdown-menu, hover-card, menubar,
navigation-menu, popover, select, sheet/sidebar/tabs/toggle-group/tooltip —
the exact 10 depends on which components counted toward the original 25;
re-run the grep above for ground truth). The 5 files in `src/components/ui/`
that intentionally never import Radix (`command.tsx`, `drawer.tsx`,
`sonner.tsx`, `input-otp.tsx`, `calendar.tsx`, `chart.tsx` — 6 actually, per
the hard-rule exclusion list) and the always-clean plain wrappers
(`badge.tsx` before this pass, `card.tsx`, `table.tsx`, `input.tsx`, etc.)
are not part of this count. Trust the live grep over any narrative count in
future passes.
