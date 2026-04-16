"use client";

import { useRouter }   from "next/navigation";
import { useToast }    from "@/shared/hooks/useToast";
import productsApi     from "@/features/products/api/products.api";
import { ProductListingForm } from "@/features/products/components/ListingForm";
import type { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import type { CreateProductPayload } from "@/features/products/types/products.types";

function buildPayload(data: FullProductFormValues, status: "draft" | "pending_review"): CreateProductPayload {
  const slug =
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Date.now();

  return {
    title:            data.title,
    slug,
    shortDescription: data.short_description  || undefined,
    description:      data.full_description   || undefined,
    productType:      data.has_variants ? "variant" : "simple",
    listingType:      data.product_type        || undefined,
    categoryId:       data.category_id         || undefined,
    brandId:          data.brand_id            || undefined,
    originCountry:    data.country_of_origin   || undefined,
    tags:             data.tags?.length ? JSON.stringify(data.tags) : undefined,
    productVideo:     data.product_video       || undefined,
    view360:          data.view_360            || undefined,
    status,
    perfumeDetails: {
      fragranceFamily:             data.fragrance_family?.join(",")  || undefined,
      concentration:               data.concentration                || undefined,
      genderTarget:                data.gender_target                || undefined,
      topNotes:                    data.top_notes?.join(",")         || undefined,
      middleNotes:                 data.middle_notes?.join(",")      || undefined,
      baseNotes:                   data.base_notes?.join(",")        || undefined,
      occasionTags:                data.occasion_tags?.join(",")     || undefined,
      seasonTags:                  data.season_tags?.join(",")       || undefined,
      longevityScore:              String(data.longevity_rating),
      projectionScore:             String(data.projection_rating),
      scentStory:                  data.scent_story                  || undefined,
      handcrafted:                 data.handcrafted,
      crueltyFree:                 data.cruelty_free,
      launchYear:                  data.launch_year ? Number(data.launch_year) : undefined,
      editionName:                 data.edition_name                 || undefined,
      discontinued:                data.discontinued,
      batchNumber:                 data.batch_number                 || undefined,
      formulaRef:                  data.formula_ref                  || undefined,
      brandAuthorizationProof:     data.brand_authorization_proof    || undefined,
      authorizedSellerDeclaration: data.authorized_seller_declaration,
    },
    variants: data.variants?.map((v) => ({
      sku:               v.sku,
      barcode:           v.barcode      || undefined,
      title:             v.variant_label || undefined,
      sizeLabel:         v.size         || undefined,
      packagingType:     v.packaging    || undefined,
      editionType:       v.edition      || undefined,
      mrp:               String(v.mrp),
      salePrice:         String(v.sale_price),
      costPrice:         v.cost_price   ? String(v.cost_price)   : undefined,
      stock:             Number(v.stock_quantity)    || 0,
      reorderThreshold:  Number(v.reorder_threshold) || 0,
      weightGrams:       v.weight_grams ? String(v.weight_grams) : undefined,
      lengthCm:          v.length_cm    ? String(v.length_cm)    : undefined,
      widthCm:           v.width_cm     ? String(v.width_cm)     : undefined,
      heightCm:          v.height_cm    ? String(v.height_cm)    : undefined,
      isActive:          v.active,
    })),
  };
}

export default function NewProductPage() {
  const router = useRouter();
  const toast  = useToast();

  const handleSaveDraft = async (data: FullProductFormValues) => {
    await productsApi.createProduct(buildPayload(data, "draft"));
    toast.success("Draft saved.", "Continue editing any time.");
  };

  const handleSubmit = async (data: FullProductFormValues) => {
    try {
      await productsApi.createProduct(buildPayload(data, "pending_review"));
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
