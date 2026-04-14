"use client";

import { ProductForm } from "@/features/products/components/ProductForm";
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import type { ProductFormValues } from "@/features/products/validation/product.schema";

export default function NewProductPage() {
  const { createProduct, isCreating } = useCreateProduct();

  async function handleSubmit(values: ProductFormValues) {
    await createProduct({
      name:        values.name,
      description: values.description,
      price:       values.price,
      stock:       values.stock,
      categoryId:  values.categoryId || undefined,
      images:      values.images?.filter(Boolean),
    });
  }

  return (
    <div>
      <PageHeader
        title="Add Product"
        description="List a new fragrance in your shop."
        backHref="/products"
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Product Details</CardTitle>
            <CardDescription>
              Fill in the details below. Products are visible to buyers once your shop is approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              mode="create"
              onSubmit={handleSubmit}
              isSubmitting={isCreating}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
