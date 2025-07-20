"use client";

import React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

interface SpeciesResult {
	taxon_id: number;
	common_name: string | null;
	scientific_name: string;
	rank: string;
	image: string | null;
}

interface Props {
	speciesList: SpeciesResult[];
	onSelect: (
		common_name: string | null,
		scientific_name: string,
		taxon_id: number
	) => void;
}

export default function SpeciesAutocompleteList({
	speciesList,
	onSelect,
}: Props) {
	if (speciesList.length === 0) return null;

	return (
		<List
			sx={{
				position: "absolute",
				top: "100%",
				left: 0,
				right: 0,
				zIndex: 10,
				backgroundColor: "Background",
				borderRadius: "md",
				mt: 1,
				boxShadow: "md",
				maxHeight: 200,
				overflowY: "auto",
			}}
		>
			{speciesList.map((species) => (
				<ListItem key={species.taxon_id}>
					<ListItemButton
						onClick={() =>
							onSelect(
								species.common_name,
								species.scientific_name,
								species.taxon_id
							)
						}
						color="neutral"
						sx={{
							justifyContent: "flex-start",
							alignItems: "center",
							py: 1,
						}}
					>
						<Stack direction="row" spacing={1} alignItems="center">
							{species.image && (
								<img
									src={species.image}
									alt={
										species.common_name ??
										species.scientific_name
									}
									style={{
										width: 40,
										height: 40,
										borderRadius: 4,
										objectFit: "cover",
									}}
								/>
							)}
							<Stack direction="column" spacing={0}>
								<Typography level="body-md" fontWeight="lg">
									{species.common_name ??
										species.scientific_name}
								</Typography>
								<Typography
									level="body-sm"
									sx={{
										color: "text.secondary",
										fontStyle: "italic",
									}}
								>
									{species.scientific_name}
								</Typography>
							</Stack>
						</Stack>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
}
