"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { PaginationNumbers } from "@/components/shared/pagination-numbers";
import { useDataTableContext } from "@/components/table/data-table-context";

type DataTablePaginationProps = {
    pageSizeOptions?: number[];
    maxPageButtons?: number;
    className?: string;
};

export const DataTablePagination = ({
    pageSizeOptions = [10, 20, 30, 50],
    maxPageButtons = 7,
    className,
}: DataTablePaginationProps) => {
    const table = useDataTableContext();
    const { pageIndex, pageSize } = table.state.pagination;
    const rowCount = table.getRowCount();
    const pageCount = table.getPageCount();

    return (
        <div
            className={`flex flex-col-reverse items-center justify-between gap-4 sm:flex-row ${className ?? ""}`}
        >
            <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
                <span>Rows per page</span>
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) => table.setPageSize(Number(value))}
                >
                    <SelectTrigger size="sm" className="w-18">
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
                <Text variant="small" tone="muted" weight="normal" className="hidden md:block">
                    {rowCount === 0
                        ? "0 results"
                        : `Page ${pageIndex + 1} of ${Math.max(pageCount, 1)} · ${rowCount} results`}
                </Text>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        aria-label="Go to previous page"
                    >
                        <ChevronLeftIcon />
                    </Button>
                    <PaginationNumbers
                        page={pageIndex + 1}
                        pageCount={Math.max(pageCount, 1)}
                        onPageChange={(page) => table.setPageIndex(page - 1)}
                        maxPageButtons={maxPageButtons}
                    />
                    <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        aria-label="Go to next page"
                    >
                        <ChevronRightIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};
