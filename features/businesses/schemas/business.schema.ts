import z from "zod";

export const createBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be at most 100 characters"),
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

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
