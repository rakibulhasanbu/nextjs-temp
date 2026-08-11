# dialog

2026-08-11. Pass 2 (overlays). Golden pair via URL fetch (style stays
`radix-nova`, so fetched `base-nova` JSON directly rather than
`shadcn add --overwrite`). Verdict: clean migration, no consumer breaks in
the wrapper's own logic; one downstream type fix in `command.tsx` (a non-Radix
cmdk consumer) caused by `Dialog.Root`'s widened `children` type.

## Changed

- `src/components/ui/dialog.tsx` — full rewrite from
  `https://ui.shadcn.com/r/styles/base-nova/dialog.json`. Classification:
  PRISTINE (byte-identical to `radix-nova` stock once normalized for the
  registry-internal alias `@/registry/radix-nova/lib/utils` -> `@/lib/utils`,
  `@/registry/radix-nova/ui/button` -> `@/components/ui/button`, and two
  preset-resolution artifacts: `IconPlaceholder` -> `XIcon` from
  `lucide-react` (iconLibrary: lucide, same pattern pass-1 documented for
  checkbox/accordion), and the `cn-font-heading` utility class dropped from
  `DialogTitle` — this project's preset has `fontHeading: "inherit"`, so the
  CLI's real resolution would drop that class the same way it resolves
  IconPlaceholder; confirmed `cn-font-heading` is not defined anywhere in
  `src/app/globals.css` or used by any other file, so this is a resolution
  artifact, not a real customization).
  - `Dialog.Root` / `Trigger` / `Portal` / `Close` — same shape, primitive
    swapped `radix-ui` -> `@base-ui/react/dialog`, prop types moved from
    `React.ComponentProps<typeof X>` to `DialogPrimitive.X.Props`.
  - `DialogOverlay`: `Overlay` -> `Backdrop`.
  - `DialogContent`: `Content` -> `Popup` (no Positioner — centered modal).
    Close button: `asChild` -> `render={<Button .../>}` with the icon +
    sr-only span passed as `DialogPrimitive.Close`'s own children (Base UI
    merges them onto the `render` element — verified against the fetched
    `base-nova` stock, which uses the exact same shape).
  - `DialogFooter`'s inline `Close` button: same `asChild` -> `render` swap.
  - `DialogTitle` / `DialogDescription`: prop types only, same classes
    (minus the resolved `cn-font-heading`).
- `src/components/ui/command.tsx:43-48` — `CommandDialog`'s prop type was
  `React.ComponentProps<typeof Dialog> & {...}`, which now inherits
  `Dialog.Root`'s widened `children?: ReactNode | PayloadChildRenderFunction`
  (a new Base UI capability, "payload-render children", see
  `overlays.md`). That type doesn't assign into `DialogContent`'s
  `children: ReactNode`-only slot, so `tsc` failed at
  `command.tsx(62,9)`. Fixed by narrowing: prop type is now
  `Omit<React.ComponentProps<typeof Dialog>, "children"> & { ...; children?: React.ReactNode }`.
  `command.tsx` itself is cmdk (never a migration target per the hard
  rules), but this one line broke compilation purely because it consumes the
  migrated `Dialog` wrapper's new prop shape — same "fix the specific broken
  call site only" treatment pass-1 applied to `alert-dialog.tsx` /
  `pagination.tsx` / `combobox.tsx`.

Leftover sweep: `grep -n "radix-ui\|@radix-ui" src/components/ui/dialog.tsx`
— clean, zero hits.

## Left alone

- `src/components/ui/command.tsx` — cmdk, not Radix; only the one type
  annotation above was touched (forced by Dialog's new prop shape), no
  cmdk-internal logic changed.
- `src/components/ui/sidebar.tsx`, `src/components/ui/alert-dialog.tsx`,
  `src/components/ui/sheet.tsx` etc. — separate components, covered in their
  own reports/passes.

## Behavior changes

- None observed for Dialog itself. Overlay/Popup transition classes
  (`data-open:animate-in` / `data-closed:animate-out`) carried over
  unchanged from the stock registry pair — both radix and base-nova dialog
  variants use the same animate-in/out utility classes here (unlike sheet,
  see `sheet.md`), so no visual delta expected.
- Base UI's `onOpenAutoFocus`/`onCloseAutoFocus`/`onEscapeKeyDown`/
  `onPointerDownOutside` are gone from `Dialog.Popup`; no consumer in this
  codebase used any of them (verified by grep across `src`), so nothing to
  restructure, but any future custom focus/dismiss handling must move to
  `Root onOpenChange`'s `eventDetails.reason` + `.cancel()`, or `Popup`'s
  `initialFocus`/`finalFocus` — see `overlays.md`.

## Verify by hand

- Open any `Dialog` consumer (e.g. `AlertProvider`'s confirm dialog via
  `Dialog`/`DialogContent` in `src/providers/AlertProvider.tsx`, or
  `CommandDialog` if wired to a command palette trigger) and confirm:
  1. Focus lands inside the dialog on open, returns to the trigger on close
     (focus return — flagged as a family-wide behavior to verify, no delta
     found here but worth a manual check since Base UI's focus model
     differs from Radix's).
  2. Escape key and outside-click both close it.
  3. The `X` close button and footer `Close` button both work and show the
     ghost/outline button styling correctly (confirms the `render` merge
     landed the icon/text as children correctly, not as a sibling).
