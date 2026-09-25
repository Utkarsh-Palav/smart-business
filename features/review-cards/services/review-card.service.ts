import { prisma } from "@/lib/db/prisma";

import type { CreateReviewCardInput } from "../schemas/review-card.schema";
import { generateReviewCardToken } from "./review-card-token.service";

export async function createReviewCard(
  input: CreateReviewCardInput,
) {
  const business = await prisma.business.findUnique({
    where: {
      id: input.businessId,
    },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  if (input.locationId) {
    const location = await prisma.location.findFirst({
      where: {
        id: input.locationId,
        businessId: input.businessId,
      },
    });

    if (!location) {
      throw new Error(
        "Location not found or does not belong to this business",
      );
    }
  }

  const token = generateReviewCardToken();

  return prisma.reviewCard.create({
    data: {
      businessId: input.businessId,
      locationId: input.locationId,
      name: input.name,
      destinationUrl: input.destinationUrl,
      token,
    },
  });
}