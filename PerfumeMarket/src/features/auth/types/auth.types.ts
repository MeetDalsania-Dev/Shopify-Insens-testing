export interface StrapiUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  fullName: string | null;
  phone: string | null;
  roleType: string | null; // ← 'visitor' | 'seller' | null
  isActive: boolean;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}

// ── Request Payloads ──
export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  code: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateRolePayload {
  roleType: "visitor" | "seller";
}

export interface StrapiErrorDetail {
  path: string[];
  message: string;
  name: string;
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: {
    errors?: StrapiErrorDetail[];
  };
}

export interface AppError {
  message: string;
  status?: number;
  code?: string;
  fieldErrors?: Record<string, string>; // field-level validation errors
}
