# breadcrumb

2026-08-11. Pass 3 (menus/nav). Golden pair via URL fetch. Verdict:
pristine wrapper, straight write; not actually a menu-family primitive
(it's the `Slot`/`asChild` -> `useRender`/`render` pattern per
`universal-patterns.md`'s worked example), zero live consumers.

## Changed

- `src/components/ui/breadcrumb.tsx` — full rewrite. Classified PRISTINE:
  diffed against `https://ui.shadcn.com/r/styles/radix-nova/breadcrumb.json`
  and the only differences were the standard `IconPlaceholder` -> resolved
  `lucide-react` icons (`ChevronRightIcon`, `MoreHorizontalIcon`) and the
  dropped `cn-rtl-flip` companion class (zero `cn-*` hook usage anywhere in
  this project, confirmed by grep). Fetched
  `https://ui.shadcn.com/r/styles/base-nova/breadcrumb.json`, applied the
  same two resolutions, wrote straight to the file. `Slot` (`asChild`
  boolean) -> `useRender` + `mergeProps` on `BreadcrumbLink` only, following
  the exact worked example in `universal-patterns.md` (this is the
  non-button polymorphic pattern, not a menu-family primitive — Radix
  `Breadcrumb` was never a real primitive, just a `Slot` composition).
  Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/breadcrumb.tsx`
  — zero hits.

## Left alone

None — single-file component.

## Behavior changes

None. `BreadcrumbLink`'s `asChild` boolean prop is replaced by a `render`
prop (element or render function) per the universal `asChild` -> `render`
rule; this is a call-site signature change, not a runtime behavior change.
No current consumer exists (`grep -rln 'from "@/components/ui/breadcrumb"'
src` returns nothing) so no call-site fix was needed.

## Verify by hand

No live consumer exists yet to click-test. When a consumer is added: verify
`BreadcrumbLink render={<NextLink href="..." />}` renders the link
correctly with the wrapper's className merged on, and that
`BreadcrumbEllipsis`/`BreadcrumbSeparator` render their icons and stay
`aria-hidden`.
