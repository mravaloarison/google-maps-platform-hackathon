import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get("q");

	if (!q) {
		return new Response(JSON.stringify({ error: "Missing query param ?q=" }), {
			status: 400,
		});
	}

	try {
		const gbifRes = await fetch(
			`https://api.gbif.org/v1/species/search?q=${encodeURIComponent(q)}&qField=VERNACULAR&limit=20`
		);

		if (!gbifRes.ok) {
			throw new Error("GBIF API fetch failed");
		}

		const data = await gbifRes.json();

		const simplified = data.results.map((item: any) => ({
			id: item.key,
            taxonID: item.taxonID || "Unknown",
			scientificName: item.scientificName || "Unknown",
		}));

		return Response.json({ results: simplified });
	} catch (error) {
		console.error("Error fetching species:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
		});
	}
}
