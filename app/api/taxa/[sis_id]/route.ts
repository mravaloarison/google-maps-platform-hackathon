import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	context: { params: { sis_id: string } }
) {
	const apiKey = process.env.IUCN_API_KEY;
	if (!apiKey) {
		return NextResponse.json({ error: "Missing API key" }, { status: 500 });
	}

	const sisId = context.params.sis_id;

	const res = await fetch(`https://api.iucnredlist.org/api/v4/taxa/sis/${sisId}`, {
		headers: {
			Authorization: apiKey,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		return NextResponse.json({ error: "Failed to fetch taxon details" }, { status: res.status });
	}

	const data = await res.json();
	return NextResponse.json(data);
}
