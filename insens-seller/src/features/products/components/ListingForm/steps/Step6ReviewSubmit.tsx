"use client";

import { useFormContext } from "react-hook-form";
import { AlertTriangle, CheckCircle, Edit2, Image as ImageIcon, Package, Truck, Sparkles } from "lucide-react";
import Image from "next/image";
import { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import { Button } from "@/shared/components/ui/button";
import { Badge }  from "@/shared/components/ui/badge";
import { cn }     from "@/shared/lib/utils";

interface Step6ReviewSubmitProps {
  onGoToStep:     (step: number) => void;
  onSaveDraft:    () => void;
  onSubmit:       () => void;
  isSubmitting?:  boolean;
}

interface Warning { message: string; step: number; }

function getWarnings(values: FullProductFormValues): Warning[] {
  const w: Warning[] = [];
  if (!values.full_description)     w.push({ message: "Full description is empty",          step: 0 });
  if (!values.brand_name)            w.push({ message: "Brand name not set",                 step: 0 });
  if (!values.country_of_origin)     w.push({ message: "Country of origin not specified",    step: 0 });
  if (!values.scent_story)           w.push({ message: "Scent story not filled (optional)",  step: 1 });
  if (!values.lifestyle_shot)        w.push({ message: "No lifestyle image uploaded",         step: 3 });
  if (!values.label_image)           w.push({ message: "No label / ingredient image",         step: 3 });

  const hasVariantsWithCost = values.variants.some(
    (v) => v.cost_price === "" || v.cost_price === undefined || v.cost_price === null,
  );
  if (hasVariantsWithCost) w.push({ message: "Cost price missing on one or more variants (needed for margin)", step: 2 });

  const hasSKU = values.variants.every((v) => v.sku);
  if (!hasSKU) w.push({ message: "Some variants are missing SKUs",                         step: 2 });

  return w;
}

function SummaryCard({ title, icon: Icon, onEdit, step, children }: {
  title: string;
  icon: React.ElementType;
  onEdit: (step: number) => void;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </button>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right font-medium">{value}</span>
    </div>
  );
}

export function Step6ReviewSubmit({ onGoToStep, onSaveDraft, onSubmit, isSubmitting }: Step6ReviewSubmitProps) {
  const { watch } = useFormContext<FullProductFormValues>();
  const values    = watch() as FullProductFormValues;
  const warnings  = getWarnings(values);

  const productTypeLabel: Record<string, string> = {
    branded_perfume: "Branded Perfume",
    custom_perfume:  "Custom Perfume",
    decant_sample:   "Decant / Sample",
    gift_set:        "Gift Set / Bundle",
  };

  return (
    <div className="space-y-6">
      {/* Completeness checklist */}
      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
            <AlertTriangle className="h-4 w-4" />
            {warnings.length} recommendation{warnings.length > 1 ? "s" : ""} before you submit
          </div>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span className="text-xs text-amber-700">• {w.message}</span>
                <button
                  type="button"
                  onClick={() => onGoToStep(w.step)}
                  className="text-xs font-medium text-amber-800 underline underline-offset-2 hover:no-underline shrink-0"
                >
                  Fix →
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Ready to submit!</p>
            <p className="text-xs">All required fields are complete.</p>
          </div>
        </div>
      )}

      {/* Product identity */}
      <SummaryCard title="Product" icon={Package} onEdit={onGoToStep} step={0}>
        <div className="flex gap-4">
          {values.primary_image ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
              <Image src={values.primary_image} alt="Primary" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">{values.title || "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{values.brand_name || "No brand"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {values.product_type && <Badge variant="outline" className="text-xs">{productTypeLabel[values.product_type]}</Badge>}
              {values.concentration && <Badge variant="outline" className="text-xs uppercase">{values.concentration}</Badge>}
              {values.gender_target && <Badge variant="outline" className="text-xs capitalize">{values.gender_target}</Badge>}
            </div>
          </div>
        </div>
      </SummaryCard>

      {/* Fragrance summary */}
      <SummaryCard title="Fragrance" icon={Sparkles} onEdit={onGoToStep} step={1}>
        <div className="space-y-0.5">
          <KV label="Family" value={values.fragrance_family?.join(", ") || "—"} />
          <KV label="Top Notes"    value={values.top_notes?.join(", ")    || "—"} />
          <KV label="Middle Notes" value={values.middle_notes?.join(", ") || "—"} />
          <KV label="Base Notes"   value={values.base_notes?.join(", ")   || "—"} />
          <KV label="Longevity"    value={values.longevity_rating   ? `${values.longevity_rating}/5`   : undefined} />
          <KV label="Projection"   value={values.projection_rating  ? `${values.projection_rating}/5`  : undefined} />
        </div>
      </SummaryCard>

      {/* Variants table */}
      <SummaryCard title={`Variants (${values.variants?.length ?? 0})`} icon={Package} onEdit={onGoToStep} step={2}>
        {(values.variants ?? []).length > 0 ? (
          <div className="overflow-x-auto -mx-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">Label</th>
                  <th className="px-4 py-2 text-left font-medium">Size</th>
                  <th className="px-4 py-2 text-right font-medium">Sale Price</th>
                  <th className="px-4 py-2 text-right font-medium">Stock</th>
                  <th className="px-4 py-2 text-center font-medium">Active</th>
                </tr>
              </thead>
              <tbody>
                {values.variants.map((v, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 font-medium">{v.variant_label || `Variant ${i + 1}`}</td>
                    <td className="px-4 py-2 text-muted-foreground">{v.size || "—"}</td>
                    <td className="px-4 py-2 text-right font-mono">{v.sale_price || "—"} AED</td>
                    <td className="px-4 py-2 text-right">{v.stock_quantity ?? "—"}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={cn("inline-block h-2 w-2 rounded-full", v.active ? "bg-emerald-500" : "bg-border")} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No variants defined.</p>
        )}
      </SummaryCard>

      {/* Shipping summary */}
      <SummaryCard title="Shipping & Returns" icon={Truck} onEdit={onGoToStep} step={4}>
        <div className="space-y-0.5">
          <KV label="Fulfilment"      value={values.fulfillment_type === "vendor_ships" ? "Vendor Ships" : "Marketplace Warehouse"} />
          <KV label="Shipping Class"  value={values.shipping_class}  />
          <KV label="Returns"         value={values.returnable ? `Accepted (${values.return_window_days ?? "?"} days)` : "Not accepted"} />
          {values.authenticity_guaranteed !== undefined && (
            <KV label="Authenticity" value={values.authenticity_guaranteed ? "Guaranteed ✓" : "Not guaranteed"} />
          )}
        </div>
      </SummaryCard>

      {/* Status note */}
      <div className="rounded-xl border border-oud-200 bg-oud-50 px-4 py-3 text-sm text-oud-700">
        <p className="font-semibold">Submitting for review</p>
        <p className="text-xs mt-0.5">Your product will be set to <strong>pending review</strong>. The Insens team will review it within 1–2 business days. You'll be notified once approved or if changes are required.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onSaveDraft} disabled={isSubmitting}>
          Save as Draft
        </Button>
        <Button
          type="button"
          className="bg-oud-800 hover:bg-oud-700 text-cream-50 sm:min-w-[180px]"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting…" : "Submit for Review →"}
        </Button>
      </div>
    </div>
  );
}
