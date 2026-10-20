import { z } from "zod";

export const createPublicOrderSchema = z.object({
  idempotencyKey: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(99),
        notes: z.string().trim().max(300).optional(),
      }),
    )
    .min(1)
    .max(50),
  customerName: z.string().trim().max(120).optional(),
  customerPhone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "ACCEPTED",
    "PREPARING",
    "READY",
    "SERVED",
    "COMPLETED",
    "CANCELED",
  ]),
});

export type CreatePublicOrderInput = z.infer<typeof createPublicOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
