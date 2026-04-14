"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { Package } from "lucide-react";

export interface ColumnDef<T> {
  key:    string;
  header: string;
  cell:   (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns:     ColumnDef<T>[];
  data:        T[];
  isLoading?:  boolean;
  /** Total items for pagination */
  total?:      number;
  page?:       number;
  limit?:      number;
  onPageChange?: (page: number) => void;
  emptyTitle?:   string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  emptyTitle       = "No records found",
  emptyDescription = "There's nothing here yet.",
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-cream-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-cream-50 hover:bg-cream-50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-xs font-semibold uppercase tracking-wider text-oud-600 ${col.className ?? ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    icon={Package}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i} className="hover:bg-cream-50/50">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
