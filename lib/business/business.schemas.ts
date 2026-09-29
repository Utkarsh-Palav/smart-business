import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters long")
    .max(100, "Business name must not exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Business slug must be at least 2 characters long")
    .max(80, "Business slug must not exceed 80 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Business slug can contain only lowercase letters, numbers, and hyphens",
    ),
});

export type CreateBusinessRequest = z.infer<
  typeof createBusinessSchema
>;