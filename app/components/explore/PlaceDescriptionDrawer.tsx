"use client";

import { Stack, Typography, List, ListItem, LinearProgress } from "@mui/joy";
import { useState, useEffect } from "react";

interface Species {
	id: string;
	name: string;
	scientificName: string;
}

interface PlaceData {
	description: string;
	mostCommonSpeciesFoundThere: Species[];
	wildlifeFunFact: string;
}

export default function PlaceDescriptionDrawer({
	placeName,
}: {
	placeName: string;
}) {
	const [data, setData] = useState<PlaceData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/gemini/place_description", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ placeName }),
				});
				const json = await res.json();
				setData(json);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [placeName]);

	if (loading) {
		return (
			<Stack spacing={2}>
				<Typography>Loading facts about {placeName}...</Typography>
				<LinearProgress color="success" />
			</Stack>
		);
	}

	if (!data) {
		return (
			<Stack spacing={2}>
				<Typography>Could not fetch data for {placeName}.</Typography>
			</Stack>
		);
	}

	return (
		<Stack spacing={2}>
			<Typography level="title-lg">Description</Typography>
			<Typography level="body-md">{data.description}</Typography>

			<Typography level="title-lg">
				Most common species found there
			</Typography>
			<List marker="disc">
				{data.mostCommonSpeciesFoundThere.map((species) => (
					<ListItem key={species.id}>
						<Typography level="body-md">
							{species.name}{" "}
							<Typography
								component="span"
								level="body-md"
								textColor="var(--joy-palette-success-plainColor)"
								sx={{ fontFamily: "monospace", opacity: "50%" }}
							>
								({species.scientificName})
							</Typography>
						</Typography>
					</ListItem>
				))}
			</List>
			<Typography level="title-lg">Wildlife Fun Fact</Typography>
			<Typography level="body-md">{data.wildlifeFunFact}</Typography>
		</Stack>
	);
}
