import { z } from "zod";

export const RegisterSchema = z
  .object({
    firstName:       z.string().min(1, "First name is required"),
    lastName:        z.string().optional(),
    email:           z.string().email("Please enter a valid email address"),
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path:    ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
