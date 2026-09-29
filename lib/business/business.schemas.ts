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
    businessType: z.enum([
      "CAFE",
      "RESTAURANT",
      "QSR",
      "CLOUD_KITCHEN",
      "BAKERY",
      "FOOD_TRUCK",
      "OTHER",
    ]),
    legalName: z.string().trim().max(150).optional(),
    gstin: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
        "Enter a valid GSTIN.",
      )
      .optional()
      .or(z.literal("")),
    firstLocation: z.object({
      name: z
        .string()
        .trim()
        .min(2, "Outlet name must be at least 2 characters long")
        .max(100, "Outlet name must not exceed 100 characters"),
      slug: z
        .string()
        .trim()
        .toLowerCase()
        .min(2, "Outlet slug must be at least 2 characters long")
        .max(80, "Outlet slug must not exceed 80 characters")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Outlet slug can contain only lowercase letters, numbers, and hyphens",
        ),
      operatingMode: z.enum([
        "DINE_IN",
        "TAKEAWAY",
        "DELIVERY_ONLY",
        "HYBRID",
        "OTHER",
      ]),
      addressLine1: z
        .string()
        .trim()
        .min(3, "Address is required")
        .max(200, "Address must not exceed 200 characters"),
      addressLine2: z.string().trim().max(200).optional(),
      city: z
        .string()
        .trim()
        .min(2, "City is required")
        .max(100, "City must not exceed 100 characters"),
      state: z
        .string()
        .trim()
        .min(2, "State is required")
        .max(100, "State must not exceed 100 characters"),
      postalCode: z
        .string()
        .trim()
        .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian PIN code."),
      phone: z.string().trim().max(20).optional(),
    }),
});

export type CreateBusinessRequest = z.infer<
  typeof createBusinessSchema
>;