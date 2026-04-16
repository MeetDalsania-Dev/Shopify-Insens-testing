"use client";

import { use }         from "react";
import { useRouter }   from "next/navigation";
import { useProduct }  from "@/features/products/hooks/useProduct";
import { useToast }    from "@/shared/hooks/useToast";
import productsApi     from "@/features/products/api/products.api";
import { ProductListingForm } from "@/features/products/components/ListingForm";
import { Skeleton }    from "@/shared/components/ui/skeleton";
import type { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import type { ProductListingFormData } from "@/features/products/types/listing-form.types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id }  = use(params);
  const router  = useRouter();
  const toast   = useToast();
  const { product, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 max-w-2xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Restore full listing form metadata if it was saved; otherwise map basic fields
  const storedMeta = (product as any)?.metadata as Partial<ProductListingFormData> | undefined;

  const defaultValues: Partial<FullProductFormValues> = storedMeta
    ? (storedMeta as Partial<FullProductFormValues>)
    : {
        title:             product?.title ?? product?.name ?? "",
        short_description: product?.description ?? "",
        full_description:  product?.description ?? "",
        primary_image:     product?.images?.[0] ?? "",
        gallery_images:    (product?.images?.slice(1) ?? []).map((url, i) => ({ url, order: i })),
        category_id:       product?.categoryId ?? "",
        variants: [
          {
            variant_label:     "Default",
            size:              "",
            packaging:         "full_bottle",
            edition:           "standard",
            sku:               "",
            barcode:           "",
            mrp:               "",
            sale_price:        parseFloat(String(product?.price ?? "0")) || "",
            cost_price:        "",
            stock_quantity:    product?.stock ?? "",
            reorder_threshold: "",
            weight_grams:      "",
            length_cm:         "",
            width_cm:          "",
            height_cm:         "",
            active:            true,
          },
        ],
      };

  const buildPayload = (data: FullProductFormValues, extra?: object) => ({
    title:            data.title,
    shortDescription: data.short_description  || undefined,
    description:      data.full_description   || undefined,
    categoryId:       data.category_id        || undefined,
    brandId:          data.brand_id           || undefined,
    ...extra,
  });

  const handleSaveChanges = async (data: FullProductFormValues) => {
    try {
      await productsApi.updateProduct(id, buildPayload(data) as any);
      toast.success("Changes saved.");
    } catch (err: any) {
      toast.error("Failed to save", err?.message ?? "Please try again.");
    }
  };

  const handleSubmit = async (data: FullProductFormValues) => {
    try {
      await productsApi.updateProduct(id, buildPayload(data, { status: "pending_review" }) as any);
      toast.success("Re-submitted for review.");
      router.push("/products");
    } catch (err: any) {
      toast.error("Submission failed", err?.message ?? "Please try again.");
    }
  };

  // Negative margin escapes the DashboardLayout's p-6, giving the form full width/height
  return (
    <div className="-m-6">
      <ProductListingForm
        mode="edit"
        productId={id}
        defaultValues={defaultValues}
        onSaveDraft={async () => {}}
        onSubmit={handleSubmit}
        onSaveChanges={handleSaveChanges}
      />
    </div>
  );
}
