import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origins = searchParams.get("origins");
  const destinations = searchParams.get("destinations");

  if (!origins || !destinations) {
    return NextResponse.json(
      { error: "Missing origins or destinations" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origins
  )}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.rows || data.rows.length === 0) {
      return NextResponse.json(
        { error: "Failed to calculate distance" },
        { status: 500 }
      );
    }

    const elements = data.rows[0].elements;

    if (!elements || elements.length === 0 || elements[0].status !== "OK") {
      return NextResponse.json(
        { error: "No route found between locations" },
        { status: 500 }
      );
    }

    const distance = elements[0].distance;
    const duration = elements[0].duration;

    return NextResponse.json({
      distance: distance.text,
      duration: duration.text,
    });
  } catch (error) {
    console.error("Error calculating distance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
