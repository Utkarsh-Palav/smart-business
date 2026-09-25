import z from "zod";

export const createLocationSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),

  name: z
    .string()
    .trim()
    .min(2, "Location name must be at least 2 characters")
    .max(100, "Location name must be at most 100 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;