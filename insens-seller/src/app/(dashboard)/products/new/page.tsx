"use client";

import { useRouter }   from "next/navigation";
import { useToast }    from "@/shared/hooks/useToast";
import productsApi     from "@/features/products/api/products.api";
import { ProductListingForm } from "@/features/products/components/ListingForm";
import type { FullProductFormValues } from "@/features/products/validation/listing-form.schema";

export default function NewProductPage() {
  const router = useRouter();
  const toast  = useToast();

  const buildPayload = (data: FullProductFormValues, status: string) => ({
    name:        data.title,
    description: data.full_description || data.short_description,
    price:       Number(data.variants?.[0]?.sale_price) || 0,
    stock:       data.variants?.reduce((s, v) => s + (Number(v.stock_quantity) || 0), 0) ?? 0,
    categoryId:  data.category_id || undefined,
    images:      data.gallery_images?.map((g) => g.url).filter(Boolean),
    status,
    metadata:    data,
  });

  const handleSaveDraft = async (data: FullProductFormValues) => {
    await productsApi.createProduct(buildPayload(data, "draft") as any);
    toast.success("Draft saved.", "Continue editing any time.");
  };

  const handleSubmit = async (data: FullProductFormValues) => {
    try {
      await productsApi.createProduct(buildPayload(data, "pending_review") as any);
      toast.success(
        "Submitted for review!",
        "Your product is pending approval. We'll notify you once it's live.",
      );
      router.push("/products");
    } catch (err: any) {
      toast.error("Submission failed", err?.message ?? "Please try again.");
    }
  };

  // Negative margin escapes the DashboardLayout's p-6, giving the form full width/height
  return (
    <div className="-m-6">
      <ProductListingForm
        mode="create"
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
