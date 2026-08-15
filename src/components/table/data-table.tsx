"use client";

import { InboxIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useDataTableContext } from "@/components/table/data-table-context";
import { DataTablePagination } from "@/components/table/data-table-pagination";

type DataTableProps = {
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSizeOptions?: number[];
  className?: string;
  /** Set to false to render the table without the built-in pagination footer. */
  showPagination?: boolean;
};

export const DataTable = ({
  isLoading,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your search or filters.",
  pageSizeOptions,
  className,
  showPagination = true,
}: DataTableProps) => {
  const table = useDataTableContext();
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
                <TableRow key={row.id}>
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
