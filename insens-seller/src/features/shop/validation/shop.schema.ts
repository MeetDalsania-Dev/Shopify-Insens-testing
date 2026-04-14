import { z } from "zod";

export const ShopProfileSchema = z.object({
  name:        z.string().min(2, "Shop name must be at least 2 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  city:        z.string().min(1, "City is required"),
  address:     z.string().optional(),
  logoUrl:     z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type ShopProfileFormValues = z.infer<typeof ShopProfileSchema>;
