export async function getSpeciesImage(scientificName: string): Promise<string> {
	const encoded = encodeURIComponent(scientificName);

	try {
		const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encoded}&pithumbsize=500&origin=*`);
		const wikiData = await wikiRes.json();

		const pages = wikiData.query?.pages;
		const page = Object.values(pages || {})[0] as any;
		if (page?.thumbnail?.source) {
			return page.thumbnail.source;
		}
	} catch (err) {
		console.warn("Wikipedia failed", err);
	}

	return `https://source.unsplash.com/featured/?wildlife`;
}
