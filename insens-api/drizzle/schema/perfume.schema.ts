import { pgTable, uuid, varchar, text, numeric, boolean } from 'drizzle-orm/pg-core';
import { products } from './catalog.schema';
import { fragranceFamilyEnum, concentrationEnum, genderTargetEnum } from './enums';

export const perfumeDetails = pgTable('perfume_details', {
  productId:              uuid('product_id').primaryKey().references(() => products.id, { onDelete: 'cascade' }),
  fragranceFamily:        fragranceFamilyEnum('fragrance_family'),
  concentration:          concentrationEnum('concentration'),
  genderTarget:           genderTargetEnum('gender_target'),
  topNotes:               text('top_notes'),
  middleNotes:            text('middle_notes'),
  baseNotes:              text('base_notes'),
  occasionTags:           text('occasion_tags'),
  seasonTags:             text('season_tags'),
  longevityScore:         numeric('longevity_score', { precision: 3, scale: 1 }),
  projectionScore:        numeric('projection_score', { precision: 3, scale: 1 }),
  authenticityRequired:   boolean('authenticity_required').notNull().default(false),
  batchTrackingEnabled:   boolean('batch_tracking_enabled').notNull().default(false),
});

export type PerfumeDetail    = typeof perfumeDetails.$inferSelect;
export type NewPerfumeDetail = typeof perfumeDetails.$inferInsert;
