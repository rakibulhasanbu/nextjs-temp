"use client";

import { useAlert } from "@/hooks/use-alert";
import { toast } from "@/components/ui/toast";

export type UseBulkDeleteActionOptions<TData> = {
  /** Fires the delete mutation for a single item, e.g. `(id) => deleteType(id).unwrap()`. */
  deleteOne: (id: string) => Promise<unknown>;
  getId: (item: TData) => string;
  /** Singular label used in confirm/toast copy, e.g. `"product type"`. */
  resourceLabel: string;
  /** Extra confirm-dialog body text, e.g. why some deletes might fail. */
  confirmText?: string;
};

/**
 * Confirm → delete every selected row (in parallel, tolerating individual
 * failures) → toast the result. Wire the returned `deleteSelected` to a
 * button inside `DataTableBulkActionsBar`:
 *
 * ```tsx
 * const deleteSelected = useBulkDeleteAction({
 *   deleteOne: (id) => deleteType(id).unwrap(),
 *   getId: (t) => t.id,
 *   resourceLabel: "product type",
 *   confirmText: "Product types with products cannot be deleted — deactivate instead.",
 * })
 *
 * <DataTableBulkActionsBar>
 *   <Button variant="destructive" onClick={() => deleteSelected(selectedRows)}>Delete</Button>
 * </DataTableBulkActionsBar>
 * ```
 *
 * Each resource's delete semantics differ (confirm copy, whether a bulk
 * endpoint even exists), so this only captures the repeated confirm/loop/
 * toast shape — it intentionally doesn't touch `DataTableBulkActionsBar`,
 * which stays a resource-agnostic shell.
 */
export function useBulkDeleteAction<TData>({ deleteOne, getId, resourceLabel, confirmText }: UseBulkDeleteActionOptions<TData>) {
  const alert = useAlert();

  return (items: TData[]) => {
    if (!items.length) return;
    const count = items.length;
    const plural = count > 1 ? "s" : "";

    alert.fire({
      title: `Delete ${count} ${resourceLabel}${plural}?`,
      text: confirmText,
      confirmButtonOptions: { variant: "destructive", text: "Delete" },
      showCancelButton: true,
      onConfirm: async () => {
        const results = await Promise.allSettled(items.map((item) => deleteOne(getId(item))));
        const failed = results.filter((r) => r.status === "rejected").length;
        toast.add({
          title: failed
            ? `${count - failed} deleted, ${failed} failed`
            : `${count} ${resourceLabel}${plural} deleted`,
        });
      },
    });
  };
}
