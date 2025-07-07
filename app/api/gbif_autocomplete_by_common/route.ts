import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get("q");

	if (!q) {
		return new Response(
			JSON.stringify({ error: "Missing query param ?q=" }),
			{ status: 400 }
		);
	}

	try {
		const gbifRes = await fetch(
			`https://api.gbif.org/v1/species/search?status=ACCEPTED&q=${encodeURIComponent(q)}&qField=VERNACULAR`
		);

		if (!gbifRes.ok) {
			throw new Error("GBIF API fetch failed");
		}

		const data = await gbifRes.json();

		const seen = new Set<string>();
		const simplified = [];

		for (const item of data.results) {
			if (!item.vernacularNames?.length || !item.canonicalName) continue;

			const englishVernacular = item.vernacularNames.find(
				(v: any) => v.language === "eng"
			);

			const vernacular = englishVernacular?.vernacularName ?? item.vernacularNames[0].vernacularName;

			const uniqueKey = `${item.canonicalName.toLowerCase()}|${vernacular.toLowerCase()}`;

			if (!seen.has(uniqueKey)) {
				seen.add(uniqueKey);
				simplified.push({
					key: item.key,
					canonicalName: item.canonicalName,
					vernacularName: vernacular,
				});
			}
		}

		return Response.json({ results: simplified });
	} catch (error) {
		console.error("Error fetching species:", error);
		return new Response(
			JSON.stringify({ error: "Internal Server Error" }),
			{ status: 500 }
		);
	}
}
