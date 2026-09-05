import type { RowData } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableColumnDef } from "@/components/table/features";

/**
 * Checkbox column for row selection. Prepend it to the `columns` array and
 * turn on `enableRowSelection` in `useDataTable`/`DataTableProvider`:
 *
 * ```tsx
 * const columns = [createSelectionColumn<User>(), ...otherColumns];
 * <DataTableProvider data={users} columns={columns} enableRowSelection>
 * ```
 *
 * The header checkbox only selects/deselects the current page (matches
 * `DataTablePagination`'s page-scoped rows); pair with `DataTableBulkActionsBar`
 * to read/act on the full cross-page selection via `getSelectedRowModel()`.
 */
export const createSelectionColumn = <TData extends RowData>(): DataTableColumnDef<TData> => ({
  id: "select",
  enableSorting: false,
  enableHiding: false,
  enableGlobalFilter: false,
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
      onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      aria-label="Select all rows on this page"
      onClick={(event) => event.stopPropagation()}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked) => row.toggleSelected(checked)}
      aria-label="Select row"
      onClick={(event) => event.stopPropagation()}
    />
  ),
});
