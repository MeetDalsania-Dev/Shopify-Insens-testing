"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ShopProfileSchema, type ShopProfileFormValues } from "@/features/shop/validation/shop.schema";
import { useMyShop } from "@/features/shop/hooks/useMyShop";
import { useUpdateShop } from "@/features/shop/hooks/useUpdateShop";
import { useAuthStore } from "@/shared/state/auth.store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { isValidUrl } from "@/shared/lib/utils";

export function ShopProfileForm() {
  const { shop, isLoading } = useMyShop();
  const { updateShop, isUpdating } = useUpdateShop();
  const shopStatus = useAuthStore((s) => s.shopStatus);
  const isSuspended = shopStatus === "SUSPENDED";

  const form = useForm<ShopProfileFormValues>({
    resolver: zodResolver(ShopProfileSchema),
    defaultValues: {
      name: "", description: "", city: "", address: "", logoUrl: "",
    },
  });

  // Pre-fill form once shop data loads
  useEffect(() => {
    if (shop) {
      form.reset({
        name:        shop.name        ?? "",
        description: shop.description ?? "",
        city:        shop.city        ?? "",
        address:     shop.address     ?? "",
        logoUrl:     shop.logoUrl     ?? "",
      });
    }
  }, [shop, form]);

  const logoUrl = form.watch("logoUrl");

  if (isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  async function onSubmit(values: ShopProfileFormValues) {
    await updateShop({
      name:        values.name,
      description: values.description,
      city:        values.city,
      address:     values.address,
      logoUrl:     values.logoUrl || undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Status badge */}
        {shopStatus && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Shop status:</span>
            <Badge variant={shopStatus === "APPROVED" ? "approved" : shopStatus === "SUSPENDED" ? "suspended" : "pending"} className="capitalize">
              {shopStatus.toLowerCase()}
            </Badge>
          </div>
        )}

        {/* Shop name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input disabled={isSuspended} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug (read-only) */}
        {shop?.slug && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Shop URL: <span className="font-medium text-oud-700">seller.insens.com/shops/{shop.slug}</span>
            </p>
          </div>
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} disabled={isSuspended} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City + Address */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input disabled={isSuspended} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input disabled={isSuspended} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Logo URL */}
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://…" disabled={isSuspended} {...field} />
              </FormControl>
              <FormDescription>Direct link to your shop logo image.</FormDescription>
              <FormMessage />
              {logoUrl && isValidUrl(logoUrl) && (
                <div className="mt-2 h-16 w-16 overflow-hidden rounded-lg border border-cream-200">
                  <Image src={logoUrl} alt="Logo" width={64} height={64} className="h-full w-full object-cover" unoptimized />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating || isSuspended} className="min-w-32">
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>

        {isSuspended && (
          <p className="text-sm text-red-600">
            Your shop is suspended. Contact support to re-enable editing.
          </p>
        )}
      </form>
    </Form>
  );
}
