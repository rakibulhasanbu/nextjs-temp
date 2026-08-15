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
  /** Page size used when the `perPage` param is absent. Defaults to 10. */
  defaultPageSize?: number;
  getRowId?: (row: TData, index: number) => string;
  enableMultiSort?: boolean;
};

export const useDataTable = <TData extends RowData>({
  data,
  columns,
  searchParamKey = "search",
  defaultPageSize = 10,
  getRowId,
  enableMultiSort = false,
}: UseDataTableOptions<TData>) => {
  const { pagination, setPagination, sorting, setSorting, globalFilter, setGlobalFilter, columnFilters, setColumnFilters } = useDataTableUrlState({
    searchParamKey,
    defaultPageSize,
  });

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: data ?? (EMPTY_DATA as TData[]),
    getRowId,
    enableMultiSort,
    globalFilterFn: "includesString",
    state: { pagination, sorting, globalFilter, columnFilters },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  return table;
};
