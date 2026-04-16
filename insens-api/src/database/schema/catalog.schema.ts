import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { pgTable, uuid, varchar, text, numeric, integer, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { vendors } from './vendors.schema';
import { productStatusEnum, approvalStatusEnum, productTypeEnum, dataTypeEnum } from './enums';

export const brands = pgTable('brands', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        varchar('name', { length: 200 }).unique().notNull(),
  slug:        varchar('slug', { length: 200 }).unique().notNull(),
  description: text('description'),
  logoUrl:     text('logo_url'),
  isActive:    boolean('is_active').notNull().default(true),
});

export const categories = pgTable('categories', {
  id:       uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, { onDelete: 'set null' }),
  name:     varchar('name', { length: 100 }).notNull(),
  slug:     varchar('slug', { length: 100 }).unique().notNull(),
  level:    integer('level').notNull().default(1),
  path:     text('path'),           // e.g. "fragrances/woody/dark-oud"
  isActive: boolean('is_active').notNull().default(true),
});

export const products = pgTable('products', {
  id:               uuid('id').primaryKey().defaultRandom(),
  vendorId:         uuid('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  brandId:          uuid('brand_id').references(() => brands.id, { onDelete: 'set null' }),
  categoryId:       uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  slug:             varchar('slug', { length: 300 }).unique().notNull(),
  title:            varchar('title', { length: 255 }).notNull(),
  shortDescription: text('short_description'),
  description:      text('description'),
  status:           productStatusEnum('status').notNull().default('draft'),
  approvalStatus:   approvalStatusEnum('approval_status').notNull().default('pending_review'),
  productType:      productTypeEnum('product_type').notNull().default('simple'),
  listingType:      varchar('listing_type', { length: 50 }),
  tags:             text('tags'),
  productVideo:     text('product_video'),
  view360:          text('view_360'),
  taxClass:         varchar('tax_class', { length: 50 }),
  originCountry:    varchar('origin_country', { length: 100 }),
  hsCode:           varchar('hs_code', { length: 20 }),
  ratingAvg:        numeric('rating_avg', { precision: 3, scale: 2 }).notNull().default('0'),
  ratingCount:      integer('rating_count').notNull().default(0),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  approvedAt:       timestamp('approved_at', { withTimezone: true }),
});

export const productVariants = pgTable('product_variants', {
  id:           uuid('id').primaryKey().defaultRandom(),
  productId:    uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku:          varchar('sku', { length: 100 }).unique().notNull(),
  barcode:      varchar('barcode', { length: 100 }),
  title:        varchar('title', { length: 200 }),      // e.g. "50ml / EDP"
  mrp:          numeric('mrp', { precision: 12, scale: 2 }).notNull(),
  salePrice:    numeric('sale_price', { precision: 12, scale: 2 }).notNull(),
  costPrice:    numeric('cost_price', { precision: 12, scale: 2 }),
  currency:     varchar('currency', { length: 3 }).notNull().default('INR'),
  weightGrams:  numeric('weight_grams', { precision: 10, scale: 2 }),
  lengthCm:     numeric('length_cm', { precision: 10, scale: 2 }),
  widthCm:      numeric('width_cm', { precision: 10, scale: 2 }),
  heightCm:     numeric('height_cm', { precision: 10, scale: 2 }),
  sizeLabel:        varchar('size_label', { length: 50 }),
  packagingType:    varchar('packaging_type', { length: 50 }),
  editionType:      varchar('edition_type', { length: 50 }),
  reorderThreshold: integer('reorder_threshold').notNull().default(0),
  stock:        integer('stock').notNull().default(0),
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const productImages = pgTable('product_images', {
  id:         uuid('id').primaryKey().defaultRandom(),
  productId:  uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId:  uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
  imageUrl:   text('image_url').notNull(),
  altText:    varchar('alt_text', { length: 255 }),
  sortOrder:  integer('sort_order').notNull().default(0),
  isPrimary:  boolean('is_primary').notNull().default(false),
  imageType:  varchar('image_type', { length: 20 }).notNull().default('gallery'),
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const attributes = pgTable('attributes', {
  id:       uuid('id').primaryKey().defaultRandom(),
  code:     varchar('code', { length: 100 }).unique().notNull(),  // size_ml, concentration
  name:     varchar('name', { length: 100 }).notNull(),
  dataType: dataTypeEnum('data_type').notNull(),
});

export const attributeValues = pgTable('attribute_values', {
  id:            uuid('id').primaryKey().defaultRandom(),
  attributeId:   uuid('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade' }),
  valueText:     varchar('value_text', { length: 200 }).notNull(),
  sortOrder:     integer('sort_order').notNull().default(0),
});

export const variantAttributeMap = pgTable('variant_attribute_map', {
  variantId:         uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  attributeId:       uuid('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade' }),
  attributeValueId:  uuid('attribute_value_id').references(() => attributeValues.id, { onDelete: 'set null' }),
  rawValue:          varchar('raw_value', { length: 200 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.variantId, t.attributeId] }),
}));

export type Brand              = typeof brands.$inferSelect;
export type Category           = typeof categories.$inferSelect;
export type Product            = typeof products.$inferSelect;
export type NewProduct         = typeof products.$inferInsert;
export type ProductVariant     = typeof productVariants.$inferSelect;
export type NewProductVariant  = typeof productVariants.$inferInsert;
export type ProductImage       = typeof productImages.$inferSelect;
export type Attribute          = typeof attributes.$inferSelect;
export type AttributeValue     = typeof attributeValues.$inferSelect;
