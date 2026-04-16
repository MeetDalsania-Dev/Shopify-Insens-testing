"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { useState } from "react";
import { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import { DEFAULT_VARIANT } from "@/features/products/types/listing-form.types";
import { SectionCard } from "../SectionCard";
import { Button }   from "@/shared/components/ui/button";
import { Input }    from "@/shared/components/ui/input";
import { Switch }   from "@/shared/components/ui/switch";
import { Badge }    from "@/shared/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

const SIZE_OPTIONS  = ["30ml", "50ml", "75ml", "100ml", "200ml", "custom"];
const PKG_OPTIONS   = [
  { value: "full_bottle",  label: "Full Bottle"  },
  { value: "tester",       label: "Tester"       },
  { value: "travel_size",  label: "Travel Size"  },
  { value: "refill",       label: "Refill"       },
  { value: "gift_set",     label: "Gift Set"     },
  { value: "decant",       label: "Decant"       },
];
const EDITION_OPTIONS = [
  { value: "standard",   label: "Standard"   },
  { value: "limited",    label: "Limited"    },
  { value: "collector",  label: "Collector"  },
];

const PLATFORM_COMMISSION = 0.12; // 12% default

function MarginPill({ mrp, sale, cost }: { mrp: number|'', sale: number|'', cost: number|'' }) {
  if (!sale || !cost || !mrp) return null;
  const margin = Number(sale) - Number(cost) - Number(sale) * PLATFORM_COMMISSION;
  const pct    = ((margin / Number(sale)) * 100).toFixed(1);
  const good   = margin > 0;
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
      good ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700",
    )}>
      <Calculator className="h-3.5 w-3.5 shrink-0" />
      <span>
        Margin: <strong>{good ? "+" : ""}{margin.toFixed(2)} AED</strong> ({pct}%)
        &nbsp;·&nbsp; Commission: {(Number(sale) * PLATFORM_COMMISSION).toFixed(2)} AED
      </span>
    </div>
  );
}

function autoLabel(index: number, size: string, packaging: string) {
  return `${packaging.replace("_", " ")} ${size}`.trim() || `Variant ${index + 1}`;
}

export function Step3VariantsPricing() {
  const { control, watch, setValue, formState: { errors } } =
    useFormContext<FullProductFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const hasVariants  = watch("has_variants");
  const variantData  = watch("variants");
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggleExpand = (i: number) =>
    setExpanded((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  return (
    <div className="space-y-6">
      {/* Has variants toggle */}
      <SectionCard title="Variant Setup">
        <label className="flex items-center justify-between gap-4 cursor-pointer rounded-lg border border-border p-4 hover:bg-oud-50 transition-colors">
          <div>
            <p className="text-sm font-medium">Multiple variants?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {hasVariants ? "Define multiple sizes, packaging or editions below." : "Single product — fill in the one variant below."}
            </p>
          </div>
          <Controller control={control} name="has_variants" render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )} />
        </label>
      </SectionCard>

      {/* Variants list */}
      <div className="space-y-3">
        {fields.map((fieldItem, i) => {
          const v      = variantData?.[i];
          const isOpen = expanded.has(i);
          const label  = v?.variant_label || autoLabel(i, v?.size ?? "", v?.packaging ?? "");

          return (
            <div key={fieldItem.id} className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
              {/* Variant header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                <button
                  type="button"
                  onClick={() => toggleExpand(i)}
                  className="flex flex-1 items-center gap-3 text-left min-w-0"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-oud-100 text-xs font-semibold text-oud-700">
                    {i + 1}
                  </div>
                  <span className="truncate text-sm font-medium">{label}</span>
                  {v?.active === false && <Badge variant="secondary" className="ml-2 text-xs">Inactive</Badge>}
                  {v?.sale_price && <Badge variant="outline" className="ml-auto shrink-0 font-mono text-xs">{v.sale_price} AED</Badge>}
                  {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Variant fields — expandable */}
              {isOpen && (
                <div className="p-4 space-y-5">
                  {/* Label */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">Variant Label</label>
                    <Controller control={control} name={`variants.${i}.variant_label`} render={({ field }) => (
                      <Input
                        placeholder={autoLabel(i, v?.size ?? "", v?.packaging ?? "")}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )} />
                  </div>

                  {/* Size / Packaging / Edition */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Size</label>
                      <Controller control={control} name={`variants.${i}.size`} render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {SIZE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )} />
                      {v?.size === "custom" && (
                        <Controller control={control} name={`variants.${i}.custom_size_ml`} render={({ field }) => (
                          <Input className="mt-2" placeholder="e.g. 125ml" {...field} />
                        )} />
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Packaging</label>
                      <Controller control={control} name={`variants.${i}.packaging`} render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PKG_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Edition</label>
                      <Controller control={control} name={`variants.${i}.edition`} render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {EDITION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )} />
                    </div>
                  </div>

                  {/* SKU / Barcode */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">SKU</label>
                      <Controller control={control} name={`variants.${i}.sku`} render={({ field }) => (
                        <Input placeholder="SKU-001" {...field} />
                      )} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Barcode (optional)</label>
                      <Controller control={control} name={`variants.${i}.barcode`} render={({ field }) => (
                        <Input placeholder="6291234567890" {...field} />
                      )} />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pricing (AED)</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { name: `variants.${i}.mrp`,        label: "MRP"                            },
                        { name: `variants.${i}.sale_price`,  label: "Sale Price ✱"                  },
                        { name: `variants.${i}.cost_price`,  label: "Cost Price 🔒" },
                      ].map(({ name, label }) => (
                        <div key={name}>
                          <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
                          <Controller control={control} name={name as any} render={({ field }) => (
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              placeholder="0.00"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          )} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <MarginPill mrp={v?.mrp ?? ""} sale={v?.sale_price ?? ""} cost={v?.cost_price ?? ""} />
                    </div>
                  </div>

                  {/* Inventory */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inventory</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { name: `variants.${i}.stock_quantity`,    label: "Stock Qty ✱" },
                        { name: `variants.${i}.reorder_threshold`, label: "Reorder At"  },
                      ].map(({ name, label }) => (
                        <div key={name}>
                          <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
                          <Controller control={control} name={name as any} render={({ field }) => (
                            <Input
                              type="number"
                              min={0}
                              placeholder="0"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          )} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weight & Dimensions</p>
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                      {[
                        { name: `variants.${i}.weight_grams`, label: "Weight (g)"  },
                        { name: `variants.${i}.length_cm`,    label: "L (cm)"       },
                        { name: `variants.${i}.width_cm`,     label: "W (cm)"       },
                        { name: `variants.${i}.height_cm`,    label: "H (cm)"       },
                      ].map(({ name, label }) => (
                        <div key={name}>
                          <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
                          <Controller control={control} name={name as any} render={({ field }) => (
                            <Input
                              type="number"
                              min={0}
                              step={0.1}
                              placeholder="0"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          )} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active toggle */}
                  <Controller control={control} name={`variants.${i}.active`} render={({ field }) => (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-sm font-medium">{field.value ? "Active — visible to buyers" : "Inactive — hidden from buyers"}</span>
                    </label>
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add variant button */}
      {hasVariants && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed"
          onClick={() => {
            append({ ...DEFAULT_VARIANT } as any);
            setExpanded((prev) => new Set([...prev, fields.length]));
          }}
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      )}

      {/* Commission note */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        <span className="font-semibold">Platform commission: {PLATFORM_COMMISSION * 100}%</span> of sale price.
        Cost price is private and only used for margin calculation — never shown to buyers.
      </div>
    </div>
  );
}
