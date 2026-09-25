import { createLocationSchema } from "@/features/locations/schemas/location.schema";
import { createLocation } from "@/features/locations/services/location.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = createLocationSchema.safeParse(body);

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

    const location = await createLocation(result.data);

    return NextResponse.json(
      {
        success: true,
        data: location,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create location failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create location",
      },
      { status: 500 },
    );
  }
}
