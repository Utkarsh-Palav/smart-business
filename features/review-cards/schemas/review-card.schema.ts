import { z } from "zod";

export const createReviewCardSchema = z.object({
  mode: z.enum(["MANAGED", "STANDALONE"]).default("STANDALONE"),
  businessId: z.string().min(1, "Business ID is required"),

  locationId: z.string().min(1, "Location ID cannot be empty").optional(),

  name: z
    .string()
    .trim()
    .min(2, "Card name must be at least 2 characters")
    .max(100, "Card name must be at most 100 characters"),

  destinationUrl: z.url("Destination URL must be a valid URL"),
});

export type CreateReviewCardInput = z.infer<typeof createReviewCardSchema>;
