import { z } from "zod";

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const createMenuSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug,
});

export const updateMenuSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: slug.optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), "Provide at least one field to update.");

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug,
  description: optionalText(1000),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});

export const updateCategorySchema = z.object({
  menuId: z.string().min(1).optional(),
  name: z.string().trim().min(1).max(100).optional(),
  slug: slug.optional(),
  description: optionalText(1000),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
}).refine((value) => Object.entries(value).some(([key, item]) => key !== "menuId" && item !== undefined), "Provide at least one field to update.");

export const createProductSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  slug,
  description: optionalText(2000),
  sku: optionalText(100),
  imageUrl: z.string().trim().url().refine((value) => value.startsWith("https://"), "Image URLs must use HTTPS.").max(2048).nullable().optional(),
  basePriceMinor: z.number().int().min(0).max(2_147_483_647),
  currency: z.string().trim().length(3).toUpperCase().default("INR"),
  displayName: optionalText(120),
  displayDescription: optionalText(2000),
  priceOverrideMinor: z.number().int().min(0).max(2_147_483_647).nullable().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  isVisible: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  menuId: z.string().min(1),
  name: z.string().trim().min(1).max(120).optional(),
  slug: slug.optional(),
  categoryId: z.string().min(1).optional(),
  description: optionalText(2000),
  sku: optionalText(100),
  imageUrl: z.string().trim().url().refine((value) => value.startsWith("https://"), "Image URLs must use HTTPS.").max(2048).nullable().optional(),
  basePriceMinor: z.number().int().min(0).max(2_147_483_647).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  displayName: optionalText(120),
  displayDescription: optionalText(2000),
  priceOverrideMinor: z.number().int().min(0).max(2_147_483_647).nullable().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  isVisible: z.boolean().optional(),
}).refine((value) => Object.entries(value).some(([key, item]) => key !== "menuId" && item !== undefined), "Provide at least one field to update.");

export const updateAvailabilitySchema = z.object({
  menuId: z.string().min(1),
  locationId: z.string().min(1),
  isAvailable: z.boolean(),
  priceOverrideMinor: z.number().int().min(0).max(2_147_483_647).nullable().optional(),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
