# toggle-group

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper, byte-identical diff, straight write, zero consumers.
Depends on `toggle.tsx`, already migrated to Base UI in pass 1.

## Changed

- `src/components/ui/toggle-group.tsx` — full rewrite. Classified PRISTINE:
  diffed against `https://ui.shadcn.com/r/styles/radix-nova/toggle-group.json`
  and the local file was byte-identical after alias normalization. Fetched
  `https://ui.shadcn.com/r/styles/base-nova/toggle-group.json`, fixed the
  two internal aliases (`@/registry/base-nova/lib/utils` -> `@/lib/utils`,
  `@/registry/base-nova/ui/toggle` -> `@/components/ui/toggle`, which now
  resolves to pass 1's already-migrated Base UI `Toggle`), wrote straight
  to the file. `Radix.ToggleGroup.Root` -> callable `ToggleGroup` (from
  `@base-ui/react/toggle-group`); `ToggleGroup.Item` -> the standalone
  callable `Toggle` primitive reused as a group item (Base UI's items ARE
  `Toggle`s, per `disclosure.md`'s toggle-group section — matches this
  project's already-migrated `toggle.tsx`). Leftover sweep:
  `grep -n "radix-ui\|@radix-ui" src/components/ui/toggle-group.tsx` — zero
  hits.

## Left alone

None — single-file component (its `toggle.tsx` dependency was already
migrated in pass 1, not touched here).

## Behavior changes

- **`rovingFocus={false}` has no equivalent** — Base UI's roving focus is
  always on, no opt-out. No current consumer of `ToggleGroup` exists
  (`grep -rln 'from "@/components/ui/toggle-group"' src` returns nothing)
  and the local wrapper never exposed `rovingFocus`, so nothing was lost.
  Flagged per `consumer-props.md` for awareness.
- `loop` (default `true`) renamed to `loopFocus` at the primitive level;
  not exposed as a wrapper prop on either side, no consumer impact.
- `type="single"|"multiple"` becomes the `multiple` boolean, and
  `value`/`defaultValue` are ALWAYS arrays now (even single-select mode) —
  same treatment as `accordion.tsx` from pass 1. No current consumer to fix.

## Verify by hand

No live consumer exists yet. When one is added: click through items in
single mode (only one active at a time), and in multiple mode (`multiple`
prop) confirm several can be active simultaneously; confirm keyboard arrow
navigation moves focus between items and Tab/Shift+Tab only stops once at
the group (roving focus).
