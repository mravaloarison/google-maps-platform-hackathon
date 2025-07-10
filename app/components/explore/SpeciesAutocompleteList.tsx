"use client";

import React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

interface SpeciesResult {
	key: number;
	canonicalName: string;
	vernacularName: string;
	scientificName?: string;
	rank?: string;
}

interface Props {
	speciesList: SpeciesResult[];
	onSelect: (name: string, canonicalName: string, key: number) => void;
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
				<ListItem key={species.key}>
					<ListItemButton
						onClick={() =>
							onSelect(
								species.vernacularName,
								species.canonicalName,
								species.key
							)
						}
						color="neutral"
						sx={{
							justifyContent: "flex-start",
							alignItems: "center",
							paddingY: 1,
						}}
					>
						<Stack direction="column" spacing={0}>
							<Typography level="body-md" fontWeight="lg">
								{species.vernacularName ||
									species.canonicalName}
							</Typography>
							<Typography
								level="body-sm"
								sx={{
									color: "text.secondary",
									fontStyle: "italic",
								}}
							>
								{species.canonicalName}
							</Typography>
						</Stack>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
}
