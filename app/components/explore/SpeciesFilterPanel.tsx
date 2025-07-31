"use client";

import React from "react";
import { Stack, Typography, Input } from "@mui/joy";

interface SpeciesFiltersPanelProps {
	pendingPerPage: number;
	setPendingPerPage: (value: number) => void;
}

export default function SpeciesFiltersPanel({
	pendingPerPage,
	setPendingPerPage,
}: SpeciesFiltersPanelProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = parseInt(e.target.value, 10);
		if (isNaN(value)) value = 50;
		if (value < 1) value = 1;
		if (value > 200) value = 200;
		setPendingPerPage(value);
	};

	return (
		<Stack spacing={1}>
			<Typography level="body-md">Results per page (max 200)</Typography>
			<Input
				type="number"
				value={pendingPerPage}
				onChange={handleChange}
				slotProps={{
					input: { min: 1, max: 200, step: 1 },
				}}
				sx={{ width: 120 }}
			/>
			{pendingPerPage === 200 && (
				<Typography level="body-xs" color="warning">
					200 is the maximum. Upgrade coming soon for larger pages.
				</Typography>
			)}
		</Stack>
	);
}
