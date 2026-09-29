import { z } from "zod";

export const selectOnboardingPlanSchema = z.object({
  planPriceId: z.string().trim().min(1, "Plan price is required."),
});