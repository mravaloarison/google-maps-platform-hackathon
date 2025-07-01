import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { code: string } }
) {
	const apiKey = process.env.IUCN_API_KEY;
	const countryCode = params.code.toUpperCase();

	if (!apiKey) {
		return NextResponse.json({ error: "Missing API key" }, { status: 500 });
	}

	const res = await fetch(`https://api.iucnredlist.org/api/v4/countries/${countryCode}`, {
		headers: {
			Authorization: apiKey,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		const err = await res.text();
		return NextResponse.json({ error: "IUCN API error", details: err }, { status: res.status });
	}

	const data = await res.json();
	return NextResponse.json(data);
}
