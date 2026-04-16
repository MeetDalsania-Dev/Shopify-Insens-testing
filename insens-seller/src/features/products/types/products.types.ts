export interface Category {
  id:   string;
  name: string;
  slug: string;
}

export interface Product {
  id:          string;
  vendorId?:   string;
  shopId?:     string;
  categoryId:  string | null;
  category:    Category | null;
  title:       string;
  name:        string;        // alias for title — kept for backward compat
  description: string | null;
  price?:      string | number;
  stock?:      number;
  images?:     string[];
  isActive?:   boolean;
  status?:     string;
  createdAt:   string;
  updatedAt:   string;
}

// ── Perfume details payload ────────────────────────────────────────────────────

export interface CreatePerfumeDetailsPayload {
  fragranceFamily?:             string;   // comma-separated
  concentration?:               string;
  genderTarget?:                string;
  topNotes?:                    string;   // comma-separated
  middleNotes?:                 string;
  baseNotes?:                   string;
  occasionTags?:                string;   // comma-separated
  seasonTags?:                  string;
  longevityScore?:              string;
  projectionScore?:             string;
  scentStory?:                  string;
  handcrafted?:                 boolean;
  crueltyFree?:                 boolean;
  launchYear?:                  number;
  editionName?:                 string;
  discontinued?:                boolean;
  batchNumber?:                 string;
  formulaRef?:                  string;
  brandAuthorizationProof?:     string;
  authorizedSellerDeclaration?: boolean;
}

// ── Variant payload ────────────────────────────────────────────────────────────

export interface CreateVariantPayload {
  sku:               string;
  barcode?:          string;
  title?:            string;
  sizeLabel?:        string;
  packagingType?:    string;
  editionType?:      string;
  mrp:               string;
  salePrice:         string;
  costPrice?:        string;
  stock?:            number;
  reorderThreshold?: number;
  weightGrams?:      string;
  lengthCm?:         string;
  widthCm?:          string;
  heightCm?:         string;
  isActive?:         boolean;
}

// ── Product payload ────────────────────────────────────────────────────────────

export interface CreateProductPayload {
  title:             string;
  slug:              string;
  shortDescription?: string;
  description?:      string;
  productType?:      'simple' | 'variant' | 'bundle';
  listingType?:      string;
  categoryId?:       string;
  brandId?:          string;
  originCountry?:    string;
  tags?:             string;   // JSON-stringified string[]
  productVideo?:     string;
  view360?:          string;
  status?:           'draft' | 'pending_review';
  perfumeDetails?:   CreatePerfumeDetailsPayload;
  variants?:         CreateVariantPayload[];
}

export type UpdateProductPayload = Partial<Omit<CreateProductPayload, 'variants' | 'perfumeDetails'> & { isActive: boolean }>;
