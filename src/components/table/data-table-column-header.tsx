"use client";

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import type { Column, RowData } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/components/table/features";

type DataTableColumnHeaderProps<TData extends RowData, TValue> = {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  className?: string;
};

/**
 * Drop into a column definition's `header` to get a sortable header cell:
 *
 * ```tsx
 * helper.accessor("name", {
 *   header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
 * })
 * ```
 */
export const DataTableColumnHeader = <TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn("text-sm font-medium", className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2 gap-1.5 data-[state=open]:bg-accent", className)}
      onClick={column.getToggleSortingHandler()}
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <ArrowUpIcon />
      ) : sorted === "desc" ? (
        <ArrowDownIcon />
      ) : (
        <ChevronsUpDownIcon className="text-muted-foreground" />
      )}
    </Button>
  );
};
