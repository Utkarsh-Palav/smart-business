import { prisma } from "@/lib/db/prisma";
import { CreateLocationInput } from "../schemas/location.schema";

export async function createLocation(input: CreateLocationInput) {
  return prisma.location.create({
    data: {
      businessId: input.businessId,
      name: input.name,
      slug: input.slug,
    },
  });
}

export async function getLocationByBusinessId(businessId: string) {
  return prisma.location.findMany({
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
