"use client";

import { use } from "react";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useUpdateProduct } from "@/features/products/hooks/useUpdateProduct";
import { ProductForm } from "@/features/products/components/ProductForm";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { ProductFormValues } from "@/features/products/validation/product.schema";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const { product, isLoading } = useProduct(id);
  const { updateProduct, isUpdating } = useUpdateProduct();

  async function handleSubmit(values: ProductFormValues) {
    await updateProduct(id, {
      name:        values.name,
      description: values.description,
      price:       values.price,
      stock:       values.stock,
      categoryId:  values.categoryId || undefined,
      images:      values.images?.filter(Boolean),
    });
  }

  const defaultValues = product
    ? {
        name:        product.name,
        description: product.description ?? "",
        price:       parseFloat(product.price),
        stock:       product.stock,
        categoryId:  product.categoryId ?? "",
        images:      product.images ?? [],
      }
    : undefined;

  return (
    <div>
      <PageHeader
        title={isLoading ? "Edit Product" : `Edit: ${product?.name ?? ""}`}
        description="Update your product details."
        backHref="/products"
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Product Details</CardTitle>
            <CardDescription>
              Changes are saved immediately and reflected on the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductForm
                mode="edit"
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
