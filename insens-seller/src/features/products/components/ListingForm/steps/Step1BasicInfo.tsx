"use client";

import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import useSWR from "swr";
import swrFetcher from "@/shared/lib/swr-fetcher";
import { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import { ButtonSelector }  from "../shared/ButtonSelector";
import { TagInput }        from "../shared/TagInput";
import { ImageUploadZone } from "../shared/ImageUploadZone";
import { SectionCard }     from "../SectionCard";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription,
} from "@/shared/components/ui/form";
import { Input }    from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch }   from "@/shared/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";

const PRODUCT_TYPES = [
  { value: "branded_perfume", label: "Branded Perfume", icon: "🏷️", description: "Authentic brand product" },
  { value: "custom_perfume",  label: "Custom Perfume",  icon: "🧪", description: "Handcrafted original" },
  { value: "decant_sample",   label: "Decant / Sample", icon: "🧴", description: "Sample or trial size" },
  { value: "gift_set",        label: "Gift Set",        icon: "🎁", description: "Bundle or set" },
] as const;

const GENDER_OPTIONS = [
  { value: "men",    label: "Men" },
  { value: "women",  label: "Women" },
  { value: "unisex", label: "Unisex" },
] as const;

const COUNTRIES = [
  "France", "United Arab Emirates", "Saudi Arabia", "United Kingdom",
  "United States", "Italy", "Germany", "Switzerland", "India", "Japan", "Other",
];

interface Category { id: string; name: string; parentId?: string | null; }

function buildCategoryOptions(cats: Category[]) {
  const parents = cats.filter((c) => !c.parentId);
  const result: { label: string; value: string; indent?: boolean }[] = [];
  for (const p of parents) {
    result.push({ label: p.name, value: p.id });
    cats.filter((c) => c.parentId === p.id).forEach((child) => {
      result.push({ label: `  ↳ ${child.name}`, value: child.id, indent: true });
    });
  }
  return result;
}

export function Step1BasicInfo() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<FullProductFormValues>();
  const productType = watch("product_type");
  const isBranded   = productType === "branded_perfume";
  const isCustom    = productType === "custom_perfume";

  const { data: categoriesData } = useSWR<{ items: Category[] }>("/api/v1/categories", swrFetcher);
  const categoryOptions = buildCategoryOptions(categoriesData?.items ?? []);

  const [brandInput, setBrandInput] = useState(watch("brand_name") ?? "");
  const shortDescLen = (watch("short_description") ?? "").length;

  return (
    <div className="space-y-6">
      {/* Product type */}
      <SectionCard title="Product Type" required>
        <Controller
          control={control}
          name="product_type"
          render={({ field, fieldState }) => (
            <ButtonSelector
              options={PRODUCT_TYPES as any}
              value={field.value}
              onChange={field.onChange}
              columns={2}
              error={fieldState.error?.message}
            />
          )}
        />
      </SectionCard>

      {/* Core identity */}
      <SectionCard title="Product Identity">
        <div className="space-y-4">
          {/* Title */}
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Chanel Coco Mademoiselle EDP 100ml" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Brand */}
          <FormField control={control} name="brand_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type brand name…"
                  value={brandInput}
                  onChange={(e) => {
                    setBrandInput(e.target.value);
                    field.onChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>Start typing to search or add a new brand.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          {/* Category */}
          <FormField control={control} name="category_id" render={({ field }) => (
            <FormItem>
              <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Gender */}
          <FormField control={control} name="gender_target" render={({ field }) => (
            <FormItem>
              <FormLabel>Gender Target <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <ButtonSelector
                  options={GENDER_OPTIONS as any}
                  value={field.value}
                  onChange={field.onChange}
                  columns={3}
                  size="sm"
                  error={(errors as any).gender_target?.message}
                />
              </FormControl>
            </FormItem>
          )} />

          {/* Country */}
          <FormField control={control} name="country_of_origin" render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Origin</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </SectionCard>

      {/* Descriptions */}
      <SectionCard title="Descriptions">
        <div className="space-y-4">
          <FormField control={control} name="short_description" render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Short Description <span className="text-red-500">*</span></FormLabel>
                <span className={`text-xs ${shortDescLen > 190 ? "text-amber-600" : "text-muted-foreground"}`}>
                  {shortDescLen}/200
                </span>
              </div>
              <FormControl>
                <Textarea
                  rows={3}
                  maxLength={200}
                  placeholder="A punchy one-liner that appears on product cards…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={control} name="full_description" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tell the full story — notes, occasions, inspiration, history…"
                  {...field}
                />
              </FormControl>
              <FormDescription>Supports **bold**, *italic*, and line breaks.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </SectionCard>

      {/* Tags */}
      <SectionCard title="Tags">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="Add keyword tags…"
              suggestions={["niche", "luxury", "oud", "floral", "oriental", "fresh", "woody", "unisex"]}
            />
          )}
        />
      </SectionCard>

      {/* Branded-only section */}
      {isBranded && (
        <SectionCard title="Brand Authorisation" badge="Branded Only" badgeVariant="warning">
          <div className="space-y-4">
            <Controller
              control={control}
              name="brand_authorization_proof"
              render={({ field }) => (
                <ImageUploadZone
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onClear={() => field.onChange("")}
                  label="Authorisation Proof"
                  hint="Upload letter, certificate or invoice (JPG/PNG/WebP, max 5 MB)"
                  aspectRatio="landscape"
                  error={(errors as any).brand_authorization_proof?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="authorized_seller_declaration"
              render={({ field }) => (
                <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-4 hover:bg-oud-50 transition-colors">
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">Authorised Seller Declaration</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      I declare that I am an authorised seller of this brand and have the right to list these products on Insens.
                    </p>
                  </div>
                </label>
              )}
            />
          </div>
        </SectionCard>
      )}
    </div>
  );
}
