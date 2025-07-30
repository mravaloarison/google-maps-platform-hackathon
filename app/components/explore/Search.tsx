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

interface SearchProps {
	tabIndex?: number;
}

interface Country {
	code: string;
	description: {
		en: string;
	};
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
		Country[]
	>([]);
	const [filteredSpeciesResults, setFilteredSpeciesResults] = useState<
		SpeciesResult[]
	>([]);
	const [countries, setCountries] = useState<Country[]>([]);
	const [suppressFetch, setSuppressFetch] = useState(false);
	const [loading, setLoading] = useState(false);

	const controllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const fetchCountries = async () => {
			const res = await fetch("/api/countries");
			const data: Country[] = await res.json();
			setCountries(data);
		};
		fetchCountries();
	}, []);

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
			const results = countries.filter((c) =>
				c.description.en
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			);
			setFilteredLocationResults(results);
		} else if (tabIndex === 0) {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
			const controller = new AbortController();
			controllerRef.current = controller;

			setLoading(true);
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
				})
				.finally(() => setLoading(false));
		}
	}, [searchValue, tabIndex, countries]);

	const handleLocationAutocompleteSelect = (
		countryName: string,
		countryCode: string
	) => {
		setSearchValue(countryName);
		setTimeout(() => setFilteredLocationResults([]), 0);

		router.push(`/explore/by/locations/${countryCode}`);
	};

	const handleSpeciesAutocompleteSelect = (
		common_name: string | null,
		scientific_name: string,
		taxon_id: number
	) => {
		setSearchValue(common_name ?? scientific_name);
		setSuppressFetch(true);
		setTimeout(() => setFilteredSpeciesResults([]), 0);

		router.push(`/explore/by/species/${taxon_id}`);
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
		</Stack>
	);
}
