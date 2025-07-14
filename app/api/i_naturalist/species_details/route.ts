import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const taxonId = req.nextUrl.searchParams.get('taxon_id');
  if (!taxonId) {
    return NextResponse.json({ error: 'taxon_id is required' }, { status: 400 });
  }

  try {
    // Fetch taxon detail
    const taxonRes = await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`);
    const taxonData = await taxonRes.json();
    const taxon = taxonData.results[0];

    // Fetch observations
    const obsRes = await fetch(`https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&verifiable=true&order_by=created_at&per_page=10`);
    const obsData = await obsRes.json();

    const observations = obsData.results.map((obs: any) => ({
      observer: obs.user?.login ?? 'Unknown',
      observed_on: obs.observed_on_details?.date || obs.observed_on,
      location: obs.place_guess || obs.location,
      image: obs.photos?.[0]?.url ?? null,
    }));

    return NextResponse.json({
      taxon_id: taxon.id,
      common_name: taxon.preferred_common_name,
      scientific_name: taxon.name,
      image: taxon.default_photo?.medium_url,
      summary: taxon.wikipedia_summary,
      iucn_status: taxon.conservation_status?.status_name ?? null,
      is_endemic: taxon.is_endemic ?? null,
      observations,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch species details' }, { status: 500 });
  }
}
