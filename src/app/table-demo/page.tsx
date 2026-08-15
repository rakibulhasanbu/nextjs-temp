"use client";

import { DataTable, DataTableColumnHeader, DataTableFilter, DataTableHeader, DataTableProvider, DataTableSearch, DataTableViewOptions, dataTableFeatures } from "@/components/table";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
};

const users: User[] = Array.from({ length: 87 }).map((_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: index % 3 === 0 ? "active" : index % 3 === 1 ? "inactive" : "pending",
}));

const helper = createColumnHelper<typeof dataTableFeatures, User>();

const columns = helper.columns([
  helper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  }),
  helper.accessor("email", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  }),
  helper.accessor("status", {
    filterFn: "equalsString",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
  }),
]);

export default function TableDemoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-8">
      <DataTableProvider data={users} columns={columns} getRowId={(row) => row.id}>
        <DataTableHeader title="Users" description="Manage your team members">
          <DataTableSearch />
          <DataTableFilter
            columnId="status"
            placeholder="Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "pending", label: "Pending" },
            ]}
          />
          <DataTableViewOptions />
        </DataTableHeader>
        <DataTable />
      </DataTableProvider>
    </div>
  );
}
