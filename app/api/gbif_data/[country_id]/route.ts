// https://api.gbif.org/v1/occurrence/search?country=<country_id>

import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: { country_id: string } }) {
    const { country_id } = context.params;

    const url = `https://api.gbif.org/v1/occurrence/search?country=${country_id}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        return new Response("Failed to fetch GBIF data", { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
}