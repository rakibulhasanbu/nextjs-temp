# avatar

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Verdict: clean.

## Changed

- `src/components/ui/avatar.tsx` — classified PRISTINE. Replaced with the
  base-nova golden (`https://ui.shadcn.com/r/styles/base-nova/avatar.json`),
  alias fixed to `@/lib/utils`. Now imports `Avatar as AvatarPrimitive` from
  `@base-ui/react/avatar`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/avatar.tsx`
  — clean, no hits.

## Left alone

Nothing else related. No consumer in `src/` currently uses `Avatar.Image` with
a `delayMs` prop (checked via grep), so the `delayMs` -> `delay` rename from
`consumer-props.md` did not need to be applied anywhere.

## Behavior changes

None observed.

## Verify by hand

- Confirm avatar image loads and the fallback initials/icon show correctly
  when the image is missing or slow to load, anywhere Avatar is used.
