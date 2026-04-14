"use client";

import { useMyShop } from "@/features/shop/hooks/useMyShop";
import { ShopProfileForm } from "@/features/shop/components/ShopProfileForm";
import { PageHeader } from "@/shared/components/PageHeader";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

export default function ShopPage() {
  const { shop } = useMyShop();

  const statusBadgeVariant =
    shop?.status === "APPROVED" ? "approved" :
    shop?.status === "SUSPENDED" ? "suspended" : "pending";

  return (
    <div>
      <PageHeader
        title="My Shop"
        description="Manage your shop profile, branding, and details."
        actions={
          shop?.status && (
            <Badge variant={statusBadgeVariant} className="capitalize">
              {shop.status.toLowerCase()}
            </Badge>
          )
        }
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Shop Profile</CardTitle>
            <CardDescription>
              These details are visible to buyers on the Insens marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShopProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
