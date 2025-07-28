"use client";

import SpeciesBtn from "@/app/components/explore/SpeciesBtn";
import { Box, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import { Button, Stack } from "@mui/joy";

import DescriptionIcon from "@mui/icons-material/Description";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Filters from "@/app/components/explore/Filters";
import Pagination from "@/app/components/explore/Pagination";

import LinearProgress from "@mui/joy/LinearProgress";
import HeaderSectionSpeciesResult from "@/app/components/explore/HeaderSectionSpeciesResult";

interface Observation {
	observer: string;
	observed_on: string;
	time_observed_at: string | null;
	location: string;
	image: string | null;
}

interface SpeciesDetails {
	taxon_id: string;
	common_name?: string;
	scientific_name?: string;
	image?: string;
	image_attribution?: string;
	photos?: { url: string | null; attribution: string | null }[];
	wikipidia_url?: string | null;
	page: number;
	total_results: number;
	observations: Observation[];
}

interface PageProps {
	params: Promise<{ species_id: string }>;
}
const PER_PAGE = 10;

export default function SpeciesDetailsPage({ params }: PageProps) {
	const { species_id } = React.use(params);

	const [openSummaryModal, setOpenSummaryModal] = useState(false);

	// TODO: Implement like in db
	const [isLiked, setIsLiked] = useState(false);

	const [page, setPage] = useState(1);
	const [speciesDetails, setSpeciesDetails] = useState<SpeciesDetails | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSpeciesDetails = async (taxonId: string, pageNumber: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/i_naturalist/species_details?taxon_id=${taxonId}&page=${pageNumber}`
			);
			if (!res.ok) {
				throw new Error("Failed to fetch species details");
			}
			const data: SpeciesDetails = await res.json();
			setSpeciesDetails(data);
		} catch (err: any) {
			setError(err.message || "Unknown error");
			setSpeciesDetails(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSpeciesDetails(species_id, page);
	}, [species_id, page]);

	if (loading) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 2,
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
					px: 2,
				}}
			>
				<Typography color="danger">Error: {error}</Typography>
			</Box>
		);
	}

	if (!speciesDetails) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 2,
				}}
			>
				<Typography>No data available.</Typography>
			</Box>
		);
	}

	const {
		common_name,
		scientific_name,
		image,
		image_attribution,
		photos,
		wikipidia_url,
		observations,
		total_results,
	} = speciesDetails;

	const totalPages = Math.ceil(total_results / PER_PAGE);

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
				<HeaderSectionSpeciesResult
					commonName={common_name}
					scientificName={scientific_name}
					photos={photos}
					wikipediaUrl={wikipidia_url}
				/>
			</Stack>

			<Stack spacing={2} sx={{ px: 4, py: 2, minHeight: 0 }}>
				<Filters />
				{observations.length === 0 && (
					<Typography>No observations found.</Typography>
				)}

				<Stack spacing={2} sx={{ overflow: "auto" }}>
					{" "}
					{observations.map((obs, i) => (
						<SpeciesBtn key={`${obs.observer}-${i}`} obs={obs} />
					))}
				</Stack>
			</Stack>

			<Pagination
				totalPages={totalPages}
				currentPage={page}
				onPageChange={setPage}
			/>
		</Box>
	);
}
