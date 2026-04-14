import { z } from "zod";

export const ProductSchema = z.object({
  name:        z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().max(1000, "Description too long").optional(),
  price:       z.coerce
    .number({ invalid_type_error: "Please enter a valid price" })
    .min(0.01, "Price must be greater than 0"),
  stock:       z.coerce
    .number({ invalid_type_error: "Please enter a valid stock number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  categoryId:  z.string().uuid("Invalid category").optional().or(z.literal("")),
  images:      z
    .array(z.string().url("Each image must be a valid URL"))
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
