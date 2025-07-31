import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const taxonId = req.nextUrl.searchParams.get('taxon_id');
  const pageParam = req.nextUrl.searchParams.get('page');
  const page = parseInt(pageParam || '1', 10);

  if (!taxonId) {
    return NextResponse.json({ error: 'taxon_id is required' }, { status: 400 });
  }

  try {
    const taxonData = await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`).then(res => res.json());
    const taxon = taxonData?.results?.[0];

    const obsRes = await fetch(`https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&verifiable=true&per_page=50&page=${page}&order=desc&order_by=observed_on`);
    const obsData = await obsRes.json();

    const observations = obsData.results.map((obs: any) => ({
      observer: obs.user?.name ?? obs.user?.login ?? 'Unknown',
      observed_on: obs.observed_on_details?.date || obs.observed_on,
      time_observed_at: obs.time_observed_at ?? null,
      location: obs.location ?? 'Unknown',
      place_guess: obs.place_guess ?? null,
      image: obs.photos?.[0]?.url ?? null,
    }));

    const baseResponse = {
      taxon_id: taxonId,
      page,
      total_results: obsData.total_results,
      observations,
    };

    if (taxon) {
      Object.assign(baseResponse, {
        common_name: taxon.preferred_common_name,
        scientific_name: taxon.name,
        image: taxon.default_photo?.medium_url,
        image_attribution: taxon.default_photo?.attribution,
        photos: taxon.taxon_photos?.map((res: any) => {
          return {
            url: res.photo?.original_url || null,
            attribution: res.photo?.attribution || null,
          }
        }),
        wikipidia_url: taxon.wikipedia_url || null,
      });
    }

    return NextResponse.json(baseResponse);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch species details' }, { status: 500 });
  }
}
