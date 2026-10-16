import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ businessId: string }> },
) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication is required." } },
        { status: 401 },
      );
    }

    const { businessId } = await params;
    const business = await controlPrisma.business.findFirst({
      where: {
        id: businessId,
        memberships: {
          some: {
            userId: session.userId,
            status: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        legalName: true,
        businessType: true,
        gstin: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        onboardingProfile: {
          select: {
            firstLocationName: true,
            firstLocationSlug: true,
            operatingMode: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            phone: true,
          },
        },
        _count: {
          select: {
            memberships: true,
            reviewCardAssignments: true,
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: "BUSINESS_NOT_FOUND", message: "Business not found." } },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: business }, { status: 200 });
  } catch (error) {
    console.error("Business detail retrieval failed:", error);
    return NextResponse.json(
      { success: false, error: { code: "BUSINESS_DETAIL_FAILED", message: "Unable to retrieve the business." } },
      { status: 500 },
    );
  }
}
