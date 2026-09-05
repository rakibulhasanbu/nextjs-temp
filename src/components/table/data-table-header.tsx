import * as React from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

type DataTableHeaderProps = {
  title?: string;
  description?: string;
  /** Search box, filters, view options, action buttons, etc. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Layout wrapper for a table's title/description plus its toolbar (search,
 * filters, view options). Purely presentational — place it above `<DataTable />`:
 *
 * ```tsx
 * <DataTableHeader title="Users" description="Manage your team members">
 *   <DataTableSearch />
 *   <DataTableFilter columnId="status" title="Status" options={statusOptions} />
 *   <DataTableViewOptions />
 * </DataTableHeader>
 * <DataTable />
 * ```
 */
export const DataTableHeader = ({
  title,
  description,
  children,
  className,
}: DataTableHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        !title && !description && "sm:justify-end",
        className
      )}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <Text variant="h4" render={<h2 />} className="text-lg sm:text-lg">
              {title}
            </Text>
          )}
          {description && (
            <Text variant="small" tone="muted" weight="normal">
              {description}
            </Text>
          )}
        </div>
      )}
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
};
