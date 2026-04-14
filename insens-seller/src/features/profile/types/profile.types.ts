export interface UserProfile {
  id:        string;
  email:     string;
  firstName: string;
  lastName?: string;
  role:      string;
  isActive:  boolean;
  createdAt: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName?: string;
  email:     string;
}
