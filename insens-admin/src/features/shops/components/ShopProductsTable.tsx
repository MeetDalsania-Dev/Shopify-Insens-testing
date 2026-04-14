'use client';

import { useShopProducts } from '../hooks/useShopProducts';
import { DataTable, ColumnDef } from '@/shared/components/DataTable';
import { ShopProduct } from '../types/shops.types';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate, formatCurrency } from '@/shared/lib/utils';
import { useState } from 'react';

interface ShopProductsTableProps {
  shopId: string;
}

export function ShopProductsTable({ shopId }: ShopProductsTableProps) {
  const [page, setPage] = useState(1);
  const { products, isLoading } = useShopProducts(shopId, { page, limit: 20 });

  const columns: ColumnDef<ShopProduct>[] = [
    {
      key: 'name',
      header: 'Product',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      cell: (row) =>
        row.category ? (
          <Badge variant="outline" className="text-xs">
            {row.category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground/50 text-xs">—</span>
        ),
    },
    {
      key: 'price',
      header: 'Price',
      cell: (row) => (
        <span className="font-medium text-foreground">{formatCurrency(row.price)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      cell: (row) => (
        <span
          className={
            row.stock === 0
              ? 'text-destructive font-medium'
              : row.stock < 10
              ? 'text-amber-600 font-medium'
              : 'text-foreground'
          }
        >
          {row.stock}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Added',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products?.items ?? []}
      isLoading={isLoading}
      page={page}
      totalPages={products?.totalPages}
      onPageChange={setPage}
      emptyTitle="No products"
      emptyDescription="This shop has not added any products yet."
    />
  );
}
