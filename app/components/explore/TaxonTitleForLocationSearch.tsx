"use client";

import { Close } from "@mui/icons-material";
import {
	Typography,
	Drawer,
	Sheet,
	Stack,
	Box,
	IconButton,
	LinearProgress,
} from "@mui/joy";
import { useState } from "react";
import { useEffect } from "react";

interface Taxon {
	id: number;
	scientific_name: string;
	common_name: string | null;
	wikipedia_url: string | null;
}

interface SpeciesDetails {
	taxon_id: number;
	common_name?: string;
	scientific_name?: string;
	image?: string;
	image_attribution?: string;
	photos?: { url: string; attribution: string | null }[];
	wikipidia_url?: string | null;
	observations?: {
		observer: string;
		observed_on: string;
		place_guess: string | null;
		image: string | null;
	}[];
}

export default function TaxonTitle({ taxon }: { taxon: Taxon | null }) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [details, setDetails] = useState<SpeciesDetails | null>(null);
	const [loading, setLoading] = useState(false);

	const handleClick = () => {
		setDrawerOpen(true);
	};

	// When drawer opens, fetch taxon details
	useEffect(() => {
		if (drawerOpen && taxon?.id) {
			setLoading(true);
			fetch(`/api/i_naturalist/species_details?taxon_id=${taxon.id}`)
				.then((res) => res.json())
				.then((data) => setDetails(data))
				.catch((err) =>
					console.error("Failed to fetch species details", err)
				)
				.finally(() => setLoading(false));
		}
	}, [drawerOpen, taxon?.id]);

	if (!taxon) {
		return (
			<Typography level="title-md" fontStyle="italic">
				Unknown species
			</Typography>
		);
	}

	return (
		<>
			<Stack
				onClick={handleClick}
				sx={{
					cursor: "pointer",
					"&:hover": {
						textDecoration: "underline",
					},
				}}
			>
				<Typography
					level="title-lg"
					sx={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
						WebkitLineClamp: 1,
						WebkitBoxOrient: "vertical",
					}}
				>
					{taxon.common_name || taxon.scientific_name}
				</Typography>

				{taxon.scientific_name && (
					<Typography
						level="body-sm"
						sx={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
						}}
					>
						({taxon.scientific_name})
					</Typography>
				)}
			</Stack>

			<Drawer
				open={drawerOpen}
				size="lg"
				onClose={() => setDrawerOpen(false)}
				sx={{ zIndex: 12000 }}
			>
				<Box
					sx={{
						p: 2,
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 2,
						}}
					>
						<Typography level="h4">
							{details?.common_name ||
								taxon.common_name ||
								taxon.scientific_name}
						</Typography>
						<IconButton onClick={() => setDrawerOpen(false)}>
							<Close />
						</IconButton>
					</Box>

					<Sheet
						sx={{
							px: 2,
							height: "100%",
							overflowY: "auto",
						}}
					>
						{loading && (
							<LinearProgress color="success" variant="soft" />
						)}

						{!loading && details && (
							<>
								{details.wikipidia_url ? (
									<iframe
										src={details.wikipidia_url}
										style={{
											border: "none",
											width: "100%",
											height: "calc(100% + 5rem)",
											backgroundColor: "transparent",
											marginTop: "-5rem",
										}}
									/>
								) : (
									<>No wikipedia found</>
								)}
							</>
						)}
					</Sheet>
				</Box>
			</Drawer>
		</>
	);
}
