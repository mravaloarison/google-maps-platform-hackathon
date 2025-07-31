"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, LinearProgress, Button } from "@mui/joy";
import Filters from "@/app/components/explore/Filters";
import Pagination from "@/app/components/explore/Pagination";
import DescriptionIcon from "@mui/icons-material/Description";

import SpeciesBtnForLocationSearch from "@/app/components/explore/SpeciesBtnForLocationSearch";
import HeaderSectionLocationSearch from "@/app/components/explore/HeadeerSectionLocationSearch";

interface PageProps {
	params: Promise<{ location_id: string; location_name: string }>;
}

interface Observation {
	observer: string;
	observed_on: string;
	place_guess: string | null;
	image: string | null;
	taxon: {
		id: number;
		scientific_name: string;
		common_name: string | null;
		wikipedia_url: string | null;
	} | null;
}

const PER_PAGE = 50;

export default function LocationPage({ params }: PageProps) {
	const { location_id, location_name } = React.use(params);

	function formatLocationName(slug: string) {
		const withSpaces = decodeURIComponent(slug).replace(/[-_]/g, " ");
		return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	const [observations, setObservations] = useState<Observation[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalResults, setTotalResults] = useState(0);
	const totalPages = Math.ceil(totalResults / PER_PAGE);

	const [error, setError] = useState<string | null>(null);

	const [page, setPage] = useState(1);

	const fetchObservations = async (placeId: string, pageNumber: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/i_naturalist/species_by_location?place_id=${placeId}&page=${pageNumber}`
			);
			if (!res.ok) {
				throw new Error("Failed to fetch observations");
			}
			const data = await res.json();
			setObservations(data.observations || []);
			setTotalResults(data.total_results || 0);
			setPage(data.page || 1);
		} catch (err) {
			console.error("Failed to load observations:", err);
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchObservations(location_id, page);
	}, [location_id, page]);

	if (loading) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 4,
				}}
			>
				<LinearProgress color="success" variant="soft" />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 4,
				}}
			>
				<Typography color="danger">Error: {error}</Typography>
			</Box>
		);
	}

	if (!observations) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 4,
				}}
			>
				<Typography>No data available.</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				height: "calc(100vh - 70px)",
				display: "grid",
				gridTemplateRows: "auto 1fr auto",
				width: "auto",
				gridTemplateColumns: "100%",
			}}
		>
			<Stack
				sx={{
					backgroundColor: "background.surface",
					px: 4,
					py: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
				spacing={2}
			>
				<HeaderSectionLocationSearch
					placeName={formatLocationName(location_name)}
				/>
				<Button
					variant="soft"
					color="neutral"
					sx={{ width: "fit-content" }}
					startDecorator={<DescriptionIcon color="success" />}
				>
					Read more about this location
				</Button>
				<Typography level="body-sm" color="neutral">
					Found{" "}
					<strong>{totalResults.toLocaleString("en-US")}</strong>{" "}
					species
				</Typography>
			</Stack>
			<Stack spacing={2} sx={{ px: 4, py: 2, minHeight: 0 }}>
				<Filters />
				{loading ? (
					<LinearProgress color="success" variant="soft" />
				) : (
					<Stack spacing={2} sx={{ overflow: "auto" }}>
						{observations.map((obs, index) => (
							<Stack key={index}>
								<SpeciesBtnForLocationSearch obs={obs} />
							</Stack>
						))}
					</Stack>
				)}
			</Stack>

			<Pagination
				totalPages={totalPages}
				currentPage={page}
				onPageChange={(newPage) => setPage(newPage)}
			/>
		</Box>
	);
}
