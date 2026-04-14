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
