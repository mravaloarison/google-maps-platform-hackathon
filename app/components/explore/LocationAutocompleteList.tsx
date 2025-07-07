"use client";

import React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";

interface Country {
	code: string;
	description: {
		en: string;
	};
}

interface Props {
	locations: Country[];
	onSelect: (name: string, code: string) => void;
}

export default function LocationAutocompleteList({
	locations,
	onSelect,
}: Props) {
	if (locations.length === 0) return null;

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
			{locations.map((country, index) => (
				<ListItem key={index}>
					<ListItemButton
						onClick={() =>
							onSelect(country.description.en, country.code)
						}
					>
						{country.description.en}
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
}
