# navigation-menu

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper, straight write; largest structural change in this pass
(Viewport model fully restructured), one explicitly-flagged gap
(`Indicator`).

## Changed

- `src/components/ui/navigation-menu.tsx` — full rewrite. Classified
  PRISTINE: diffed against
  `https://ui.shadcn.com/r/styles/radix-nova/navigation-menu.json` and found
  only the standard `IconPlaceholder` -> resolved `lucide-react`
  `ChevronDownIcon` (no `cn-*` hooks used in this component). Fetched
  `https://ui.shadcn.com/r/styles/base-nova/navigation-menu.json`, applied
  the resolution, wrote straight to the file. Structural changes per
  `menus.md`'s navigation-menu section: Radix's `Viewport` (rendered below
  `List`, toggled by a `viewport` boolean prop) is replaced entirely by
  `NavigationMenuPositioner` (`Portal > Positioner > Popup > Viewport`,
  real anchored collision-aware positioning that Radix nav-menu never had)
  — the `viewport` boolean prop and the old `NavigationMenuViewport`
  standalone export are both gone, matching the golden shape exactly (this
  project's local file had no customization of the viewport toggle to
  preserve). `Indicator` -> `Icon` (see Behavior changes below).
  Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/navigation-menu.tsx`
  — zero hits.

## Left alone

None — single-file component.

## Behavior changes

- **`NavigationMenu.Indicator` has no direct Base UI equivalent** (flagged
  per the task's explicit callout, not silently patched). Radix's
  `Indicator` tracked the active trigger's position/width along the `List`
  for a sliding underline marker. `menus.md` documents this as a genuine
  gap. The base-nova golden registry's actual resolution — verified for
  real against `node_modules/@base-ui/react/navigation-menu/icon/` (the
  `NavigationMenuPrimitive.Icon` part does exist and ship in the installed
  `@base-ui/react@1.7.0`) — repurposes `Icon` as a floating popup-caret
  indicator (`data-slot="navigation-menu-indicator"`, a small rotated
  square rendered under the open popup) rather than an inert passthrough.
  This is a REAL, functioning Base UI part, just a different visual/role
  than Radix's list-tracking underline: it marks "a submenu is open" near
  the popup, not "which trigger in the list is active." Kept the golden's
  real implementation (documented inline in the file) rather than
  hand-rolling an inert stub, since it compiles and renders correctly — but
  flagging clearly: if a future consumer relied on Radix's sliding
  underline-under-the-active-trigger visual, there is no way to reproduce
  it with this part.
- **50ms hover delay**: Root `delayDuration` (200ms Radix default) ->
  `delay` (50ms Base UI default); `skipDelayDuration` (300ms) is dropped
  with no equivalent (Base UI has `closeDelay`, a different concept — the
  window before a hover-closed menu forgets its "was recently open" state,
  not a skip-delay grace period). No current consumer overrides either
  prop, so the felt hover timing changes from Radix's 200ms open-delay to
  Base UI's 50ms. Flagged per the task's explicit callout, not patched.
- `align` moved from being forwarded ad hoc to a first-class `Pick`ed prop
  on `NavigationMenu` (forwarded to the internal `NavigationMenuPositioner`)
  — same value/default (`"start"`), just now explicitly typed.

## Verify by hand

No live consumer exists yet (`grep -rln 'from "@/components/ui/navigation-menu"'
src` returns nothing). When one is added: hover a trigger, confirm the
popup opens after the new ~50ms delay (feels snappier than Radix's 200ms),
confirm the popup follows the active trigger horizontally
(`data-activation-direction` driven slide), confirm `NavigationMenuLink`
`data-active` styling still applies to the current route, and specifically
check whether the app relies on the old sliding-underline `Indicator` — if
so, this is the component to redesign around the new floating-caret shape.
