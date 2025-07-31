"use client";

import { Typography, Drawer, Sheet, Stack } from "@mui/joy";
import { useState } from "react";

interface Taxon {
	id: number;
	scientific_name: string;
	common_name: string | null;
	wikipedia_url: string | null;
}

export default function TaxonTitle({ taxon }: { taxon: Taxon | null }) {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleClick = () => {
		if (taxon?.wikipedia_url) {
			setDrawerOpen(true);
		}
	};

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
				<Typography level="title-lg">
					{taxon.common_name || taxon.scientific_name}
				</Typography>

				{taxon.scientific_name && (
					<Typography level="body-sm">
						&#40;{taxon.scientific_name}&#41;
					</Typography>
				)}
			</Stack>

			<Drawer
				open={drawerOpen}
				size="lg"
				onClose={() => setDrawerOpen(false)}
			>
				<Sheet
					sx={{
						px: 2,
						height: "100%",
						overflowY: "auto",
					}}
				>
					{taxon.wikipedia_url ? (
						<iframe
							src={taxon.wikipedia_url}
							style={{
								width: "100%",
								height: "100%",
								border: "none",
							}}
						/>
					) : (
						<Typography>No Wikipedia info available</Typography>
					)}
				</Sheet>
			</Drawer>
		</>
	);
}
