# alert-dialog

2026-08-11. Pass 2 (overlays). Golden pair via URL fetch (`base-nova` JSON
fetched directly; style stays `radix-nova`). Verdict: clean migration, no
consumer breaks (the one consumer, `custom-alert-dialogue.tsx`, doesn't use
any of the props that changed shape).

## Changed

- `src/components/ui/alert-dialog.tsx` — full rewrite from
  `https://ui.shadcn.com/r/styles/base-nova/alert-dialog.json`.
  Classification: PRISTINE, once accounting for:
  - the registry-internal alias (`@/registry/radix-nova/lib/utils` ->
    `@/lib/utils`, `@/registry/radix-nova/ui/button` ->
    `@/components/ui/button`),
  - the `cn-font-heading` resolution artifact on `AlertDialogTitle` (same
    reasoning as `dialog.md`/`sheet.md` — not defined anywhere in the
    project, `fontHeading: "inherit"` in the resolved preset),
  - and formatting: the **pre-existing local file already had prettier's
    `semi: true` style** (semicolons, single-line destructured params)
    applied, left over from pass-1's consumer sweep (`project.md` notes
    this file was one of the 4 non-migrated-in-scope files pass-1 touched
    for a `Button asChild -> render` fix, and that touch pulled it under
    prettier's formatting). This migration's full-file rewrite reverts to
    the same no-semicolon style as every other freshly-migrated `ui/*.tsx`
    file in this pass (matching the surrounding un-formatted codebase, per
    pass-1's explicit note that a repo-wide format pass is a deliberate
    future decision, not an accidental side effect of a migration pass).
  - `Root`/`Trigger`/`Portal` — primitive swap only
    (`radix-ui` -> `@base-ui/react/alert-dialog`).
  - `AlertDialogOverlay`: `Overlay` -> `Backdrop`.
  - `AlertDialogContent`: `Content` -> `Popup` (no Positioner — centered
    modal, same as dialog).
  - `AlertDialogTitle`/`Description`/`Header`/`Footer`/`Media` — prop-type
    /class-only changes.
  - `AlertDialogAction`: **lost its Radix primitive entirely** — Base UI
    has no `Action` part (per `overlays.md`: "no Base UI part... wrapper
    renders a styled `<button>`; close after the action via controlled
    `open`"). The pristine `base-nova` stock reflects this: `AlertDialogAction`
    is now just `<Button data-slot="alert-dialog-action" {...props} />`
    with no dialog-close wiring baked in — callers are expected to close
    the dialog themselves in their `onClick` (e.g. via controlled `open`
    state), same as this project's own consumer already does (see below).
    This was ALREADY the case before migration too, in effect: pass-1's
    consumer sweep note documented that `AlertDialogAction`/`Cancel` had
    their Button usage's `asChild` already converted to `render` at the
    Radix-primitive level; this pass replaces the Radix primitive
    underneath that already-adjusted call shape.
  - `AlertDialogCancel`: `Cancel` -> `Close`, `asChild` -> `render` (this
    exact shape was already present locally before this migration touched
    the file, per pass-1's note — this migration keeps it, now backed by
    the real Base UI `Close` part instead of Radix's `Cancel`). Radix's
    "Cancel receives focus on open by default" behavior does NOT carry
    over automatically to Base UI (Base UI's Popup focuses the first
    tabbable element by default) — FLAGGED below, not patched, since no
    consumer currently relies on Cancel receiving initial focus.

Leftover sweep:
`grep -n "radix-ui\|@radix-ui" src/components/ui/alert-dialog.tsx` — clean,
zero hits.

## Left alone

- `src/components/custom-ui/custom-alert-dialogue.tsx` — the only consumer
  of `AlertDialogContent`/`Header`/`Footer`/`Title`/`Description`. Uses
  plain `Button` (not `AlertDialogAction`/`Cancel`) for its confirm/cancel
  actions with manual `closeDialog()` calls in `onClick` — already matches
  the "caller closes manually" pattern Base UI's `Action`-less design
  requires, so no changes needed. Also has zero consumers of its own
  anywhere in `src` (dead code) — verified compiling clean regardless.
- `src/components/shared/alert-dialogue.tsx` /
  `src/providers/AlertProvider.tsx` — these consume `ui/dialog.tsx`'s
  `Dialog`/`DialogContent`, NOT `ui/alert-dialog.tsx` — separate component,
  covered in `dialog.md`.

## Behavior changes

- FLAGGED: Radix's `AlertDialog.Content` auto-focuses `Cancel` on open;
  Base UI's `Popup` focuses the first tabbable element instead (no
  Radix-equivalent default). To restore the old behavior, a future consumer
  would need `AlertDialogContent`'s `Popup` to receive
  `initialFocus={cancelRef}` — not added here since no current consumer
  needs it (the only live-ish consumer path, `custom-alert-dialogue.tsx`,
  is unused dead code) and the skill's rule is to flag behavior deltas, not
  silently patch them speculatively.
- FLAGGED (inherited from dialog/AlertDialog family, not new here): no
  `onOpenAutoFocus`/`onCloseAutoFocus`/`onEscapeKeyDown` equivalents remain
  as props; would move to `Root onOpenChange` reasons / `Popup`
  `initialFocus`/`finalFocus` if ever needed.

## Verify by hand

- If/when `AlertDialogContents` (from `custom-alert-dialogue.tsx`) or a new
  `AlertDialog` consumer is wired up: confirm Escape and outside-click
  behave as expected (Base UI's `AlertDialog` is always modal and disables
  pointer dismissal by design — clicking outside should NOT close it,
  unlike a plain `Dialog`), the Cancel/Action buttons render with correct
  variant styling, and focus lands somewhere sensible on open.
