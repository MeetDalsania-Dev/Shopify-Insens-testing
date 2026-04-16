"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import { ButtonSelector } from "../shared/ButtonSelector";
import { SectionCard }    from "../SectionCard";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription,
} from "@/shared/components/ui/form";
import { Input }    from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch }   from "@/shared/components/ui/switch";
import { Checkbox }  from "@/shared/components/ui/checkbox";

const FULFILLMENT_OPTIONS = [
  {
    value: "vendor_ships",
    label: "Vendor Ships",
    icon: "📦",
    description: "You handle packing & dispatch",
  },
  {
    value: "marketplace_warehouse",
    label: "Marketplace Warehouse",
    icon: "🏭",
    description: "Send stock to Insens fulfilment",
  },
] as const;

const SHIPPING_CLASSES = [
  { value: "standard",     label: "Standard"     },
  { value: "express",      label: "Express"      },
  { value: "fragile",      label: "Fragile"      },
  { value: "gift_wrapped", label: "Gift Wrapped" },
] as const;

const SEAL_CONDITIONS = [
  { value: "factory_sealed",  label: "Factory Sealed"  },
  { value: "opened_tester",   label: "Opened / Tester" },
  { value: "used",            label: "Used"            },
] as const;

const RETURN_CONDITIONS = [
  { value: "unopened_only", label: "Unopened only" },
  { value: "damaged_only",  label: "Damaged / Defective only" },
  { value: "any_reason",    label: "Any reason" },
];

function ToggleRow({ children, label, hint }: { children: React.ReactNode; label: string; hint?: string }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer rounded-lg border border-border px-4 py-3 hover:bg-oud-50 transition-colors">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {children}
    </label>
  );
}

export function Step5InventoryShipping() {
  const { control, watch, formState: { errors } } = useFormContext<FullProductFormValues>();
  const productType = watch("product_type");
  const isBranded   = productType === "branded_perfume";
  const returnable  = watch("returnable");

  return (
    <div className="space-y-6">
      {/* Fulfilment */}
      <SectionCard title="Fulfilment" required>
        <Controller
          control={control}
          name="fulfillment_type"
          render={({ field, fieldState }) => (
            <ButtonSelector
              options={FULFILLMENT_OPTIONS as any}
              value={field.value}
              onChange={field.onChange}
              columns={2}
              error={fieldState.error?.message}
            />
          )}
        />
      </SectionCard>

      {/* Inventory settings */}
      <SectionCard title="Inventory Settings">
        <div className="space-y-2">
          <Controller control={control} name="track_inventory" render={({ field }) => (
            <ToggleRow label="Track Inventory" hint="Automatically lower stock count when orders are placed.">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </ToggleRow>
          )} />
          <Controller control={control} name="allow_backorders" render={({ field }) => (
            <ToggleRow label="Allow Backorders" hint="Let buyers order even when stock reaches 0.">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </ToggleRow>
          )} />
        </div>
      </SectionCard>

      {/* Shipping */}
      <SectionCard title="Shipping">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Shipping Class</p>
            <Controller control={control} name="shipping_class" render={({ field }) => (
              <ButtonSelector
                options={SHIPPING_CLASSES as any}
                value={field.value}
                onChange={field.onChange}
                columns={4}
                size="sm"
              />
            )} />
          </div>

          <div className="space-y-2">
            <Controller control={control} name="is_fragile" render={({ field }) => (
              <ToggleRow label="Fragile Item" hint="Requires extra padding — additional handling fee may apply.">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </ToggleRow>
            )} />
            <Controller control={control} name="gift_wrapping_available" render={({ field }) => (
              <ToggleRow label="Gift Wrapping Available" hint="Buyers can request gift wrapping at checkout.">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </ToggleRow>
            )} />
            <Controller control={control} name="free_shipping_eligible" render={({ field }) => (
              <ToggleRow label="Free Shipping Eligible" hint="This product qualifies for free shipping promotions.">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </ToggleRow>
            )} />
          </div>

          <FormField control={control} name="custom_shipping_note" render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Shipping Note</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="e.g. Ships within 3–5 business days in temperature-controlled packaging." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </SectionCard>

      {/* Returns */}
      <SectionCard title="Returns & Warranty">
        <div className="space-y-4">
          <Controller control={control} name="returnable" render={({ field }) => (
            <ToggleRow label="Returns Accepted" hint="Enable return requests for this product.">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </ToggleRow>
          )} />

          {returnable && (
            <>
              <FormField control={control} name="return_window_days" render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Window (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      placeholder="7"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="max-w-[140px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div>
                <p className="mb-2 text-sm font-medium">Return Conditions</p>
                <div className="space-y-2">
                  <Controller control={control} name="return_conditions" render={({ field }) => (
                    <>
                      {RETURN_CONDITIONS.map((rc) => (
                        <label key={rc.value} className="flex items-center gap-3 cursor-pointer rounded-lg border border-border px-4 py-2.5 hover:bg-oud-50 transition-colors">
                          <Checkbox
                            checked={(field.value ?? []).includes(rc.value)}
                            onCheckedChange={(checked: boolean | 'indeterminate') => {
                              const current = field.value ?? [];
                              field.onChange(
                                checked === true
                                  ? [...current, rc.value]
                                  : current.filter((v) => v !== rc.value),
                              );
                            }}
                          />
                          <span className="text-sm">{rc.label}</span>
                        </label>
                      ))}
                    </>
                  )} />
                </div>
              </div>
            </>
          )}

          <FormField control={control} name="warranty_note" render={({ field }) => (
            <FormItem>
              <FormLabel>Warranty Note</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="e.g. Manufacturer warranty — 12 months against defects." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </SectionCard>

      {/* Branded: authenticity */}
      {isBranded && (
        <SectionCard title="Authenticity & Condition" badge="Branded Only" badgeVariant="warning">
          <div className="space-y-4">
            <Controller control={control} name="authenticity_guaranteed" render={({ field }) => (
              <ToggleRow label="Authenticity Guaranteed" hint="Confirm all units are genuine brand products.">
                <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
              </ToggleRow>
            )} />

            <FormField control={control} name="coa_reference" render={({ field }) => (
              <FormItem>
                <FormLabel>COA / Certificate Reference</FormLabel>
                <FormControl>
                  <Input placeholder="Certificate number or URL" {...field} />
                </FormControl>
                <FormDescription>Certificate of Authenticity number or document link.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <div>
              <p className="mb-2 text-sm font-medium">Seal Condition</p>
              <Controller control={control} name="seal_condition" render={({ field }) => (
                <ButtonSelector
                  options={SEAL_CONDITIONS as any}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  columns={3}
                  size="sm"
                />
              )} />
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
