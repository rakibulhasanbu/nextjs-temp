"use client";

import { InboxIcon } from "lucide-react";
import type { RowData } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useDataTableContext } from "@/components/table/data-table-context";
import { DataTablePagination } from "@/components/table/data-table-pagination";

type DataTableProps<TData extends RowData> = {
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSizeOptions?: number[];
  className?: string;
  /** Set to false to render the table without the built-in pagination footer. */
  showPagination?: boolean;
  /**
   * Makes each row clickable (e.g. to open a detail dialog). Interactive
   * controls inside a row — like the selection checkbox — must call
   * `event.stopPropagation()` so they don't also trigger this.
   */
  onRowClick?: (row: TData) => void;
};

export const DataTable = <TData extends RowData = RowData>({
  isLoading,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your search or filters.",
  pageSizeOptions,
  className,
  showPagination = true,
  onRowClick,
}: DataTableProps<TData>) => {
  const table = useDataTableContext<TData>();
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: table.state.pagination.pageSize }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columnCount }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-48 text-center">
                  <Empty className="border-none p-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <InboxIcon />
                      </EmptyMedia>
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination pageSizeOptions={pageSizeOptions} />}
    </div>
  );
};
