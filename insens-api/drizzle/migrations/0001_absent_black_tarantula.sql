ALTER TYPE "approval_status" ADD VALUE 'waiting';--> statement-breakpoint
ALTER TYPE "concentration" ADD VALUE 'attar';--> statement-breakpoint
ALTER TYPE "concentration" ADD VALUE 'body_mist';--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "currency" SET DATA TYPE varchar(3);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "origin_country" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "perfume_details" ALTER COLUMN "fragrance_family" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "image_type" varchar(20) DEFAULT 'gallery' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "size_label" varchar(50);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "packaging_type" varchar(50);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "edition_type" varchar(50);--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "reorder_threshold" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "listing_type" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_video" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "view_360" text;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "scent_story" text;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "handcrafted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "cruelty_free" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "launch_year" integer;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "edition_name" varchar(100);--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "discontinued" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "batch_number" varchar(100);--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "formula_ref" varchar(100);--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "brand_authorization_proof" text;--> statement-breakpoint
ALTER TABLE "perfume_details" ADD COLUMN "authorized_seller_declaration" boolean DEFAULT false;