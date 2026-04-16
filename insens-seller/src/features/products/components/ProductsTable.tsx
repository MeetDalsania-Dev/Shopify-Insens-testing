"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Package } from "lucide-react";
import { useMyProducts } from "@/features/products/hooks/useMyProducts";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { ProductStatusToggle } from "@/features/products/components/ProductStatusToggle";
import { useAuthStore } from "@/shared/state/auth.store";
import { DataTable, type ColumnDef } from "@/shared/components/DataTable";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { formatCurrency } from "@/shared/lib/utils";
import type { Product } from "@/features/products/types/products.types";

export function ProductsTable() {
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { products, isLoading } = useMyProducts({ page, limit: LIMIT });
  const { deleteProduct }       = useDeleteProduct();
  const shopStatus              = useAuthStore((s) => s.shopStatus);
  const isApproved              = shopStatus === "APPROVED";

  const columns: ColumnDef<Product>[] = [
    {
      key: "image",
      header: "Image",
      className: "w-16",
      cell: (row) =>
        row.images?.[0] ? (
          <div className="h-10 w-10 overflow-hidden rounded-md border border-cream-200">
            <Image
              src={row.images[0]}
              alt={row.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cream-100">
            <Package className="h-4 w-4 text-oud-400" />
          </div>
        ),
    },
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <div>
          <p className="font-medium text-oud-900">{row.name}</p>
          {row.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (row) =>
        row.category ? (
          <Badge variant="secondary" className="capitalize">
            {row.category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => (
        <span className="font-medium">{formatCurrency(row.price ?? 0)}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (row) => (
        <span className={row.stock === 0 ? "font-medium text-red-600" : ""}>
          {row.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Active",
      cell: (row) => (
        <ProductStatusToggle productId={row.id} isActive={row.isActive ?? true} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8" disabled={!isApproved}>
            <Link href={`/products/${row.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                disabled={!isApproved}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
            title="Remove Product"
            description={`Are you sure you want to remove "${row.name}"? This action cannot be undone.`}
            confirmLabel="Remove"
            variant="destructive"
            onConfirm={() => deleteProduct(row.id)}
          />
        </div>
      ),
    },
  ];

  if (!isApproved && !isLoading && products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Products locked"
        description="Your shop must be approved before you can manage products."
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={products}
      isLoading={isLoading}
      page={page}
      limit={LIMIT}
      onPageChange={setPage}
      emptyTitle="No products yet"
      emptyDescription="Add your first product to start selling on Insens."
    />
  );
}
