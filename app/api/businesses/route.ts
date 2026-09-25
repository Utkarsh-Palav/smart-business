import { createBusinessSchema } from "@/features/businesses/schemas/business.schema";
import { createBusiness } from "@/features/businesses/services/business.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = createBusinessSchema.safeParse(body);

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

    const business = await createBusiness(result.data);

    return NextResponse.json(
      {
        success: true,
        data: business,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Create business failed: ", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create business",
      },
      { status: 500 },
    );
  }
}