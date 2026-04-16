// ── Enums ────────────────────────────────────────────────────────────────────

export type ProductType    = 'custom_perfume' | 'branded_perfume' | 'decant_sample' | 'gift_set';
export type GenderTarget   = 'men' | 'women' | 'unisex';
export type Concentration  = 'edt' | 'edp' | 'parfum' | 'extrait' | 'attar' | 'body_mist';
export type FulfillmentType = 'vendor_ships' | 'marketplace_warehouse';
export type ShippingClass  = 'standard' | 'express' | 'fragile' | 'gift_wrapped';
export type SealCondition  = 'factory_sealed' | 'opened_tester' | 'used';
export type ProductStatus  = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'active' | 'archived';

// ── Variant ──────────────────────────────────────────────────────────────────

export type VariantPackaging = 'full_bottle' | 'tester' | 'travel_size' | 'refill' | 'gift_set' | 'decant';
export type VariantEdition   = 'standard' | 'limited' | 'collector';

export interface ProductVariant {
  id?:                string;
  variant_label:      string;
  size:               string;
  packaging:          VariantPackaging;
  edition:            VariantEdition;
  sku:                string;
  barcode?:           string;
  mrp:                number | '';
  sale_price:         number | '';
  cost_price:         number | '';
  stock_quantity:     number | '';
  reorder_threshold:  number | '';
  weight_grams:       number | '';
  length_cm:          number | '';
  width_cm:           number | '';
  height_cm:          number | '';
  active:             boolean;
}

// ── Gallery image ─────────────────────────────────────────────────────────────

export interface GalleryImage {
  url:         string;         // data URL or remote URL
  name?:       string;
  variantTag?: string;         // optionally tagged to a variant_label
  order:       number;
}

// ── Full form data ────────────────────────────────────────────────────────────

export interface ProductListingFormData {
  // ── Step 1 — Basic Info ───────────────────────────────────────────────────
  product_type:                   ProductType;
  title:                          string;
  brand_name:                     string;
  brand_id?:                      string;
  category_id:                    string;
  short_description:              string;
  full_description:               string;
  tags:                           string[];
  country_of_origin:              string;
  gender_target:                  GenderTarget;
  // Branded only
  brand_authorization_proof?:     string;           // URL or data URL
  authorized_seller_declaration?: boolean;

  // ── Step 2 — Fragrance Details ────────────────────────────────────────────
  fragrance_family:               string[];
  concentration:                  Concentration | '';
  top_notes:                      string[];
  middle_notes:                   string[];
  base_notes:                     string[];
  occasion_tags:                  string[];
  season_tags:                    string[];
  longevity_rating:               number;
  projection_rating:              number;
  scent_story:                    string;
  // Custom perfume
  batch_number?:                  string;
  formula_ref?:                   string;
  handcrafted?:                   boolean;
  cruelty_free?:                  boolean;
  // Branded
  launch_year?:                   number | '';
  edition_name?:                  string;
  discontinued?:                  boolean;

  // ── Step 3 — Variants, Pricing & SKU ─────────────────────────────────────
  has_variants:                   boolean;
  variants:                       ProductVariant[];

  // ── Step 4 — Media ────────────────────────────────────────────────────────
  primary_image:                  string;
  gallery_images:                 GalleryImage[];
  lifestyle_shot:                 string;
  label_image:                    string;
  product_video:                  string;
  view_360:                       string;

  // ── Step 5 — Inventory, Shipping & Policies ───────────────────────────────
  fulfillment_type:               FulfillmentType;
  warehouse_id:                   string;
  track_inventory:                boolean;
  allow_backorders:               boolean;
  shipping_class:                 ShippingClass;
  is_fragile:                     boolean;
  gift_wrapping_available:        boolean;
  free_shipping_eligible:         boolean;
  custom_shipping_note:           string;
  returnable:                     boolean;
  return_window_days:             number | '';
  return_conditions:              string[];
  warranty_note:                  string;
  // Branded
  authenticity_guaranteed?:       boolean;
  coa_reference?:                 string;
  seal_condition?:                SealCondition | '';
}

// ── Step meta ─────────────────────────────────────────────────────────────────

export interface StepMeta {
  index:       number;   // 0-based
  label:       string;
  description: string;
  icon:        string;   // emoji shorthand
}

export const STEPS: StepMeta[] = [
  { index: 0, label: 'Basic Info',              description: 'Name, type, brand',          icon: '📦' },
  { index: 1, label: 'Fragrance Details',        description: 'Notes, family, ratings',     icon: '🌸' },
  { index: 2, label: 'Variants & Pricing',       description: 'SKUs, stock, margins',       icon: '💰' },
  { index: 3, label: 'Media',                    description: 'Images & video',             icon: '🖼️' },
  { index: 4, label: 'Inventory & Shipping',     description: 'Fulfilment, returns',        icon: '🚚' },
  { index: 5, label: 'Review & Submit',          description: 'Confirm and go live',        icon: '✅' },
];

// ── Step-to-fields map (for per-step validation triggers) ─────────────────────

export const STEP_REQUIRED_FIELDS: Record<number, (keyof ProductListingFormData)[]> = {
  0: ['product_type', 'title', 'category_id', 'short_description', 'gender_target'],
  1: ['fragrance_family', 'concentration'],
  2: ['variants'],
  3: ['primary_image'],
  4: ['fulfillment_type'],
  5: [],
};

// ── Default values ────────────────────────────────────────────────────────────

export const DEFAULT_VARIANT: ProductVariant = {
  variant_label:     '',
  size:              '',
  packaging:         'full_bottle',
  edition:           'standard',
  sku:               '',
  barcode:           '',
  mrp:               '',
  sale_price:        '',
  cost_price:        '',
  stock_quantity:    '',
  reorder_threshold: '',
  weight_grams:      '',
  length_cm:         '',
  width_cm:          '',
  height_cm:         '',
  active:            true,
};

export const FORM_DEFAULTS: ProductListingFormData = {
  product_type:          'branded_perfume',
  title:                 '',
  brand_name:            '',
  brand_id:              '',
  category_id:           '',
  short_description:     '',
  full_description:      '',
  tags:                  [],
  country_of_origin:     '',
  gender_target:         'unisex',
  fragrance_family:      [],
  concentration:         '',
  top_notes:             [],
  middle_notes:          [],
  base_notes:            [],
  occasion_tags:         [],
  season_tags:           [],
  longevity_rating:      3,
  projection_rating:     3,
  scent_story:           '',
  has_variants:          false,
  variants:              [{ ...DEFAULT_VARIANT }],
  primary_image:         '',
  gallery_images:        [],
  lifestyle_shot:        '',
  label_image:           '',
  product_video:         '',
  view_360:              '',
  fulfillment_type:      'vendor_ships',
  warehouse_id:          '',
  track_inventory:       true,
  allow_backorders:      false,
  shipping_class:        'standard',
  is_fragile:            true,
  gift_wrapping_available: false,
  free_shipping_eligible: false,
  custom_shipping_note:  '',
  returnable:            true,
  return_window_days:    7,
  return_conditions:     [],
  warranty_note:         '',
};
