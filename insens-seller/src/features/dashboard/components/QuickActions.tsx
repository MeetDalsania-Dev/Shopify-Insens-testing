"use client";

import Link from "next/link";
import { Plus, Store } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/shared/state/auth.store";

export function QuickActions() {
  const shopStatus = useAuthStore((s) => s.shopStatus);

  if (shopStatus !== "APPROVED") return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 font-display text-lg font-semibold text-oud-800">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">
            <Store className="mr-2 h-4 w-4" />
            Edit My Shop
          </Link>
        </Button>
      </div>
    </div>
  );
}
