# sidebar

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper (already carried pass 2's one-off `TooltipTrigger
asChild` -> `render` fix from before this pass, verified and correctly
superseded), full rewrite, zero live consumers.

## Changed

- `src/components/ui/sidebar.tsx` — full rewrite (largest file in this
  pass, 702 -> ~700 lines). Classified PRISTINE against
  `https://ui.shadcn.com/r/styles/radix-nova/sidebar.json`: diffed and
  found only three differences, all expected —
  1. `useIsMobile` hooks alias (`@/registry/radix-nova/hooks/use-mobile` ->
     `@/hooks/use-mobile`), the standard registry-internal alias fix.
  2. `IconPlaceholder` -> resolved `lucide-react` `PanelLeftIcon` (dropped
     `cn-rtl-flip`, no `cn-*` hooks used anywhere in this project).
  3. **Pass-2 leftover fix, confirmed present and correctly carried
     forward**: `.migration/project.md`'s pass-2 notes (line ~147) recorded
     that `sidebar.tsx:529` had one `TooltipTrigger asChild` ->
     `TooltipTrigger render={button}` fix applied to the one call site
     consuming the already-migrated `Tooltip` wrapper, while `sidebar.tsx`
     itself stayed on Radix. Confirmed via diff that this fix was present
     and intact before this pass's rewrite. It is superseded (not
     duplicated) by this pass: the base-nova golden's `SidebarMenuButton`
     restructures around `useRender`, and the equivalent line
     (`render: !tooltip ? render : <TooltipTrigger render={render} />`)
     already reflects the fixed shape natively, so no manual patch was
     needed this time — the golden write subsumes the earlier hand-fix.

  Fetched `https://ui.shadcn.com/r/styles/base-nova/sidebar.json`, applied
  the same three resolutions plus the standard registry-internal alias
  fixes (`@/registry/base-nova/hooks/use-mobile` -> `@/hooks/use-mobile`;
  `@/registry/base-nova/lib/utils` -> `@/lib/utils`;
  `@/registry/base-nova/ui/{button,input,separator,sheet,skeleton,tooltip}`
  -> `@/components/ui/{...}`, all six already migrated to Base UI in passes
  1-2), wrote straight to the file. Structural changes: `SidebarGroupLabel`/
  `SidebarGroupAction`/`SidebarMenuButton`/`SidebarMenuAction`/
  `SidebarMenuSubButton` all move from the `asChild` boolean + manual
  `Slot.Root : tag` ternary to `useRender` + `mergeProps` (same proven
  pattern as `badge.tsx`, `breadcrumb.tsx`, `item.tsx` in this codebase);
  `SidebarTrigger` migrates to the real `@base-ui/react/button`-backed
  `Button` wrapper (already migrated); the mobile `Sidebar` composes
  `Sheet`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetDescription`
  (already migrated in pass 2, `Overlay` -> `Backdrop`/`Content` -> `Popup`
  internally, transparent to this file). Leftover sweep:
  `grep -n "radix-ui\|@radix-ui" src/components/ui/sidebar.tsx` — zero
  hits.

## Left alone

None — single-file component. Its dependencies (`button`, `input`,
`separator`, `sheet`, `skeleton`, `tooltip`) were already migrated in
passes 1-2, not touched here.

## Behavior changes

- **`SidebarMenuButton`/`SidebarGroupLabel`/`SidebarGroupAction`/
  `SidebarMenuAction`/`SidebarMenuSubButton` `asChild` -> `render`**: same
  universal call-site signature change as `item.tsx`/`badge.tsx`. No
  current consumer of `sidebar.tsx` exists in this app (`grep -rln 'from
  "@/components/ui/sidebar"' src` returns nothing), so no call-site fix
  was needed — flagged for whenever a future consumer wires up an app
  sidebar.
- **Tooltip delay/anatomy deltas already documented in pass 2's
  `tooltip.md`** apply transitively here (`SidebarMenuButton`'s
  `tooltip` prop renders through the pass-2-migrated `Tooltip`/
  `TooltipContent`/`TooltipTrigger`); not re-flagged, see that report.

## Verify by hand

No live consumer exists yet. When a consumer wires up an actual sidebar:
confirm the desktop offcanvas/icon-collapse/inset variants render and
animate correctly, confirm the mobile breakpoint swaps to the `Sheet`
overlay, confirm `Cmd/Ctrl+B` toggles it, confirm `SidebarMenuButton`'s
`tooltip` prop shows a tooltip only when `state === "collapsed"` and not
on mobile, and confirm `render={<a href="...">}` on `SidebarMenuButton`/
`SidebarMenuSubButton` correctly merges the wrapper's classes onto the
link.
