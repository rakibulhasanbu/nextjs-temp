"use client";

import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTableContext } from "@/components/table/data-table-context";

export const DataTableViewOptions = () => {
  const table = useDataTableContext();

  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  if (columns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            <SlidersHorizontalIcon data-icon="inline-start" />
            View
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(checked)}
          >
            {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
