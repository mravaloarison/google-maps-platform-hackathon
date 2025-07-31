import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('place_id');
  const pageParam = req.nextUrl.searchParams.get('page');
  const page = parseInt(pageParam || '1', 10);

  if (!placeId) {
    return NextResponse.json({ error: 'place_id is required' }, { status: 400 });
  }

  try {
    const url = `https://api.inaturalist.org/v1/observations?licensed=true&place_id=${placeId}&order=desc&order_by=created_at&per_page=20&page=${page}`;
    const obsRes = await fetch(url);
    const obsData = await obsRes.json();

    const observations = obsData.results.map((obs: any) => ({
      observer: obs.user?.name_autocomplete !== "" ? obs.user?.name_autocomplete : obs.user?.login ?? 'Unknown',
      observed_on: obs.observed_on_details?.date || obs.observed_on,
      time_observed_at: obs.time_observed_at ?? null,
      location: obs.location ?? 'Unknown',
      place_guess: obs.place_guess ?? null,
      image: obs.photos?.[0]?.url ?? null,
      photos: obs.photos?.map((photo: any) => ({
        url: photo.url,
        attribution: photo.attribution ?? null
      })) ?? [],
      taxon: obs.taxon ? {
        id: obs.taxon.id,
        scientific_name: obs.taxon.name,
        common_name: obs.taxon.preferred_common_name ?? null,
        wikipedia_url: obs.taxon.wikipedia_url ?? null,
      } : null
    }));

    return NextResponse.json({
      place_id: placeId,
      page,
      total_results: obsData.total_results,
      observations,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch location observations' }, { status: 500 });
  }
}
