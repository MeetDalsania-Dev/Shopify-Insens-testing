import { z } from "zod";

// Generates a URL-safe slug from a string
export function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export const OnboardingSchema = z.object({
  displayName: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .max(255, "Shop name is too long"),

  legalName: z
    .string()
    .min(2, "Legal name must be at least 2 characters")
    .max(255, "Legal name is too long"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens are allowed"),

  description: z.string().max(500, "Description too long").optional(),

  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),

  phone: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof OnboardingSchema>;
