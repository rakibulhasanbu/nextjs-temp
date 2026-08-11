# checkbox

2026-08-11. Strategy: golden pair, fetched by URL (base-nova), hand-resolved
icon. Verdict: clean.

## Changed

- `src/components/ui/checkbox.tsx` — diffed against the radix-nova golden
  and initially flagged CUSTOMIZED: the local file imports
  `CheckIcon` from `lucide-react` directly, while the raw radix-nova
  registry JSON serves an unresolved `<IconPlaceholder lucide="CheckIcon" .../>`
  (the shadcn CLI normally resolves `IconPlaceholder` to the project's
  configured `iconLibrary` — `lucide` per `components.json` — at `add` time;
  fetching the registry JSON directly does not run that resolution step).
  Confirmed this is registry-fetch artifact, not a real customization: the
  only substantive difference was the already-resolved icon.
  Since `components.json`'s style must stay `radix-nova` for this leaf-only
  pass (the CLI can't be used to fetch the base variant), fetched the
  base-nova golden by URL
  (`https://ui.shadcn.com/r/styles/base-nova/checkbox.json`), which also
  serves an unresolved `IconPlaceholder`. Hand-resolved it the same way the
  CLI would: replaced `<IconPlaceholder lucide="CheckIcon" .../>` with
  `<CheckIcon />` and `import { CheckIcon } from "lucide-react"`, matching
  what was already in the project's local file. Import alias fixed to
  `@/lib/utils`. Now imports `Checkbox as CheckboxPrimitive` from
  `@base-ui/react/checkbox`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/checkbox.tsx`
  — clean, no hits.

Consumer check: `src/components/custom-ui/custom-form-checkbox.tsx` uses
`checked`/`onCheckedChange` with a plain boolean value and single-arg
handler — no `checked="indeterminate"` string usage anywhere in `src/`
(grepped), so the `consumer-props.md` rule (`checked="indeterminate"` ->
separate `indeterminate` boolean prop) did not need to be applied.

## Left alone

Nothing else related.

## Behavior changes

None observed.

## Verify by hand

- Check/uncheck a checkbox (e.g. `CustomFormCheckbox` consumers) with mouse
  and keyboard (Tab + Space); confirm the check icon appears/disappears and
  `aria-checked`/focus-ring styling is correct.
