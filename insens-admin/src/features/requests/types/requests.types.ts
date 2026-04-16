// Matches API vendor status enum
export type VendorStatus         = 'pending' | 'active' | 'suspended' | 'rejected';
// Matches API approval status enum (including new 'waiting')
export type VendorApprovalStatus = 'pending_review' | 'approved' | 'rejected' | 'waiting';

// Derived display status for the UI (computed from approvalStatus + status)
export type DisplayStatus = 'pending' | 'approved' | 'rejected' | 'waiting' | 'suspended';

/** Derive a single display status from the two API status fields. */
export function resolveDisplayStatus(
  status: VendorStatus,
  approvalStatus: VendorApprovalStatus,
): DisplayStatus {
  if (status === 'suspended')              return 'suspended';
  if (approvalStatus === 'approved')       return 'approved';
  if (approvalStatus === 'rejected')       return 'rejected';
  if (approvalStatus === 'waiting')        return 'waiting';
  return 'pending'; // pending_review
}

export interface VendorOwner {
  id:        string;
  email:     string | null;
  firstName: string | null;
  lastName:  string | null;
  createdAt: string;
}

/** Shape returned by GET /api/v1/admin/vendors (with owner join) */
export interface VendorRequest {
  id:             string;
  slug:           string;
  legalName:      string;
  displayName:    string;
  email:          string | null;
  phone:          string | null;
  status:         VendorStatus;
  approvalStatus: VendorApprovalStatus;
  logoUrl:        string | null;
  description:    string | null;
  createdAt:      string;
  approvedAt:     string | null;
  suspendedAt:    string | null;
  updatedAt:      string;
  owner:          VendorOwner | null;
}
