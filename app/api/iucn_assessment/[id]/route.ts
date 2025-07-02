import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;

	const res = await fetch(`https://api.iucnredlist.org/api/v4/assessment/${id}`, {
		headers: {
			Authorization: process.env.IUCN_API_KEY!,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		return new Response("Failed to fetch assessment", { status: 500 });
	}

	const data = await res.json();
	return Response.json(data);
}
