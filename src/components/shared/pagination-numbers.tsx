"use client";

import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export type PaginationRangeItem = number | "ellipsis-start" | "ellipsis-end";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Builds a page-number list with ellipses, e.g. `1 2 3 ... 14 15 16`.
 * `maxPageButtons` bounds how many numeric/ellipsis slots are shown at once.
 */
export function getPaginationRange(
  page: number,
  count: number,
  maxPageButtons = 7
): PaginationRangeItem[] {
  const boundaryCount = 1;
  const siblingCount = Math.max(1, Math.floor((maxPageButtons - (2 * boundaryCount + 3)) / 2));

  if (count <= boundaryCount * 2 + siblingCount * 2 + 3) {
    return range(1, count);
  }

  const startPages = range(1, boundaryCount);
  const endPages = range(count - boundaryCount + 1, count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  );

  const items: (PaginationRangeItem | null)[] = [
    ...startPages,
    siblingsStart > boundaryCount + 2
      ? "ellipsis-start"
      : boundaryCount + 1 < siblingsStart
        ? boundaryCount + 1
        : null,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - boundaryCount - 1
      ? "ellipsis-end"
      : count - boundaryCount > siblingsEnd
        ? count - boundaryCount
        : null,
    ...endPages,
  ];

  return items.filter((item): item is PaginationRangeItem => item !== null);
}

type PaginationNumbersProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
};

export function PaginationNumbers({
  page,
  pageCount,
  onPageChange,
  maxPageButtons = 7,
}: PaginationNumbersProps) {
  const items = getPaginationRange(page, pageCount, maxPageButtons);

  return (
    <div className="flex items-center gap-1">
      {items.map((item, index) =>
        typeof item === "number" ? (
          <Button
            key={item}
            variant={item === page ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onPageChange(item)}
            aria-label={`Go to page ${item}`}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Button>
        ) : (
          <span
            key={`${item}-${index}`}
            aria-hidden
            className="flex size-7 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontalIcon className="size-4" />
          </span>
        )
      )}
    </div>
  );
}
