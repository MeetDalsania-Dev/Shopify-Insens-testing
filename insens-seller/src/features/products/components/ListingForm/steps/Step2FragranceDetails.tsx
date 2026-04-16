"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import { ButtonSelector } from "../shared/ButtonSelector";
import { ChipSelector }   from "../shared/ChipSelector";
import { TagInput }       from "../shared/TagInput";
import { SliderRating }   from "../shared/SliderRating";
import { SectionCard }    from "../SectionCard";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription,
} from "@/shared/components/ui/form";
import { Input }    from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch }   from "@/shared/components/ui/switch";

const FRAGRANCE_FAMILIES = [
  { value: "floral",    label: "Floral",    emoji: "🌸" },
  { value: "woody",     label: "Woody",     emoji: "🌲" },
  { value: "oriental",  label: "Oriental",  emoji: "🌙" },
  { value: "fresh",     label: "Fresh",     emoji: "💨" },
  { value: "citrus",    label: "Citrus",    emoji: "🍋" },
  { value: "gourmand",  label: "Gourmand",  emoji: "🍫" },
  { value: "chypre",    label: "Chypre",    emoji: "🪨" },
  { value: "fougere",   label: "Fougère",   emoji: "🌿" },
];

const CONCENTRATIONS = [
  { value: "edt",       label: "EDT",       description: "Eau de Toilette" },
  { value: "edp",       label: "EDP",       description: "Eau de Parfum" },
  { value: "parfum",    label: "Parfum",    description: "Pure Perfume" },
  { value: "extrait",   label: "Extrait",   description: "Extrait de Parfum" },
  { value: "attar",     label: "Attar",     description: "Oil-based" },
  { value: "body_mist", label: "Body Mist", description: "Light mist" },
] as const;

const OCCASIONS = [
  { value: "daily",    label: "Daily",    emoji: "☀️" },
  { value: "office",   label: "Office",   emoji: "💼" },
  { value: "evening",  label: "Evening",  emoji: "🌆" },
  { value: "wedding",  label: "Wedding",  emoji: "💍" },
  { value: "party",    label: "Party",    emoji: "🎉" },
  { value: "outdoor",  label: "Outdoor",  emoji: "🌿" },
];

const SEASONS = [
  { value: "spring",     label: "Spring",     emoji: "🌱" },
  { value: "summer",     label: "Summer",     emoji: "🌞" },
  { value: "autumn",     label: "Autumn",     emoji: "🍂" },
  { value: "winter",     label: "Winter",     emoji: "❄️" },
  { value: "all_season", label: "All Season", emoji: "🔄" },
];

const NOTE_SUGGESTIONS = [
  // Top
  "Bergamot", "Lemon", "Orange", "Grapefruit", "Lime", "Neroli", "Petitgrain",
  "Pepper", "Cardamom", "Ginger", "Aldehydes",
  // Middle
  "Rose", "Jasmine", "Geranium", "Iris", "Violet", "Ylang Ylang", "Peony",
  "Tuberose", "Lavender", "Cedarwood", "Cinnamon",
  // Base
  "Sandalwood", "Vetiver", "Patchouli", "Musk", "Amber", "Vanilla", "Benzoin",
  "Labdanum", "Oud", "Tonka Bean", "Oakmoss", "Civet", "Leather",
];

const LONGEVITY_LABELS: Record<number, string> = {
  1: "2–3 hours", 2: "3–5 hours", 3: "5–7 hours", 4: "7–10 hours", 5: "10+ hours",
};
const PROJECTION_LABELS: Record<number, string> = {
  1: "Skin scent", 2: "Close", 3: "Moderate", 4: "Strong", 5: "Beast mode",
};

