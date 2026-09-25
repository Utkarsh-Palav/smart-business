import { NextResponse } from "next/server";

import { createReviewCardSchema } from "@/features/review-cards/schemas/review-card.schema";
import { createReviewCard } from "@/features/review-cards/services/review-card.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createReviewCardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const reviewCard = await createReviewCard(result.data);

    return NextResponse.json(
      {
        success: true,
        data: reviewCard,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create review card failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create review card";

    if (
      message === "Business not found" ||
      message ===
        "Location not found or does not belong to this business"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create review card",
      },
      { status: 500 },
    );
  }
}