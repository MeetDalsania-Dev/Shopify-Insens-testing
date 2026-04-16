import { pgEnum } from 'drizzle-orm/pg-core';

export const userStatusEnum       = pgEnum('user_status',       ['active', 'suspended', 'deleted', 'pending_verification']);
export const authProviderEnum     = pgEnum('auth_provider',     ['local', 'google', 'apple']);
export const vendorStatusEnum     = pgEnum('vendor_status',     ['pending', 'active', 'suspended', 'rejected']);
export const approvalStatusEnum   = pgEnum('approval_status',   ['pending_review', 'approved', 'rejected', 'waiting']);
export const commissionTypeEnum   = pgEnum('commission_type',   ['flat', 'percentage', 'hybrid']);
export const businessTypeEnum     = pgEnum('business_type',     ['sole_prop', 'llp', 'pvt_ltd', 'individual']);
export const vendorRoleEnum       = pgEnum('vendor_role',       ['owner', 'manager', 'catalog_manager', 'order_manager', 'support']);
export const docTypeEnum          = pgEnum('doc_type',          ['gst', 'pan', 'coa', 'identity', 'bank_proof']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'verified', 'rejected']);
export const addressTypeEnum      = pgEnum('address_type',      ['billing', 'shipping', 'both']);
export const productStatusEnum    = pgEnum('product_status',    ['draft', 'pending_review', 'active', 'archived', 'rejected']);
export const productTypeEnum      = pgEnum('product_type',      ['simple', 'variant', 'bundle']);
export const genderTargetEnum     = pgEnum('gender_target',     ['men', 'women', 'unisex']);
export const concentrationEnum    = pgEnum('concentration',     ['edt', 'edp', 'parfum', 'extrait', 'attar', 'body_mist']);
export const fragranceFamilyEnum  = pgEnum('fragrance_family',  ['woody', 'floral', 'oriental', 'fresh', 'citrus', 'aquatic', 'gourmand']);
export const dataTypeEnum         = pgEnum('data_type',         ['text', 'number', 'boolean', 'enum']);
