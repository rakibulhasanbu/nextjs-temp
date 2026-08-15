"use client";

import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableContext } from "@/components/table/data-table-context";

type DataTablePaginationProps = {
  pageSizeOptions?: number[];
  className?: string;
};

export const DataTablePagination = ({ pageSizeOptions = [10, 20, 30, 50], className }: DataTablePaginationProps) => {
  const table = useDataTableContext();
  const { pageIndex, pageSize } = table.state.pagination;
  const rowCount = table.getRowCount();
  const pageCount = table.getPageCount();

  return (
    <div className={`flex flex-col-reverse items-center justify-between gap-4 sm:flex-row ${className ?? ""}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select value={String(pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger size="sm" className="w-[4.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {rowCount === 0 ? "0 results" : `Page ${pageIndex + 1} of ${Math.max(pageCount, 1)} · ${rowCount} results`}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            aria-label="Go to first page"
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            aria-label="Go to next page"
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
            aria-label="Go to last page"
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
