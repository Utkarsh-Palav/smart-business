import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { token } = await params;

  const reviewCard = await prisma.reviewCard.findUnique({
    where: {
      token,
    },
    select: {
      destinationUrl: true,
      status: true,
    },
  });

  if (!reviewCard) {
    return new NextResponse("Review card not found", {
      status: 404,
    });
  }

  if (reviewCard.status !== 'ACTIVE') {
    return new NextResponse('Review card is inactive', {
        status: 410,
    })
  }

  return NextResponse.redirect(reviewCard.destinationUrl);
}
