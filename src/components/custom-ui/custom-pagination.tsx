import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationMeta {
    page: number;
    total: number;
    limit: number;
}

interface CustomPaginationProps {
    paginationMeta: PaginationMeta;
    maxVisiblePages?: number;
    className?: string;
    buttonClassName?: string;
    showRowsPerPage?: boolean;
    showRowSelection?: boolean;
    selectedRows?: number;
    pageSizeOptions?: number[];
    showPageCount?: boolean;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

export const CustomPagination = ({
    paginationMeta,
    maxVisiblePages = 7,
    className,
    buttonClassName,
    showRowsPerPage = false,
    showRowSelection = false,
    selectedRows = 0,
    pageSizeOptions = [ 10, 20, 30, 40, 50 ],
    showPageCount = false,
    onPageChange,
    onLimitChange,
}: CustomPaginationProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentPage = paginationMeta.page;
    const totalItems = paginationMeta.total;
    const pageSize = paginationMeta.limit;
    const totalPages = Math.ceil(totalItems / pageSize);

    const setParams = useCallback(
        (params: { [ key: string ]: string }) => {
            const existingParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([ key, value ]) => {
                if (value) {
                    existingParams.set(key, value.toString());
                } else {
                    existingParams.delete(key);
                }
            });
            router.replace(`${ pathname }?${ existingParams.toString() }`, {
                scroll: false,
            });
        },
        [ searchParams, router, pathname ]
    );

    const updatePageParam = (pageIndex: number) => {
        const newPage = pageIndex + 1;
        if (onPageChange) {
            onPageChange(newPage);
        } else {
            setParams({ page: newPage.toString() });
        }
    };

    const handleLimitChange = (limit: string) => {
        const limitNumber = parseInt(limit);
        if (onLimitChange) {
            onLimitChange(limitNumber);
        } else {
            setParams({ limit, page: "1" }); // Reset to first page when changing page size
        }
    };

    const getVisiblePages = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const numMiddlePages = maxVisiblePages - 2;
        let start = Math.max(2, currentPage - Math.floor(numMiddlePages / 2));
        let end = start + numMiddlePages - 1;

        if (end >= totalPages) {
            end = totalPages - 1;
            start = end - numMiddlePages + 1;
        }

        pages.push(1);
        if (start > 2) {
            pages.push("...");
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < totalPages - 1) {
            pages.push("...");
        }
        pages.push(totalPages);
        return pages;
    };

    const handlePaginationLinkClick = (pageNumber: number | string) => {
        if (typeof pageNumber === "number" && pageNumber !== currentPage) {
            const pageIndex = pageNumber - 1;
            updatePageParam(pageIndex);
        }
    };

    const handlePreviousClick = () => {
        if (currentPage > 1) {
            const newPageIndex = currentPage - 2;
            updatePageParam(newPageIndex);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            const newPageIndex = currentPage;
            updatePageParam(newPageIndex);
        }
    };

    return (
        <div className={ cn("flex items-center justify-between px-2", className) }>
            { showRowSelection && (
                <div className="text-muted-foreground flex-1 text-sm max-md:hidden">
                    { selectedRows } of { totalItems } row(s) selected.
                </div>
            ) }

            <div className="flex items-center space-x-6 lg:space-x-8">
                { showRowsPerPage && (
                    <div className="flex items-center space-x-2 max-md:hidden">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select value={ `${ pageSize }` } onValueChange={ handleLimitChange }>
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={ pageSize } />
                            </SelectTrigger>
                            <SelectContent side="top">
                                { pageSizeOptions.map((size) => (
                                    <SelectItem key={ size } value={ `${ size }` }>
                                        { size }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>
                    </div>
                ) }

                { showPageCount && (
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium max-md:hidden">
                        Page { currentPage } of { totalPages }
                    </div>
                ) }

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button variant="outline" className="cursor-pointer" size="icon" onClick={ handlePreviousClick } disabled={ currentPage <= 1 }>
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="size-5" />
                    </Button>

                    <Pagination className={ cn("mx-0") }>
                        <PaginationContent className="gap-2">
                            { getVisiblePages().map((pageNumber, index) => (
                                <PaginationItem key={ index }>
                                    { pageNumber === "..." ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            isActive={ pageNumber === currentPage }
                                            onClick={ () => handlePaginationLinkClick(pageNumber) }
                                            className={ buttonClassName }
                                        >
                                            { pageNumber }
                                        </PaginationLink>
                                    ) }
                                </PaginationItem>
                            )) }
                        </PaginationContent>
                    </Pagination>

                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="icon"
                        onClick={ handleNextClick }
                        disabled={ currentPage >= totalPages }
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
