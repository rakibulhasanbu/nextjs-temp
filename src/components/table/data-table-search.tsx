"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useDataTableContext } from "@/components/table/data-table-context";
import { useDebouncedCallback } from "@/components/table/hooks/use-debounced-callback";

type DataTableSearchProps = {
  placeholder?: string;
  className?: string;
  /** Debounce (ms) before the search updates the URL/table. Defaults to 300. */
  debounce?: number;
};

export const DataTableSearch = ({ placeholder = "Search...", className, debounce = 300 }: DataTableSearchProps) => {
  const table = useDataTableContext();
  const globalFilter = (table.state.globalFilter as string | undefined) ?? "";

  // Remounted (via `key`) whenever the filter is cleared/changed from outside
  // the input (e.g. the clear button, or browser back/forward), so the field
  // stays uncontrolled otherwise and typing never fights a debounced write-back.
  const [resetKey, setResetKey] = React.useState(0);

  const debouncedSetGlobalFilter = useDebouncedCallback((next: string) => {
    table.setGlobalFilter(next);
  }, debounce);

  return (
    <InputGroup className={className}>
      <InputGroupInput
        key={resetKey}
        placeholder={placeholder}
        defaultValue={globalFilter}
        onChange={(event) => debouncedSetGlobalFilter(event.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {globalFilter && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => {
              table.setGlobalFilter("");
              setResetKey((key) => key + 1);
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
