"use client";

import type { ReactNode } from "react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useDataTableContext } from "@/components/table/data-table-context";

type DataTableBulkActionsBarProps = {
  /** Action buttons, e.g. `<Button variant="destructive">Delete</Button>`. */
  children?: ReactNode;
  className?: string;
};

/**
 * Renders nothing while no row is selected; once at least one row is
 * selected (across all pages, not just the current one) it shows the
 * selected count plus a "Clear" action alongside your bulk-action buttons.
 * Requires `enableRowSelection` on the provider and `createSelectionColumn()`
 * in `columns`.
 */
export const DataTableBulkActionsBar = ({ children, className }: DataTableBulkActionsBarProps) => {
  const table = useDataTableContext();
  const selectedCount = table.getSelectedRowModel().rows.length;

  if (selectedCount === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => table.toggleAllRowsSelected(false)}
          aria-label="Clear selection"
        >
          <XIcon />
        </Button>
        <Text variant="small" weight="medium">
          {selectedCount} selected
        </Text>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
};
