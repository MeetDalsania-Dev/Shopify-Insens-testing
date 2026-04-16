import { z } from 'zod';

// ── Reusable primitives ───────────────────────────────────────────────────────

const requiredStr = (msg: string) => z.string().min(1, msg);

// ── Per-step schemas ──────────────────────────────────────────────────────────

export const step1Schema = z.object({
  product_type:   requiredStr('Select a product type'),
  title:          z.string().min(3, 'Title must be at least 3 characters').max(200),
  brand_name:     z.string().optional().default(''),
  brand_id:       z.string().optional().default(''),
  category_id:    requiredStr('Select a category'),
  short_description: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Max 200 characters'),
  full_description: z.string().optional().default(''),
  tags:             z.array(z.string()).default([]),
  country_of_origin: z.string().optional().default(''),
  gender_target:    requiredStr('Select gender target'),
  // Branded-only fields (optional at schema level — enforced conditionally)
  brand_authorization_proof:     z.string().optional().nullable(),
  authorized_seller_declaration: z.boolean().optional(),
});

export const step2Schema = z.object({
  fragrance_family:   z.array(z.string()).min(1, 'Select at least one fragrance family'),
  concentration:      requiredStr('Select a concentration'),
  top_notes:          z.array(z.string()).default([]),
  middle_notes:       z.array(z.string()).default([]),
  base_notes:         z.array(z.string()).default([]),
  occasion_tags:      z.array(z.string()).default([]),
  season_tags:        z.array(z.string()).default([]),
  longevity_rating:   z.number().min(1).max(5),
  projection_rating:  z.number().min(1).max(5),
  scent_story:        z.string().optional().default(''),
  batch_number:       z.string().optional().default(''),
  formula_ref:        z.string().optional().default(''),
  handcrafted:        z.boolean().optional(),
  cruelty_free:       z.boolean().optional(),
  launch_year:        z.union([z.number(), z.literal('')]).optional(),
  edition_name:       z.string().optional().default(''),
  discontinued:       z.boolean().optional(),
});

const variantSchema = z.object({
  id:                z.string().optional(),
  variant_label:     z.string().optional().default(''),
  size:              requiredStr('Select size'),
  custom_size_ml:    z.string().optional().default(''),
  packaging:         requiredStr('Select packaging'),
  edition:           requiredStr('Select edition').default('standard'),
  sku:               z.string().optional().default(''),
  barcode:           z.string().optional().default(''),
  mrp:               z.union([z.number().min(0), z.literal('')]).optional(),
  sale_price:        z.union([
    z.number().min(0, 'Sale price must be positive'),
    z.literal(''),
  ]),
  cost_price:        z.union([z.number().min(0), z.literal('')]).optional(),
  stock_quantity:    z.union([z.number().int().min(0), z.literal('')]),
  reorder_threshold: z.union([z.number().int().min(0), z.literal('')]).optional(),
  weight_grams:      z.union([z.number().min(0), z.literal('')]).optional(),
  length_cm:         z.union([z.number().min(0), z.literal('')]).optional(),
  width_cm:          z.union([z.number().min(0), z.literal('')]).optional(),
  height_cm:         z.union([z.number().min(0), z.literal('')]).optional(),
  active:            z.boolean().default(true),
});

export const step3Schema = z.object({
  has_variants: z.boolean(),
  variants:     z.array(variantSchema).min(1, 'Add at least one variant'),
});

export const step4Schema = z.object({
  primary_image:   requiredStr('Primary image is required'),
  gallery_images:  z.array(z.object({
    url:        z.string(),
    name:       z.string().optional(),
    variantTag: z.string().optional(),
    order:      z.number(),
  })).default([]),
  lifestyle_shot:  z.string().optional().default(''),
  label_image:     z.string().optional().default(''),
  product_video:   z.string().optional().default(''),
  view_360:        z.string().optional().default(''),
});

export const step5Schema = z.object({
  fulfillment_type:        requiredStr('Select fulfilment type'),
  warehouse_id:            z.string().optional().default(''),
  track_inventory:         z.boolean(),
  allow_backorders:        z.boolean(),
  shipping_class:          z.string().optional().default('standard'),
  is_fragile:              z.boolean(),
  gift_wrapping_available: z.boolean(),
  free_shipping_eligible:  z.boolean(),
  custom_shipping_note:    z.string().optional().default(''),
  returnable:              z.boolean(),
  return_window_days:      z.union([z.number().int().min(1).max(365), z.literal('')]).optional(),
  return_conditions:       z.array(z.string()).default([]),
  warranty_note:           z.string().optional().default(''),
  authenticity_guaranteed: z.boolean().optional(),
  coa_reference:           z.string().optional().default(''),
  seal_condition:          z.string().optional().default(''),
});

// ── Combined full schema ──────────────────────────────────────────────────────

export const fullProductSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type FullProductFormValues = z.infer<typeof fullProductSchema>;
