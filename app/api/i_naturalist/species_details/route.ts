import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const taxonId = req.nextUrl.searchParams.get('taxon_id');
  const pageParam = req.nextUrl.searchParams.get('page');
  const page = parseInt(pageParam || '1', 10);

  if (!taxonId) {
    return NextResponse.json({ error: 'taxon_id is required' }, { status: 400 });
  }

  try {
    const taxonData = page === 1
      ? await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`).then(res => res.json())
      : null;
    const taxon = taxonData?.results?.[0];

    const obsRes = await fetch(`https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&verifiable=true&order_by=created_at&per_page=10&page=${page}`);
    const obsData = await obsRes.json();

    const observations = obsData.results.map((obs: any) => ({
      observer: obs.user?.login ?? 'Unknown',
      observed_on: obs.observed_on_details?.date || obs.observed_on,
      time_observed_at: obs.time_observed_at ?? null,
      location: obs.location ?? 'Unknown',
      image: obs.photos?.[0]?.url ?? null,
    }));

    const baseResponse = {
      taxon_id: taxonId,
      page,
      total_results: obsData.total_results,
      observations,
    };

    if (page === 1 && taxon) {
      Object.assign(baseResponse, {
        common_name: taxon.preferred_common_name,
        scientific_name: taxon.name,
        image: taxon.default_photo?.medium_url,
        summary: taxon.wikipedia_summary,
        iucn_status: taxon.conservation_status?.status_name ?? null,
        is_endemic: taxon.is_endemic ?? null,
      });
    }

    return NextResponse.json(baseResponse);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch species details' }, { status: 500 });
  }
}
