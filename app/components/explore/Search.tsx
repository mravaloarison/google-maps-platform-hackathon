"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Close } from "@mui/icons-material";
import LocationAutocompleteList from "./LocationAutocompleteList";
import SpeciesAutocompleteList from "./SpeciesAutocompleteList";

import CircularProgress from "@mui/joy/CircularProgress";

interface SearchProps {
	tabIndex?: number;
}

interface Location {
	id: number;
	display_name: string;
	geometry_geojson: any;
	bounding_box_geojson: any;
	location: string;
}

interface SpeciesResult {
	taxon_id: number;
	common_name: string | null;
	scientific_name: string;
	rank: string;
	image: string | null;
}

export default function Search({ tabIndex = 0 }: SearchProps) {
	const router = useRouter();

	const [searchValue, setSearchValue] = useState("");
	const [filteredLocationResults, setFilteredLocationResults] = useState<
		Location[]
	>([]);
	const [filteredSpeciesResults, setFilteredSpeciesResults] = useState<
		SpeciesResult[]
	>([]);
	const [suppressFetch, setSuppressFetch] = useState(false);

	const controllerRef = useRef<AbortController | null>(null);
	const [navigating, setNavigating] = useState(false);

	useEffect(() => {
		if (suppressFetch) {
			setSuppressFetch(false);
			return;
		}

		if (searchValue.length === 0) {
			setFilteredLocationResults([]);
			setFilteredSpeciesResults([]);
			return;
		}

		if (tabIndex === 1) {
			fetch(
				`/api/i_naturalist/places_autocomplete?q=${encodeURIComponent(
					searchValue
				)}`
			)
				.then((res) => res.json())
				.then((data: Location[]) => {
					setFilteredLocationResults(data);
				})
				.catch((err) => {
					console.error("Locations fetch failed:", err);
					setFilteredLocationResults([]);
				});
		} else if (tabIndex === 0) {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
			const controller = new AbortController();
			controllerRef.current = controller;

			fetch(
				`/api/i_naturalist/species_autocomplete?query=${encodeURIComponent(
					searchValue
				)}`,
				{ signal: controller.signal }
			)
				.then((res) => res.json())
				.then((data) => {
					if (Array.isArray(data)) {
						setFilteredSpeciesResults(data);
					} else {
						setFilteredSpeciesResults([]);
					}
				})
				.catch((err) => {
					if (err.name !== "AbortError") {
						console.error("Species fetch failed:", err);
						setFilteredSpeciesResults([]);
					}
				});
		}
	}, [searchValue, tabIndex]);

	const handleLocationAutocompleteSelect = (place: Location) => {
		setNavigating(true);
		setSearchValue(place.display_name);
		setSuppressFetch(true);
		setFilteredLocationResults([]);

		setTimeout(() => {
			localStorage.setItem("selectedPlace", JSON.stringify(place));

			router.push(
				`/explore/by/locations/${place.id}/${encodeURIComponent(
					place.display_name
				)}`
			);

			setNavigating(false);
		}, 100);
	};

	const handleSpeciesAutocompleteSelect = (
		common_name: string | null,
		scientific_name: string,
		taxon_id: number
	) => {
		setNavigating(true);
		setSearchValue(common_name ?? scientific_name);
		setSuppressFetch(true);
		setFilteredSpeciesResults([]);
		setTimeout(() => {
			router.push(`/explore/by/species/${taxon_id}`);

			setNavigating(false);
		}, 100);
	};

	return (
		<Stack spacing={1} direction="row" sx={{ width: "100%" }}>
			<FormControl sx={{ flex: 1 }}>
				<Input
					autoComplete="off"
					placeholder={
						tabIndex === 0
							? "Enter species name"
							: "Enter a location"
					}
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					startDecorator={<SearchRoundedIcon />}
					endDecorator={
						searchValue && (
							<Close onClick={() => setSearchValue("")} />
						)
					}
					aria-label="Search"
					size="lg"
					sx={{
						"--Input-focusedHighlight": "#357a38",
						"--Input-focusedBorderColor": "#357a38",
						"&:focus-within": {
							"--Input-focusedHighlight": "#357a38",
							"--Input-focusedBorderColor": "#357a38",
						},
					}}
				/>
				<LocationAutocompleteList
					locations={filteredLocationResults}
					onSelect={handleLocationAutocompleteSelect}
				/>

				<SpeciesAutocompleteList
					speciesList={filteredSpeciesResults}
					onSelect={handleSpeciesAutocompleteSelect}
				/>
			</FormControl>
			{navigating && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						background: "rgba(255,255,255,0.6)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 9999,
						width: "100vw",
						height: "100vh",
					}}
				>
					<CircularProgress size="lg" />
				</div>
			)}
		</Stack>
	);
}
