"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableContext } from "@/components/table/data-table-context";
import type { DataTableFilterOption } from "@/components/table/types";

const ALL_VALUE = "__all__";

type DataTableFilterProps = {
  /** Id of the column to filter (must match the accessor/column id). */
  columnId: string;
  options: DataTableFilterOption[];
  placeholder?: string;
  className?: string;
};

/**
 * A single-select filter bound to a column and synced to the URL, e.g.
 * `<DataTableFilter columnId="status" options={statusOptions} />`.
 * Give the target column `filterFn: "equalsString"` (registered in
 * `features.ts`) so the match is exact rather than substring-based.
 */
export const DataTableFilter = ({ columnId, options, placeholder = "Filter...", className }: DataTableFilterProps) => {
  const table = useDataTableContext();
  const column = table.getColumn(columnId);

  if (!column) return null;

  const value = (column.getFilterValue() as string | undefined) ?? ALL_VALUE;

  return (
    <Select
      value={value}
      onValueChange={(next) => column.setFilterValue(next === ALL_VALUE ? undefined : next)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
