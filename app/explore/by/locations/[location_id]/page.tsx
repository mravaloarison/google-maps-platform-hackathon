"use client";

import React from "react";

import { Box, Stack } from "@mui/joy";

interface PageProps {
	params: Promise<{ location_id: string }>;
}

export default function LocationPage({ params }: PageProps) {
	const { location_id } = React.use(params);

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
				The country code is: {location_id}
			</Stack>
		</Box>
	);
}
