"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, LinearProgress, Button } from "@mui/joy";
import Filters from "@/app/components/explore/Filters";
import Pagination from "@/app/components/explore/Pagination";
import DescriptionIcon from "@mui/icons-material/Description";

import SpeciesBtnForLocationSearch from "@/app/components/explore/SpeciesBtnForLocationSearch";
import HeaderSectionLocationSearch from "@/app/components/explore/HeadeerSectionLocationSearch";
import LocationFiltersPanel from "@/app/components/explore/LocationFiltersPanel";

interface PageProps {
	params: Promise<{ location_id: string; location_name: string }>;
}

interface Observation {
	observer: string;
	observed_on: string;
	place_guess: string | null;
	image: string | null;
	taxon: {
		id: number;
		scientific_name: string;
		common_name: string | null;
		wikipedia_url: string | null;
	} | null;
}

const PER_PAGE = 50;

export default function LocationPage({ params }: PageProps) {
	const { location_id, location_name } = React.use(params);

	const [appliedFilters, setAppliedFilters] = useState({
		endemic: true,
		threatened: true,
		native: true,
	});

	const [pendingFilters, setPendingFilters] = useState(appliedFilters);

	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	function formatLocationName(slug: string) {
		const withSpaces = decodeURIComponent(slug).replace(/[-_]/g, " ");
		return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	const [observations, setObservations] = useState<Observation[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalResults, setTotalResults] = useState(0);
	const totalPages = Math.ceil(totalResults / PER_PAGE);

	const [error, setError] = useState<string | null>(null);

	const [page, setPage] = useState(1);
	const [appliedPerPage, setAppliedPerPage] = useState(PER_PAGE);
	const [pendingPerPage, setPendingPerPage] = useState(PER_PAGE);

	const fetchObservations = async (
		placeId: string,
		pageNumber: number,
		order: "asc" | "desc",
		perPage: number
	) => {
		setLoading(true);
		setError(null);

		const { endemic, threatened, native } = appliedFilters;

		const query = new URLSearchParams({
			place_id: placeId,
			page: String(pageNumber),
			order,
			endemic: String(endemic),
			threatened: String(threatened),
			native: String(native),
			per_page: String(perPage),
		});

		const selectedPlace = localStorage.getItem("selectedPlace");
		if (selectedPlace) {
			const place = JSON.parse(selectedPlace);
			window.dispatchEvent(
				new CustomEvent("highlight-place", {
					detail: place.bounding_box_geojson,
				})
			);
		}

		try {
			const res = await fetch(
				`/api/i_naturalist/species_by_location?${query.toString()}`
			);
			if (!res.ok) {
				throw new Error("Failed to fetch observations");
			}
			const data = await res.json();
			setObservations(data.observations || []);
			setTotalResults(data.total_results || 0);
			setPage(data.page || 1);
		} catch (err) {
			console.error("Failed to load observations:", err);
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchObservations(location_id, page, sortOrder, appliedPerPage);
	}, [location_id, page, sortOrder, appliedFilters, appliedPerPage]);

	useEffect(() => {
		if (observations && observations.length > 0) {
			localStorage.setItem("species", JSON.stringify(observations));

			window.dispatchEvent(new Event("species-updated"));
		}
	}, [observations]);

	useEffect(() => {
		const handler = (e: Event) => {
			const ce = e as CustomEvent<string>;
			const el = document.getElementById(`card-${ce.detail}`);
			if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
		};
		window.addEventListener("marker-clicked", handler);
		return () => window.removeEventListener("marker-clicked", handler);
	}, []);

	const [selectedKey, setSelectedKey] = useState<string | null>(null);

	useEffect(() => {
		const onMarkerClick = (e: Event) => {
			const ce = e as CustomEvent<string>;
			setSelectedKey(ce.detail);

			document.getElementById(`obs-${ce.detail}`)?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		};

		window.addEventListener("marker-clicked", onMarkerClick);
		return () =>
			window.removeEventListener("marker-clicked", onMarkerClick);
	}, []);

	if (loading) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 4,
				}}
			>
				<LinearProgress color="success" variant="soft" />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 4,
				}}
			>
				<Typography color="danger">Error: {error}</Typography>
			</Box>
		);
	}

	if (!observations) {
		return (
			<Box
				sx={{
					height: "calc(100vh - 70px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "background.surface",
					px: 4,
				}}
			>
				<Typography>No data available.</Typography>
			</Box>
		);
	}

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
					py: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
				spacing={2}
			>
				<HeaderSectionLocationSearch
					placeName={formatLocationName(location_name)}
				/>
				<Button
					variant="soft"
					color="neutral"
					sx={{ width: "fit-content" }}
					startDecorator={<DescriptionIcon color="success" />}
				>
					Read more about this location
				</Button>
				<Typography level="body-sm" color="neutral">
					Found{" "}
					<strong>{totalResults.toLocaleString("en-US")}</strong>{" "}
					species
				</Typography>
			</Stack>
			<Stack spacing={2} sx={{ px: 4, py: 2, minHeight: 0 }}>
				<Filters
					onSortChange={setSortOrder}
					sortOrder={sortOrder}
					onApply={() => setAppliedFilters(pendingFilters)}
				>
					<LocationFiltersPanel
						filters={pendingFilters}
						setFilters={setPendingFilters}
						pendingPerPage={pendingPerPage}
						setPendingPerPage={setPendingPerPage}
					/>
				</Filters>

				{loading ? (
					<LinearProgress color="success" variant="soft" />
				) : (
					<Stack spacing={2} sx={{ overflow: "auto" }}>
						{observations.map((obs, i) => (
							<SpeciesBtnForLocationSearch
								key={`${obs.observer}-${obs.observed_on}-${i}`}
								obs={obs}
								selected={
									selectedKey ===
									`${obs.observer}-${obs.observed_on}-${i}`
								}
								id={`obs-${obs.observer}-${obs.observed_on}-${i}`}
							/>
						))}
					</Stack>
				)}
			</Stack>

			<Pagination
				totalPages={totalPages}
				currentPage={page}
				onPageChange={(newPage) => setPage(newPage)}
			/>
		</Box>
	);
}
