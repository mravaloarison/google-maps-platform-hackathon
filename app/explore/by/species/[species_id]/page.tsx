"use client";

import SpeciesBtn from "@/app/components/explore/SpeciesBtn";
import {
	GppMaybeOutlined,
	ScienceOutlined,
	FavoriteOutlined,
	FavoriteBorder,
} from "@mui/icons-material";
import { Divider, IconButton, ModalClose, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalDialog, Stack } from "@mui/joy";

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
		<div>
			<Stack
				sx={{
					backgroundColor: "background.surface",
					px: { xs: 2, md: 4 },
					py: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<div style={{ display: "flex", alignItems: "start", gap: 20 }}>
					{image && (
						<img
							src={image}
							alt={common_name ?? scientific_name}
							style={{
								width: 120,
								height: 120,
								objectFit: "cover",
								borderRadius: 8,
							}}
						/>
					)}
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Typography level="h3">
								{common_name ?? scientific_name}
							</Typography>
							<IconButton
								variant={isLiked ? "soft" : "plain"}
								size="lg"
								color={isLiked ? "success" : "neutral"}
								onClick={() => setIsLiked((prev) => !prev)}
								sx={{
									display: { xs: "none", sm: "flex" },
									borderRadius: "50%",
								}}
							>
								{isLiked ? (
									<FavoriteOutlined />
								) : (
									<FavoriteBorder />
								)}
							</IconButton>
						</div>
						{common_name && (
							<Typography
								level="body-md"
								sx={{
									fontStyle: "italic",
								}}
								color="neutral"
								startDecorator={
									<ScienceOutlined color="success" />
								}
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
								color={is_endemic ? "success" : "danger"}
								level="body-sm"
							>
								<strong>Is Endemic:</strong>{" "}
								{is_endemic ? "Yes" : "No"}
							</Typography>
						)}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
								paddingTop: 17,
							}}
						>
							<p></p>
							<Button variant="soft" color="success">
								Add sighting
							</Button>
						</div>
					</div>
				</div>

				{summary && (
					<section style={{ marginTop: 20 }}>
						<Typography level="title-lg" sx={{ mb: 0.5 }}>
							Summary
						</Typography>

						<div
							dangerouslySetInnerHTML={{ __html: summary ?? "" }}
							style={{
								lineHeight: 1.5,
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								WebkitLineClamp: 2,
								maxHeight: "4.5em",
							}}
						/>

						<Button
							variant="outlined"
							color="neutral"
							onClick={() => setOpenSummaryModal(true)}
							sx={{
								mt: 1.5,
							}}
						>
							Read more
						</Button>

						<Modal
							open={openSummaryModal}
							onClose={() => setOpenSummaryModal(false)}
						>
							<ModalDialog>
								<ModalClose />
								<Typography level="h4" mb={2}>
									{common_name ?? scientific_name} – Full
									Summary
								</Typography>
								<div
									dangerouslySetInnerHTML={{
										__html: summary ?? "",
									}}
									style={{ lineHeight: 1.6 }}
								/>
							</ModalDialog>
						</Modal>
					</section>
				)}
			</Stack>

			<section style={{ marginTop: 30 }}>
				<Typography>
					Observations (Page {page} of {totalPages})
				</Typography>
				{observations.length === 0 && <p>No observations found.</p>}

				<ul style={{ listStyle: "none", paddingLeft: 0 }}>
					{observations.map((obs, i) => (
						<>
							<SpeciesBtn
								key={`${obs.observer}-${i}`}
								obs={obs}
							/>
							<Divider />
						</>
					))}
				</ul>

				<div style={{ marginTop: 20, display: "flex", gap: 10 }}>
					<button
						disabled={page <= 1}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						Previous
					</button>
					<button
						disabled={page >= totalPages}
						onClick={() =>
							setPage((p) => Math.min(totalPages, p + 1))
						}
					>
						Next
					</button>
				</div>
			</section>
		</div>
	);
}
