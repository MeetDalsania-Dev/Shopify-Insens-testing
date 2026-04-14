export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  role: "vendor_owner";
}

export interface AuthUser {
  id:        string;
  email:     string;
  role:      string;
  firstName: string;
  lastName?: string;
  shopId:    string | null;
}

export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  user:         AuthUser;
}
