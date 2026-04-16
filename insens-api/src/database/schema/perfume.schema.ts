import { pgTable, uuid, varchar, text, numeric, boolean, integer } from 'drizzle-orm/pg-core';
import { products } from './catalog.schema';
import { concentrationEnum, genderTargetEnum } from './enums';

export const perfumeDetails = pgTable('perfume_details', {
  productId:                   uuid('product_id').primaryKey().references(() => products.id, { onDelete: 'cascade' }),
  fragranceFamily:             text('fragrance_family'),           // comma-separated: "woody,floral"
  concentration:               concentrationEnum('concentration'),
  genderTarget:                genderTargetEnum('gender_target'),
  topNotes:                    text('top_notes'),                  // comma-separated
  middleNotes:                 text('middle_notes'),
  baseNotes:                   text('base_notes'),
  occasionTags:                text('occasion_tags'),              // comma-separated
  seasonTags:                  text('season_tags'),
  longevityScore:              numeric('longevity_score',  { precision: 3, scale: 1 }),
  projectionScore:             numeric('projection_score', { precision: 3, scale: 1 }),
  scentStory:                  text('scent_story'),
  handcrafted:                 boolean('handcrafted').default(false),
  crueltyFree:                 boolean('cruelty_free').default(false),
  launchYear:                  integer('launch_year'),
  editionName:                 varchar('edition_name', { length: 100 }),
  discontinued:                boolean('discontinued').default(false),
  batchNumber:                 varchar('batch_number', { length: 100 }),
  formulaRef:                  varchar('formula_ref', { length: 100 }),
  brandAuthorizationProof:     text('brand_authorization_proof'),
  authorizedSellerDeclaration: boolean('authorized_seller_declaration').default(false),
  authenticityRequired:        boolean('authenticity_required').notNull().default(false),
  batchTrackingEnabled:        boolean('batch_tracking_enabled').notNull().default(false),
});

export type PerfumeDetail    = typeof perfumeDetails.$inferSelect;
export type NewPerfumeDetail = typeof perfumeDetails.$inferInsert;
