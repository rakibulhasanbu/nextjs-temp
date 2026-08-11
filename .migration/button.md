# button

2026-08-11. Strategy: golden pair, fetched by URL (base-nova). Style stays
`radix-nova` in components.json for this leaf-only pass, so the shadcn CLI
`add --overwrite` could not be used (it resolves the target variant from
`components.json`'s style field and would have delivered the radix variant
again). Verdict: migrated to the real `@base-ui/react/button` primitive,
clean.

## Changed

- `src/components/ui/button.tsx` — classified PRISTINE (only diff vs the
  radix-nova golden was the registry-internal `@/registry/radix-nova/lib/utils`
  import alias, which the shadcn CLI always resolves to the project's real
  alias `@/lib/utils`). Replaced with the base-nova golden content fetched
  from `https://ui.shadcn.com/r/styles/base-nova/button.json`, with the same
  alias fix applied by hand. Now imports `Button as ButtonPrimitive` from
  `@base-ui/react/button` instead of `Slot`/`radix-ui`. This is the real Base
  UI Button primitive, not a hand-rolled `useRender` wrapper, per the skill's
  hard rule. `buttonVariants` cva config is byte-identical to before.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/components/ui/button.tsx`
  — clean, no hits.

Consumer break surface (Button lost `asChild`, Base UI uses `render`
instead) required fixing 3 call sites so the project stays buildable, even
though the parent components themselves are still on Radix and out of scope
for this pass:

- `src/components/ui/alert-dialog.tsx` — `AlertDialogAction`/`AlertDialogCancel`
  used `<Button asChild><AlertDialogPrimitive.Action .../></Button>`. Rewired
  to `<Button variant={...} size={...} render={<AlertDialogPrimitive.Action .../>} />`
  per the universal `asChild` -> `render` rule. `alert-dialog.tsx` itself
  remains on `radix-ui` (AlertDialogPrimitive) — untouched, deferred to the
  overlays pass.
- `src/components/ui/pagination.tsx` — `PaginationLink` had the same
  `asChild`-wrapped `<a>` pattern; converted to `render={<a .../>}` the same
  way.
- `src/components/ui/input-group.tsx` (`InputGroupButton`) forwards
  `...props` straight onto `Button`, so no code change was needed there —
  but its consumer `src/components/ui/combobox.tsx` passed `asChild` +
  `<ComboboxTrigger />` as a child to `InputGroupButton`; converted to
  `render={<ComboboxTrigger />}`.

## Left alone

- `src/components/ui/sheet.tsx`, `sidebar.tsx`, `select.tsx`, `item.tsx`,
  `dialog.tsx`, `breadcrumb.tsx` — these also use `asChild`, but on their own
  still-Radix primitives (Sheet/Select/Dialog/etc.), not on `Button`;
  confirmed via a clean `pnpm typecheck` that none of them pass `asChild` to
  the migrated `Button`. Left untouched — in scope for a future pass.

## Behavior changes

None observed. Base UI's `Button` renders a native `<button>` by default,
same as the Radix `Slot`-based wrapper did.

## Verify by hand

- Click every button variant (default/outline/secondary/ghost/destructive/link)
  and size on the homepage/auth forms; confirm hover/active/focus-visible
  ring styling is unchanged.
- Tab to a button and press Space/Enter; confirm it activates.
- Confirm `AlertDialogAction`/`AlertDialogCancel` and pagination links (both
  now using `render`) still render as the correct underlying element
  (`<button>` inside the dialog, `<a>` for pagination) and are still
  clickable/keyboard-activatable.
