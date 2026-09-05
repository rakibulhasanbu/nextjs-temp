"use client";

import { useTable, type RowData } from "@tanstack/react-table";

import { dataTableFeatures, type DataTableColumnDef } from "@/components/table/features";
import { useDataTableUrlState } from "@/components/table/hooks/use-data-table-url-state";

const EMPTY_DATA: never[] = [];

export type UseDataTableOptions<TData extends RowData> = {
  data: TData[] | undefined;
  columns: DataTableColumnDef<TData>[];
  /** Query param that holds the global search text. Defaults to `search`. */
  searchParamKey?: string;
  /** Page size used when the `perPage` param is absent. Defaults to 20. */
  defaultPageSize?: number;
  getRowId?: (row: TData, index: number) => string;
  enableMultiSort?: boolean;
  /**
   * Turns on the row-selection feature (checkboxes via `createSelectionColumn`,
   * `table.getSelectedRowModel()`, `DataTableBulkActionsBar`). Selection state
   * is kept in memory only (not URL-synced) and is keyed by `getRowId` — pass
   * a stable `getRowId` if selection should survive sorting/filtering/paging.
   */
  enableRowSelection?: boolean;
  /**
   * Every table in this app is server-driven by default: `data` is treated as
   * an already filtered/sorted/paginated page, so the table skips its own
   * local row models for that concern and just renders `data` as given. Pass
   * the server's total row count via `rowCount` so pagination shows the right
   * page count. Read `pagination`/`sorting`/`searchTerm`/`columnFilters`
   * from `useDataTableUrlState` (same hook this uses internally, since it
   * derives purely from the URL) to build the request args.
   *
   * Set to `false` only for a genuinely client-side table (all rows already
   * in memory, no server round-trip) — then also drop `rowCount`.
   */
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  /** Total row count on the server. Required for correct page counts while `manualPagination` is on (the default). */
  rowCount?: number;
};

export const useDataTable = <TData extends RowData>({
  data,
  columns,
  searchParamKey = "search",
  defaultPageSize = 20,
  getRowId,
  enableMultiSort = false,
  enableRowSelection = false,
  manualPagination = true,
  manualSorting = true,
  manualFiltering = true,
  rowCount,
}: UseDataTableOptions<TData>) => {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,
  } = useDataTableUrlState({
    searchParamKey,
    defaultPageSize,
  });

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: data ?? (EMPTY_DATA as TData[]),
    getRowId,
    enableMultiSort,
    enableRowSelection,
    manualPagination,
    manualSorting,
    manualFiltering,
    rowCount,
    globalFilterFn: "includesString",
    state: { pagination, sorting, globalFilter: searchTerm, columnFilters },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchTerm,
    onColumnFiltersChange: setColumnFilters,
  });

  return table;
};
