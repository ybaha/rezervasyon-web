import { z } from "zod";

export const businessFormSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry_id: z.string().uuid("Please select an industry"),
  // location: z.string().min(2, "Location is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  postal_code: z.string().optional(),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional(),
  logo_url: z.string().url("Invalid logo URL").optional(),
  cover_image_url: z.string().url("Invalid cover image URL").optional(),
  price_level: z.number().min(1).max(4).default(2),
});

export type BusinessFormData = z.infer<typeof businessFormSchema>; 