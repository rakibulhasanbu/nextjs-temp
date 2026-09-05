"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ColumnFiltersState, PaginationState, SortingState, Updater } from "@tanstack/react-table";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";

type UseDataTableUrlStateOptions = {
  searchParamKey?: string;
  defaultPageSize?: number;
};

function resolveUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === "function" ? (updater as (old: T) => T)(current) : updater;
}

/**
 * Reads and writes table state (pagination, sorting, global search, column
 * filters) directly to/from the URL query string so every view is a
 * shareable, back-button-friendly link. Any query param that isn't one of
 * the reserved keys (`page`, `perPage`, `sort`, the search key) is treated
 * as a column filter keyed by column id, value(s) comma-separated.
 */
export const useDataTableUrlState = ({ searchParamKey = "search", defaultPageSize = 20 }: UseDataTableUrlStateOptions = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const pagination = useMemo<PaginationState>(() => {
    const page = Number(searchParams.get(PAGE_KEY) ?? "1");
    const pageSize = Number(searchParams.get(PER_PAGE_KEY) ?? defaultPageSize);
    return {
      pageIndex: Number.isFinite(page) && page > 0 ? page - 1 : 0,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : defaultPageSize,
    };
  }, [searchParams, defaultPageSize]);

  const sorting = useMemo<SortingState>(() => {
    const raw = searchParams.get(SORT_KEY);
    if (!raw) return [];
    return raw
      .split(",")
      .map((entry) => {
        const [id, direction] = entry.split(".");
        if (!id) return null;
        return { id, desc: direction === "desc" };
      })
      .filter((value): value is { id: string; desc: boolean } => value !== null);
  }, [searchParams]);

  const searchTerm = searchParams.get(searchParamKey) ?? "";

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const reserved = new Set([PAGE_KEY, PER_PAGE_KEY, SORT_KEY, searchParamKey]);
    const filters: ColumnFiltersState = [];
    searchParams.forEach((value, key) => {
      if (reserved.has(key) || filters.some((filter) => filter.id === key)) return;
      const values = value.split(",").filter(Boolean);
      filters.push({ id: key, value: values.length > 1 ? values : values[0] });
    });
    return filters;
  }, [searchParams, searchParamKey]);

  const setPagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = resolveUpdater(updater, pagination);
      pushParams((params) => {
        if (next.pageIndex > 0) params.set(PAGE_KEY, String(next.pageIndex + 1));
        else params.delete(PAGE_KEY);

        if (next.pageSize !== defaultPageSize) params.set(PER_PAGE_KEY, String(next.pageSize));
        else params.delete(PER_PAGE_KEY);
      });
    },
    [pagination, pushParams, defaultPageSize]
  );

  const setSorting = useCallback(
    (updater: Updater<SortingState>) => {
      const next = resolveUpdater(updater, sorting);
      pushParams((params) => {
        if (next.length > 0) {
          params.set(SORT_KEY, next.map((sort) => `${sort.id}.${sort.desc ? "desc" : "asc"}`).join(","));
        } else {
          params.delete(SORT_KEY);
        }
        params.delete(PAGE_KEY);
      });
    },
    [sorting, pushParams]
  );

  const setSearchTerm = useCallback(
    (updater: Updater<string>) => {
      const next = resolveUpdater(updater, searchTerm);
      pushParams((params) => {
        if (next) params.set(searchParamKey, next);
        else params.delete(searchParamKey);
        params.delete(PAGE_KEY);
      });
    },
    [searchTerm, pushParams, searchParamKey]
  );

  const setColumnFilters = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const next = resolveUpdater(updater, columnFilters);
      pushParams((params) => {
        columnFilters.forEach((filter) => params.delete(filter.id));
        next.forEach((filter) => {
          const value = Array.isArray(filter.value) ? filter.value.join(",") : String(filter.value ?? "");
          if (value) params.set(filter.id, value);
        });
        params.delete(PAGE_KEY);
      });
    },
    [columnFilters, pushParams]
  );

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,
  };
};
