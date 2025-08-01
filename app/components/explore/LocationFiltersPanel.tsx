"use client";

import * as React from "react";
import { Stack, Typography, Input } from "@mui/joy";
import Checkbox from "@mui/joy/Checkbox";

interface LocationFilters {
	endemic: boolean;
	threatened: boolean;
	native: boolean;
}

interface LocationFiltersPanelProps {
	filters: LocationFilters;
	setFilters: React.Dispatch<React.SetStateAction<LocationFilters>>;
	pendingPerPage: number;
	setPendingPerPage: (value: number) => void;
}

export default function LocationFiltersPanel({
	filters,
	setFilters,
	pendingPerPage,
	setPendingPerPage,
}: LocationFiltersPanelProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = parseInt(e.target.value, 10);
		if (isNaN(value)) value = 50;
		if (value < 1) value = 1;
		if (value > 200) value = 200;
		setPendingPerPage(value);
	};

	return (
		<Stack spacing={2}>
			<Typography level="body-md">Results per page (max 200)</Typography>
			<Input
				type="number"
				value={pendingPerPage}
				onChange={handleChange}
				slotProps={{
					input: { min: 1, max: 200, step: 49 },
				}}
				sx={{ width: "100%" }}
			/>
			{pendingPerPage === 200 && (
				<Typography level="body-xs" color="warning">
					200 is the maximum. Upgrade coming soon for larger pages.
				</Typography>
			)}
			<Checkbox
				variant="soft"
				color="success"
				label="Endemic species only"
				checked={filters.endemic}
				onChange={(e) =>
					setFilters((prev) => ({
						...prev,
						endemic: e.target.checked,
					}))
				}
			/>
			<Checkbox
				variant="soft"
				color="success"
				label="Threatened species only"
				checked={filters.threatened}
				onChange={(e) =>
					setFilters((prev) => ({
						...prev,
						threatened: e.target.checked,
					}))
				}
			/>
			<Checkbox
				variant="soft"
				color="success"
				label="Native species only"
				checked={filters.native}
				onChange={(e) =>
					setFilters((prev) => ({
						...prev,
						native: e.target.checked,
					}))
				}
			/>
		</Stack>
	);
}
