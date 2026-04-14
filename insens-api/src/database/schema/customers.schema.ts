import { pgTable, uuid, varchar, boolean, integer, numeric, timestamp, text, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { products } from './catalog.schema';
import { productVariants } from './catalog.schema';
import { vendors } from './vendors.schema';

export const customers = pgTable('customers', {
  userId:            uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  customerCode:      varchar('customer_code', { length: 30 }).unique(),
  acquisitionSource: varchar('acquisition_source', { length: 100 }),
  status:            varchar('status', { length: 20 }).notNull().default('active'),
  totalOrders:       integer('total_orders').notNull().default(0),
  totalSpent:        numeric('total_spent', { precision: 12, scale: 2 }).notNull().default('0'),
  lastOrderAt:       timestamp('last_order_at', { withTimezone: true }),
  lastSeenAt:        timestamp('last_seen_at', { withTimezone: true }),
  createdAt:         timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const customerPreferences = pgTable('customer_preferences', {
  customerId:             uuid('customer_id').primaryKey().references(() => customers.userId, { onDelete: 'cascade' }),
  favoriteCategories:     text('favorite_categories'),
  favoriteBrands:         text('favorite_brands'),
  communicationEmail:     boolean('communication_email').notNull().default(true),
  communicationSms:       boolean('communication_sms').notNull().default(false),
  communicationWhatsapp:  boolean('communication_whatsapp').notNull().default(false),
});

export const wishlists = pgTable('wishlists', {
  id:         uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.userId, { onDelete: 'cascade' }),
  name:       varchar('name', { length: 100 }).notNull().default('Default'),
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const wishlistItems = pgTable('wishlist_items', {
  wishlistId: uuid('wishlist_id').notNull().references(() => wishlists.id, { onDelete: 'cascade' }),
  productId:  uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  addedAt:    timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.wishlistId, t.productId] }),
}));

export const carts = pgTable('carts', {
  id:             uuid('id').primaryKey().defaultRandom(),
  customerId:     uuid('customer_id').references(() => customers.userId, { onDelete: 'set null' }),
  sessionId:      varchar('session_id', { length: 100 }),
  currency:       varchar('currency', { length: 3 }).notNull().default('INR'),
  couponCode:     varchar('coupon_code', { length: 50 }),
  subtotal:       numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  discountTotal:  numeric('discount_total', { precision: 12, scale: 2 }).notNull().default('0'),
  taxTotal:       numeric('tax_total', { precision: 12, scale: 2 }).notNull().default('0'),
  shippingTotal:  numeric('shipping_total', { precision: 12, scale: 2 }).notNull().default('0'),
  grandTotal:     numeric('grand_total', { precision: 12, scale: 2 }).notNull().default('0'),
  expiresAt:      timestamp('expires_at', { withTimezone: true }),
  createdAt:      timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:      timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable('cart_items', {
  id:         uuid('id').primaryKey().defaultRandom(),
  cartId:     uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  variantId:  uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  vendorId:   uuid('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  quantity:   integer('quantity').notNull(),
  unitPrice:  numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  lineTotal:  numeric('line_total', { precision: 12, scale: 2 }).notNull(),
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Customer            = typeof customers.$inferSelect;
export type CustomerPreference  = typeof customerPreferences.$inferSelect;
export type Wishlist            = typeof wishlists.$inferSelect;
export type Cart                = typeof carts.$inferSelect;
export type CartItem            = typeof cartItems.$inferSelect;
