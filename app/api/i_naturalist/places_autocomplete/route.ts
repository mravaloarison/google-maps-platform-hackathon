import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter `q`" },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.inaturalist.org/v1/places/autocomplete?q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();

    const simplifiedResults = data.results.map((place: any) => ({
      id: place.id,
      display_name: place.display_name,
      geometry_geojson: place.geometry_geojson,
      bounding_box_geojson: place.bounding_box_geojson,
      location: place.location,
    }));

    return NextResponse.json(simplifiedResults);
  } catch (error) {
    console.error("Error fetching places autocomplete:", error);
    return NextResponse.json(
      { error: "Failed to fetch places from iNaturalist" },
      { status: 500 }
    );
  }
}
