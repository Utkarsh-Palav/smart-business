import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const locationStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);
const operatingModeSchema = z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY_ONLY", "HYBRID", "OTHER"]);

const locationFields = {
  name: z.string().trim().min(2, "Location name must be at least 2 characters").max(100),
  slug: z.string().trim().toLowerCase().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  operatingMode: operatingModeSchema,
  addressLine1: optionalText(160),
  addressLine2: optionalText(160),
  city: optionalText(100),
  state: optionalText(100),
  postalCode: optionalText(20),
  country: z.string().trim().length(2).toUpperCase().optional(),
  phone: optionalText(30),
};
const locationFieldsSchema = z.object(locationFields);

export const createLocationSchema = z.object({
  businessId: z.string().min(1),
  ...locationFields,
});

export const updateLocationSchema = locationFieldsSchema.partial().extend({
  status: locationStatusSchema.optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), "Provide at least one field to update.");

export const createTableSchema = z.object({
  name: z.string().trim().min(1, "Table name is required").max(60),
  code: z.string().trim().min(1).max(60).regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/).optional(),
  capacity: z.number().int().min(1).max(100).nullable().optional(),
});

export const updateTableSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  capacity: z.number().int().min(1).max(100).nullable().optional(),
  status: locationStatusSchema.optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), "Provide at least one field to update.");

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
