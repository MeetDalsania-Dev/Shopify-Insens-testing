import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().optional(),
  email:     z.string().email("Please enter a valid email address"),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

export const PasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword:     z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path:    ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof PasswordSchema>;
