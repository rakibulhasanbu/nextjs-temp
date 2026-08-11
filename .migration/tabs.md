# tabs

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper, byte-identical diff, straight write, zero consumers.

## Changed

- `src/components/ui/tabs.tsx` — full rewrite. Classified PRISTINE: diffed
  against `https://ui.shadcn.com/r/styles/radix-nova/tabs.json` (alias
  normalized) and the local file was byte-identical — no icons, no local
  customization. Fetched
  `https://ui.shadcn.com/r/styles/base-nova/tabs.json`, fixed the one
  internal alias (`@/registry/base-nova/lib/utils` -> `@/lib/utils`), wrote
  straight to the file. `Root` unchanged; `List` unchanged (gains
  `data-variant`); `Trigger` -> `Tab`; `Content` -> `Panel`. Per
  `wrapper-shapes.md`'s explicit tabs note: the base registry does NOT add
  `activateOnFocus` and does not forward `orientation` beyond what the
  radix wrapper did — matched exactly, no opt-in added. Leftover sweep:
  `grep -n "radix-ui\|@radix-ui" src/components/ui/tabs.tsx` — zero hits.

## Left alone

None — single-file component.

## Behavior changes

- **Manual activation is now the default** (flagged per the task's
  explicit callout, not patched). Radix defaulted to
  `activationMode="automatic"` (arrow-key focus immediately switches the
  active tab). Base UI 1.7.0 defaults `List.activateOnFocus` to `false`
  (manual: arrow keys move focus, Enter/Space activates). No current
  consumer of `Tabs` exists in this app (`grep -rln 'from
  "@/components/ui/tabs"' src` returns nothing) and no
  `activationMode="manual"` prop was ever set locally, so there's nothing
  to strip — but a future consumer that relied on Radix's automatic
  activation will feel the difference. Per the skill's explicit rule, this
  is NOT auto-patched with `activateOnFocus`; a future consumer opts in
  deliberately if they want the old feel.

## Verify by hand

No live consumer exists yet. When one is added: click through tabs (should
work identically), then use arrow keys to move focus between tab triggers
and confirm whether the panel switches on focus (it will NOT, by default —
this is the flagged behavior delta) vs. on Enter/Space.
