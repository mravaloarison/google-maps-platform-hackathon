"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Link } from "@mui/joy";
import { Close, Shuffle } from "@mui/icons-material";
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
	key: number;
	canonicalName: string;
	vernacularName: string;
}

export default function Search({ tabIndex = 0 }: SearchProps) {
	const [searchValue, setSearchValue] = useState("");
	const [filteredLocationResults, setFilteredLocationResults] = useState<
		Country[]
	>([]);
	const [filteredSpeciesResults, setFilteredSpeciesResults] = useState<
		SpeciesResult[]
	>([]);
	const [countries, setCountries] = useState<Country[]>([]);
	const [suppressFetch, setSuppressFetch] = useState(false);

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

		if (searchValue.length > 0 && tabIndex === 1) {
			const results = countries.filter((c) =>
				c.description.en
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			);
			setFilteredLocationResults(results);
		} else if (searchValue.length > 0 && tabIndex === 0) {
			console.log("Fetching species results for:", searchValue);
			fetch(`/api/gbif_autocomplete_by_common?q=${searchValue}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.results) {
						console.log("Species results:", data.results);
						setFilteredSpeciesResults(data.results);
					} else {
						setFilteredSpeciesResults([]);
					}
				})
				.catch(() => {
					setFilteredSpeciesResults([]);
				});
		} else {
			setFilteredLocationResults([]);
			setFilteredSpeciesResults([]);
		}
	}, [searchValue, countries]);

	const handleLocationAutocompleteSelect = (
		countryName: string,
		countryCode: string
	) => {
		setSearchValue(countryName);

		console.log("Selected country:", countryName, countryCode);
		setTimeout(() => {
			setFilteredLocationResults([]);
		}, 0);
	};

	const handleSpeciesAutocompleteSelect = (
		name: string,
		canonicalName: string,
		key: number
	) => {
		setSearchValue(name);
		setSuppressFetch(true);

		console.log("Selected species:", name, canonicalName, key);
		setTimeout(() => {
			setFilteredSpeciesResults([]);
		}, 0);
	};

	return (
		<div>
			<Stack spacing={1} direction="row" sx={{ mb: 1.5 }}>
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
			<Link
				href="/explore"
				startDecorator={<Shuffle />}
				color="success"
				fontSize="sm"
			>
				Surprise me!
			</Link>
		</div>
	);
}
