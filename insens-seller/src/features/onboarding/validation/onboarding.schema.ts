import { z } from "zod";

export const OnboardingSchema = z.object({
  name:        z.string().min(2, "Shop name must be at least 2 characters"),
  description: z.string().max(500, "Description too long").optional(),
  city:        z.string().min(1, "City is required"),
  address:     z.string().optional(),
  logoUrl:     z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type OnboardingFormValues = z.infer<typeof OnboardingSchema>;
