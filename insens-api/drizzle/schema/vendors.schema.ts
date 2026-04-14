import { pgTable, uuid, varchar, text, numeric, integer, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import {
  vendorStatusEnum, approvalStatusEnum, commissionTypeEnum,
  businessTypeEnum, vendorRoleEnum, docTypeEnum, verificationStatusEnum,
} from './enums';

export const vendors = pgTable('vendors', {
  id:               uuid('id').primaryKey().defaultRandom(),
  slug:             varchar('slug', { length: 255 }).unique().notNull(),
  legalName:        varchar('legal_name', { length: 255 }).notNull(),
  displayName:      varchar('display_name', { length: 255 }).notNull(),
  email:            varchar('email', { length: 255 }),
  phone:            varchar('phone', { length: 30 }),
  status:           vendorStatusEnum('status').notNull().default('pending'),
  approvalStatus:   approvalStatusEnum('approval_status').notNull().default('pending_review'),
  commissionType:   commissionTypeEnum('commission_type').notNull().default('percentage'),
  commissionRate:   numeric('commission_rate', { precision: 5, scale: 2 }),
  gstVatNumber:     varchar('gst_vat_number', { length: 50 }),
  businessType:     businessTypeEnum('business_type'),
  logoUrl:          text('logo_url'),
  bannerUrl:        text('banner_url'),
  description:      text('description'),
  ratingAvg:        numeric('rating_avg', { precision: 3, scale: 2 }).notNull().default('0'),
  ratingCount:      integer('rating_count').notNull().default(0),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  approvedAt:       timestamp('approved_at', { withTimezone: true }),
  suspendedAt:      timestamp('suspended_at', { withTimezone: true }),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const vendorUsers = pgTable('vendor_users', {
  vendorId:   uuid('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role:       vendorRoleEnum('role').notNull().default('owner'),
  status:     varchar('status', { length: 20 }).notNull().default('active'),
  invitedAt:  timestamp('invited_at', { withTimezone: true }),
  joinedAt:   timestamp('joined_at', { withTimezone: true }),
}, (t) => ({
  pk: primaryKey({ columns: [t.vendorId, t.userId] }),
}));

export const vendorDocuments = pgTable('vendor_documents', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  vendorId:           uuid('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  docType:            docTypeEnum('doc_type').notNull(),
  fileUrl:            text('file_url').notNull(),
  verificationStatus: verificationStatusEnum('verification_status').notNull().default('pending'),
  verifiedBy:         uuid('verified_by').references(() => users.id, { onDelete: 'set null' }),
  verifiedAt:         timestamp('verified_at', { withTimezone: true }),
  remarks:            text('remarks'),
  createdAt:          timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const vendorPayoutAccounts = pgTable('vendor_payout_accounts', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  vendorId:             uuid('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  accountHolderName:    varchar('account_holder_name', { length: 200 }).notNull(),
  bankName:             varchar('bank_name', { length: 100 }),
  accountNumberMasked:  varchar('account_number_masked', { length: 30 }),
  ifscSwift:            varchar('ifsc_swift', { length: 20 }),
  upiId:                varchar('upi_id', { length: 100 }),
  provider:             varchar('provider', { length: 50 }),
  isDefault:            boolean('is_default').notNull().default(true),
  status:               varchar('status', { length: 20 }).notNull().default('active'),
  createdAt:            timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const vendorWallets = pgTable('vendor_wallets', {
  vendorId:         uuid('vendor_id').primaryKey().references(() => vendors.id, { onDelete: 'cascade' }),
  currentBalance:   numeric('current_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  payableBalance:   numeric('payable_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  holdBalance:      numeric('hold_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Vendor              = typeof vendors.$inferSelect;
export type NewVendor           = typeof vendors.$inferInsert;
export type VendorUser          = typeof vendorUsers.$inferSelect;
export type VendorDocument      = typeof vendorDocuments.$inferSelect;
export type VendorPayoutAccount = typeof vendorPayoutAccounts.$inferSelect;
export type VendorWallet        = typeof vendorWallets.$inferSelect;
