"use client";

import SpeciesBtn from "@/app/components/explore/SpeciesBtn";
import { GppMaybeOutlined, ScienceOutlined } from "@mui/icons-material";
import { Box, ModalClose, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalDialog, Stack } from "@mui/joy";

import DescriptionIcon from "@mui/icons-material/Description";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Filters from "@/app/components/explore/Filters";
import Pagination from "@/app/components/explore/Pagination";

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
	summary?: string;
	iucn_status?: string | null;
	is_endemic?: boolean | null;
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
		return <p>Loading species details...</p>;
	}

	if (error) {
		return <p style={{ color: "red" }}>Error: {error}</p>;
	}

	if (!speciesDetails) {
		return <p>No data available.</p>;
	}

	const {
		common_name,
		scientific_name,
		image,
		summary,
		iucn_status,
		is_endemic,
		observations,
		total_results,
	} = speciesDetails;

	const totalPages = Math.ceil(total_results / PER_PAGE);

	return (
		<Box
			sx={{
				height: "calc(100vh - 55px)",
				display: "grid",
				gridTemplateRows: "auto 1fr auto",
				width: "auto",
				gridTemplateColumns: "100%",
			}}
		>
			<Stack
				sx={{
					backgroundColor: "background.surface",
					py: 2,
					px: 4,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Stack spacing={1.5} sx={{ mb: 0.7, mt: 0.5 }}>
					<Stack direction="row" spacing={1.5}>
						{image && (
							<img
								src={image}
								alt={common_name ?? scientific_name}
								style={{
									width: 170,
									height: 170,
									objectFit: "cover",
									borderRadius: 8,
								}}
							/>
						)}

						{summary && (
							<Stack sx={{ flexGrow: 1 }}>
								<Typography level="title-lg">
									{common_name ?? scientific_name}
								</Typography>
								{common_name && (
									<Typography
										level="body-md"
										color="neutral"
										startDecorator={
											<ScienceOutlined color="success" />
										}
										sx={{
											paddingTop: 0.5,
										}}
									>
										{scientific_name}
									</Typography>
								)}
								{iucn_status && (
									<Typography
										level="body-md"
										variant="soft"
										color="warning"
										startDecorator={<GppMaybeOutlined />}
									>
										{iucn_status}
									</Typography>
								)}

								{is_endemic !== null && (
									<Typography
										color={
											is_endemic ? "success" : "danger"
										}
										level="body-sm"
									>
										<strong>Is Endemic:</strong>{" "}
										{is_endemic ? "Yes" : "No"}
									</Typography>
								)}
								<Stack
									spacing={1.5}
									useFlexGap
									sx={{ mt: "auto" }}
								>
									<Button
										variant="soft"
										color="neutral"
										onClick={() =>
											setOpenSummaryModal(true)
										}
										startDecorator={<DescriptionIcon />}
									>
										Read details
									</Button>

									<Button
										variant="soft"
										color="success"
										sx={{
											width: "100%",
											justifyContent: "center",
										}}
										startDecorator={<AddLocationAltIcon />}
									>
										Add sighting
									</Button>
								</Stack>
							</Stack>
						)}
					</Stack>

					<Modal
						open={openSummaryModal}
						onClose={() => setOpenSummaryModal(false)}
					>
						<ModalDialog>
							<ModalClose />
							<Typography level="h4" mb={2}>
								{common_name ?? scientific_name} – Full Summary
							</Typography>
							<div
								dangerouslySetInnerHTML={{
									__html: summary ?? "",
								}}
								style={{ lineHeight: 1.6 }}
							/>
						</ModalDialog>
					</Modal>
				</Stack>
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
