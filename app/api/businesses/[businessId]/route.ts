import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/responses";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ businessId: string }> },
) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return unauthorizedResponse();
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
      return errorResponse("BUSINESS_NOT_FOUND", "Business not found.", 404);
    }

    return successResponse(business);
  } catch (error) {
    return handleApiError(error, "BUSINESS_DETAIL_FAILED", "Unable to retrieve the business.");
  }
}
