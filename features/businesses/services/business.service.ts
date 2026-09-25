import { prisma } from "@/lib/db/prisma";
import { CreateBusinessInput } from "../schemas/business.schema";

export async function createBusiness(input: CreateBusinessInput) {
  return prisma.business.create({
    data: {
      name: input.name,
      slug: input.slug,
    },
  });
}

export async function getBusinessBySlug(slug: string) {
  return prisma.business.findUnique({
    where: {
      slug,
    },
  });
}