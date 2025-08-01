"use client";

import React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";

interface Location {
	id: number;
	display_name: string;
	geometry_geojson: any;
	bounding_box_geojson: any;
	location: string;
}

interface Props {
	locations: Location[];
	onSelect: (place: Location) => void;
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
			{locations.map((place, index) => (
				<ListItem key={index}>
					<ListItemButton onClick={() => onSelect(place)}>
						{place.display_name}
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
}
