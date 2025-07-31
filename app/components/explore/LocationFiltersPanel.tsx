"use client";

import * as React from "react";
import { Stack } from "@mui/joy";
import Checkbox from "@mui/joy/Checkbox";

interface LocationFilters {
	endemic: boolean;
	threatened: boolean;
	native: boolean;
}

interface LocationFiltersPanelProps {
	filters: LocationFilters;
	setFilters: React.Dispatch<React.SetStateAction<LocationFilters>>;
}

export default function LocationFiltersPanel({
	filters,
	setFilters,
}: LocationFiltersPanelProps) {
	return (
		<Stack spacing={2}>
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
