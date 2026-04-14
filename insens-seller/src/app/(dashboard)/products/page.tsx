"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsTable } from "@/features/products/components/ProductsTable";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/shared/state/auth.store";

export default function ProductsPage() {
  const shopStatus = useAuthStore((s) => s.shopStatus);
  const isApproved = shopStatus === "APPROVED";

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your fragrance catalogue."
        actions={
          <Button asChild disabled={!isApproved}>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        }
      />
      <ProductsTable />
    </div>
  );
}
