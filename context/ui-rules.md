# UI Rules

Design assets = source of truth. Rules below are MUST unless noted.

## Components (src/components)

- Text: ui/text.tsx — never raw h1-p etc. variant=size, render=semantic el, tone/weight/align/transform/clamp composable
- Button: nav only → shared/link-button.tsx (LinkButton). async action → shared/loading-button.tsx (LoadingButton, auto spinner+disable via isLoading). sync in-page → ui/button.tsx. never raw <button>
- Forms: react-hook-form + zod; inputs from shared/form-*.tsx (input, select, switch, textarea, OTP-input, phone-input). Need another? ask first
- Dialogs: shared/responsive-dialog.tsx (ResponsiveDialog) — auto Dialog/Drawer by viewport. never raw Dialog for user-facing modal
- Alerts/confirms: hooks/use-alert.tsx (useAlert)
- Loading state (page/section): ui/skeleton.tsx (Skeleton), matches final content shape. never bare spinner for section-level load
- Tables: components/table/* — always use these, never hand-roll a `<table>`;
- Empty state: shadcn Empty (optional icon, CTA if next action exists)
- Missing a component you need → ask, don't hand-roll
- Same design/markup repeats 2+ times → extract to a component — ask first (name + location) before creating
- Prefer shadcn primitives over custom-built UI when one fits (skeleton shimmer, marquee, etc.)

## Tokens (globals.css @theme)

- Colors: bg, foreground, card, popover, primary(ink btn), secondary,
  muted, accent(#2563eb = links/active/focus/charts only), destructive,
  success, warning, border, input, ring, sidebar-*, chart-1..5
- Shadow: shadow-card, shadow-popover only
- Never: Tailwind color classes, hex in components, colors in tailwind.config

## Layout

- Page width: .content-width (globals.css)
- No position:fixed — normal flow
- Desktop matches reference exactly; responsive at mobile/tablet/laptop (stack cols, collapse sidebars) — every page and component, not just page shell

## Don'ts

- > 1 font weight per element
- > 2 nested border radii
- raw error strings to users → human-readable text
