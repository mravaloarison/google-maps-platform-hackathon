"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, LinearProgress } from "@mui/joy";
import Filters from "@/app/components/explore/Filters";
import Pagination from "@/app/components/explore/Pagination";
import SpeciesBtnForLocationSearch from "@/app/components/explore/SpeciesBtnForLocationSearch";

interface PageProps {
	params: Promise<{ location_id: string }>;
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

const PER_PAGE = 20;

export default function LocationPage({ params }: PageProps) {
	const { location_id } = React.use(params);
	const [observations, setObservations] = useState<Observation[]>([]);
	const [loading, setLoading] = useState(true);

	const [error, setError] = useState<string | null>(null);

	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchObservations = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/i_naturalist/species_by_location?place_id=${location_id}`
				);
				const data = await res.json();
				setObservations(data.observations || []);
				setPage(data.page || 1);
			} catch (err) {
				console.error("Failed to load location observations:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchObservations();
	}, [location_id]);

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

	const totalPages = Math.ceil(observations.length / PER_PAGE);

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
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				Hello
			</Stack>
			<Stack spacing={2} sx={{ px: 4, py: 2, minHeight: 0 }}>
				<Filters />
				{loading ? (
					<div>Loading observations…</div>
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
