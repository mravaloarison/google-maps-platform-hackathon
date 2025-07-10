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
		const searchUrl = `https://api.gbif.org/v1/species/search?status=ACCEPTED&q=${encodeURIComponent(q)}&qField=VERNACULAR`;

		const searchRes = await fetch(searchUrl);
		if (!searchRes.ok) {
			throw new Error("Failed to fetch species search");
		}

		const searchData = await searchRes.json();

		const seen = new Set<string>();
		const results: any[] = [];

		await Promise.all(
			searchData.results.map(async (item: any) => {
				if (!item.key || !item.canonicalName || !item.vernacularNames?.length) return;

				const englishVernacular = item.vernacularNames.find(
					(v: any) => v.language === "eng"
				);
				const vernacular = englishVernacular?.vernacularName ?? item.vernacularNames[0].vernacularName;

				const uniqueKey = `${item.canonicalName.toLowerCase()}|${vernacular.toLowerCase()}`;
				if (seen.has(uniqueKey)) return;
				seen.add(uniqueKey);

				try {
					const detailRes = await fetch(`https://api.gbif.org/v1/species/${item.key}`);
					if (!detailRes.ok) return;

					const detail = await detailRes.json();

					results.push({
						key: detail.key,
						canonicalName: detail.canonicalName,
						vernacularName: vernacular,
						scientificName: detail.scientificName,
						rank: detail.rank,
						kingdom: detail.kingdom,
						phylum: detail.phylum,
						order: detail.order,
						family: detail.family,
						genus: detail.genus,
					});
				} catch (e) {
					console.error(`Failed to fetch detail for key ${item.key}`);
				}
			})
		);

		return Response.json({ results });
	} catch (error) {
		console.error("Error fetching species:", error);
		return new Response(
			JSON.stringify({ error: "Internal Server Error" }),
			{ status: 500 }
		);
	}
}
