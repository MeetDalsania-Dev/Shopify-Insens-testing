"use client";

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { useState, useRef, DragEvent } from "react";
import { GripVertical, X, Tag, ImageIcon, Film, RotateCcw } from "lucide-react";
import Image from "next/image";
import { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import { ImageUploadZone } from "../shared/ImageUploadZone";
import { SectionCard }     from "../SectionCard";
import { Button }          from "@/shared/components/ui/button";
import { Input }           from "@/shared/components/ui/input";
import { Badge }           from "@/shared/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

const IMAGE_RULES = [
  "Minimum 1000 × 1000 px",
  "White or neutral background preferred",
  "Max 5 MB per image",
  "Formats: JPG, PNG, WebP",
];

function readAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function isValidImage(f: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(f.type) && f.size <= 5 * 1024 * 1024;
}

export function Step4Media() {
  const { control, watch, setValue } = useFormContext<FullProductFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "gallery_images" });

  const variants      = watch("variants") ?? [];
  const variantLabels = variants.map((v, i) => v.variant_label || `Variant ${i + 1}`);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleGalleryFiles = async (files: FileList) => {
    const remaining = 8 - fields.length;
    const batch = Array.from(files).slice(0, remaining);
    for (const file of batch) {
      if (!isValidImage(file)) continue;
      const url = await readAsDataURL(file);
      append({ url, name: file.name, order: fields.length });
    }
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver  = (e: DragEvent, i: number) => { e.preventDefault(); setOverIdx(i); };
  const onDrop      = (e: DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== i) move(dragIdx, i);
    setDragIdx(null); setOverIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Image rules banner */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-oud-50 border border-oud-200 px-4 py-3">
        <p className="w-full text-xs font-semibold text-oud-700 uppercase tracking-wide mb-0.5">Image Requirements</p>
        {IMAGE_RULES.map((r) => (
          <span key={r} className="text-xs text-oud-600 before:mr-1.5 before:content-['•']">{r}</span>
        ))}
      </div>

      {/* Primary image */}
      <SectionCard title="Primary Image" required>
        <Controller
          control={control}
          name="primary_image"
          render={({ field, fieldState }) => (
            <div className="max-w-xs">
              <ImageUploadZone
                value={field.value}
                onChange={field.onChange}
                onClear={() => field.onChange("")}
                hint="Shown on listing cards. Square format, white background."
                required
                error={fieldState.error?.message}
              />
            </div>
          )}
        />
      </SectionCard>

      {/* Gallery */}
      <SectionCard title={`Gallery Images (${fields.length}/8)`}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fields.map((f, i) => {
              const img = watch(`gallery_images.${i}`);
              return (
                <div
                  key={f.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={(e) => onDrop(e, i)}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing",
                    overIdx === i && dragIdx !== i ? "border-gold-400 scale-105" : "border-border",
                  )}
                >
                  <Image src={img?.url ?? ""} alt={img?.name ?? ""} fill className="object-cover" unoptimized />

                  {/* Drag handle */}
                  <div className="absolute left-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white drop-shadow" />
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  {/* Variant tag */}
                  {variantLabels.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Controller control={control} name={`gallery_images.${i}.variantTag`} render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger className="h-5 bg-transparent border-0 text-white text-[10px] p-0 focus:ring-0">
                            <div className="flex items-center gap-1">
                              <Tag className="h-2.5 w-2.5" />
                              <SelectValue placeholder="Tag variant" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {variantLabels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add more */}
            {fields.length < 8 && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-oud-300 hover:bg-oud-50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground"
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Add photo</span>
              </button>
            )}
          </div>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) handleGalleryFiles(e.target.files); e.target.value = ""; }}
          />

          <p className="text-xs text-muted-foreground">
            Drag images to reorder. Hover to tag to a variant or remove.
          </p>
        </div>
      </SectionCard>

      {/* Supplementary media */}
      <SectionCard title="Supplementary Media">
        <div className="grid gap-6 sm:grid-cols-2">
          <Controller control={control} name="lifestyle_shot" render={({ field }) => (
            <ImageUploadZone
              value={field.value}
              onChange={field.onChange}
              onClear={() => field.onChange("")}
              label="Lifestyle Shot"
              hint="Contextual shot — on a dressing table, in use, etc."
              aspectRatio="landscape"
            />
          )} />
          <Controller control={control} name="label_image" render={({ field }) => (
            <ImageUploadZone
              value={field.value}
              onChange={field.onChange}
              onClear={() => field.onChange("")}
              label="Label / Ingredient Image"
              hint="Close-up of product label, ingredients, or certification."
              aspectRatio="landscape"
            />
          )} />
        </div>
      </SectionCard>

      {/* Video + 360 */}
      <SectionCard title="Video & 360° View">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller control={control} name="product_video" render={({ field }) => (
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <Film className="h-4 w-4 text-muted-foreground" />
                Product Video URL
              </label>
              <Input placeholder="https://youtube.com/… or direct MP4 link (max 30s)" {...field} />
              <p className="mt-1 text-xs text-muted-foreground">YouTube, Vimeo or direct MP4 link. Max 30 seconds.</p>
            </div>
          )} />
          <Controller control={control} name="view_360" render={({ field }) => (
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                360° View URL
              </label>
              <Input placeholder="https://your360viewer.com/…" {...field} />
              <p className="mt-1 text-xs text-muted-foreground">Link to embedded 360° product viewer.</p>
            </div>
          )} />
        </div>
      </SectionCard>
    </div>
  );
}
