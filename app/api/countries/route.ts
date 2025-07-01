import { NextResponse } from "next/server";

export async function GET() {
	const apiKey = process.env.IUCN_API_KEY;

	if (!apiKey) {
		return NextResponse.json({ error: "API key missing" }, { status: 500 });
	}

	const response = await fetch("https://api.iucnredlist.org/api/v4/countries/", {
		headers: {
			Authorization: apiKey,
			Accept: "*/*",
		},
	});

	if (!response.ok) {
		return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
	}

	const data = await response.json();
	return NextResponse.json(data.countries);
}
