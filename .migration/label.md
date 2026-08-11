# label

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean,
no behavior changes.

## Changed

- `src/components/ui/label.tsx` — classified PRISTINE against the radix-nova
  golden (only the registry alias import differed). Replaced with the
  base-nova golden content (`https://ui.shadcn.com/r/styles/base-nova/label.json`),
  alias fixed to `@/lib/utils` by hand. Note: shadcn's own `label.tsx` in
  both the radix-nova and base-nova registries renders a plain native
  `<label>` element (Radix's `Label` primitive is itself just a styled
  `<label>`, and Base UI has no dedicated Label primitive — the skill's "no
  Base UI counterpart" rule applies here, but the wrapper was already just a
  passthrough `<label>` in both variants, so there was nothing to rewire).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/label.tsx`
  — clean, no hits (there never were any in this file).

## Left alone

Nothing else related.

## Behavior changes

None. Byte-for-byte the same runtime behavior (native `<label htmlFor>`).

## Verify by hand

- Click a form label and confirm focus moves to its associated input
  (checkbox/radio/switch/input) across the auth forms.
