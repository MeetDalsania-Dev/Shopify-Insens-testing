"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import useSWR from "swr";
import swrFetcher from "@/shared/lib/swr-fetcher";
import { ProductSchema, type ProductFormValues } from "@/features/products/validation/product.schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Category } from "@/features/products/types/products.types";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit:       (values: ProductFormValues) => void | Promise<void>;
  isSubmitting?:  boolean;
  mode?:          "create" | "edit";
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: ProductFormProps) {
  const { data: categories } = useSWR<Category[]>("/api/v1/categories", swrFetcher);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name:        "",
      description: "",
      price:       0,
      stock:       0,
      categoryId:  "",
      images:      [],
      ...defaultValues,
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name:    "images" as never,
  });

  // Pre-fill on edit
  useEffect(() => {
    if (defaultValues && mode === "edit") {
      form.reset({ ...form.getValues(), ...defaultValues });
    }
  }, [defaultValues, mode, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Rose Oud Elixir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Describe the fragrance, notes, longevity, occasion…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price + Stock row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fragrance category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(categories ?? []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URLs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Images</FormLabel>
            {imageFields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addImage("")}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Image URL
              </Button>
            )}
          </div>
          <FormDescription>Add up to 5 direct image URLs for your product.</FormDescription>

          {imageFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`images.${index}`}
              render={({ field: f }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder={`https://example.com/image-${index + 1}.jpg`} {...f} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-500 hover:text-red-700"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="min-w-36">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Add Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