export function Step2FragranceDetails() {
  const { control, watch } = useFormContext<FullProductFormValues>();
  const productType = watch("product_type");
  const isCustom   = productType === "custom_perfume";
  const isBranded  = productType === "branded_perfume";

  return (
    <div className="space-y-6">
      {/* Fragrance family */}
      <SectionCard title="Fragrance Family" required>
        <Controller
          control={control}
          name="fragrance_family"
          render={({ field, fieldState }) => (
            <ChipSelector
              options={FRAGRANCE_FAMILIES}
              value={field.value ?? []}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </SectionCard>

      {/* Concentration */}
      <SectionCard title="Concentration" required>
        <Controller
          control={control}
          name="concentration"
          render={({ field, fieldState }) => (
            <ButtonSelector
              options={CONCENTRATIONS as any}
              value={field.value}
              onChange={field.onChange}
              columns={3}
              size="sm"
              error={fieldState.error?.message}
            />
          )}
        />
      </SectionCard>

      {/* Notes */}
      <SectionCard title="Fragrance Notes">
        <div className="space-y-4">
          {(["top_notes", "middle_notes", "base_notes"] as const).map((field) => (
            <Controller key={field} control={control} name={field} render={({ field: f }) => (
              <div>
                <p className="mb-1.5 text-sm font-medium capitalize">
                  {field.replace("_notes", "").replace("_", " ")} Notes
                </p>
                <TagInput
                  value={f.value ?? []}
                  onChange={f.onChange}
                  placeholder={`Add ${field.replace("_notes", "").replace("_", " ")} notes…`}
                  suggestions={NOTE_SUGGESTIONS}
                />
              </div>
            )} />
          ))}
        </div>
      </SectionCard>

      {/* Occasion + Season */}
      <SectionCard title="Occasion & Season">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Occasion Tags</p>
            <Controller control={control} name="occasion_tags" render={({ field }) => (
              <ChipSelector options={OCCASIONS} value={field.value ?? []} onChange={field.onChange} />
            )} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Season Tags</p>
            <Controller control={control} name="season_tags" render={({ field }) => (
              <ChipSelector options={SEASONS} value={field.value ?? []} onChange={field.onChange} />
            )} />
          </div>
        </div>
      </SectionCard>

      {/* Ratings */}
      <SectionCard title="Performance Ratings">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium">Longevity</p>
            <Controller control={control} name="longevity_rating" render={({ field }) => (
              <SliderRating value={field.value} onChange={field.onChange} labels={LONGEVITY_LABELS} />
            )} />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Projection / Sillage</p>
            <Controller control={control} name="projection_rating" render={({ field }) => (
              <SliderRating value={field.value} onChange={field.onChange} labels={PROJECTION_LABELS} />
            )} />
          </div>
        </div>
      </SectionCard>

      {/* Scent story */}
      <SectionCard title="Scent Story">
        <FormField control={control} name="scent_story" render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea rows={4} placeholder="Paint a picture with words — the emotion, memory or journey this fragrance evokes…" {...field} />
            </FormControl>
            <FormDescription>Optional. Used in editorial / catalogue views.</FormDescription>
          </FormItem>
        )} />
      </SectionCard>

      {/* Custom perfume extras */}
      {isCustom && (
        <SectionCard title="Custom Batch Details" badge="Custom Only" badgeVariant="info">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={control} name="batch_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Number</FormLabel>
                <FormControl><Input placeholder="BATCH-2024-001" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={control} name="formula_ref" render={({ field }) => (
              <FormItem>
                <FormLabel>Formula Reference <span className="text-muted-foreground text-xs">(private)</span></FormLabel>
                <FormControl><Input placeholder="FORM-XXX" {...field} /></FormControl>
                <FormDescription>Only visible to you — never shown to buyers.</FormDescription>
              </FormItem>
            )} />
            {(["handcrafted", "cruelty_free"] as const).map((name) => (
              <Controller key={name} control={control} name={name} render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  <span className="text-sm font-medium capitalize">{name.replace("_", " ")}</span>
                </label>
              )} />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Branded extras */}
      {isBranded && (
        <SectionCard title="Edition Details" badge="Branded Only" badgeVariant="warning">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={control} name="edition_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Edition Name</FormLabel>
                <FormControl><Input placeholder="e.g. Limited Holiday Edition" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={control} name="launch_year" render={({ field }) => (
              <FormItem>
                <FormLabel>Launch Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2024"
                    min={1900}
                    max={new Date().getFullYear() + 2}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                  />
                </FormControl>
              </FormItem>
            )} />
            <Controller control={control} name="discontinued" render={({ field }) => (
              <label className="flex items-center gap-3 cursor-pointer col-span-2">
                <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                <div>
                  <span className="text-sm font-medium">Discontinued</span>
                  <p className="text-xs text-muted-foreground">Mark if this product is no longer in production.</p>
                </div>
              </label>
            )} />
          </div>
        </SectionCard>
      )}
    </div>
  );
}
