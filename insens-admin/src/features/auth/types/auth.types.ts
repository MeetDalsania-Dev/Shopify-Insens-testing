export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}
