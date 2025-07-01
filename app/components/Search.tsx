"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
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
	onSelectCountry: (countryCode: string, countryName: string) => void;
	onTyping?: () => void;
}

export default function Search({ onSelectCountry, onTyping }: Props) {
	const [query, setQuery] = useState("");
	const [allCountries, setAllCountries] = useState<Country[]>([]);
	const [filtered, setFiltered] = useState<Country[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<Country | null>(
		null
	);
	const [noResult, setNoResult] = useState<string | null>(null);
	const [showSuggestionBanner, setShowSuggestionBanner] = useState(false);

	useEffect(() => {
		const fetchCountries = async () => {
			const res = await fetch("/api/countries");
			const data = await res.json();
			setAllCountries(data);
		};
		fetchCountries();
	}, []);

	useEffect(() => {
		if (query.length > 0) {
			const results = allCountries.filter((c) =>
				c.description.en.toLowerCase().includes(query.toLowerCase())
			);
			setFiltered(results.slice(0, 10));
			setNoResult(null);
		} else {
			setFiltered([]);
		}
	}, [query, allCountries]);

	const handleAutocompleteSelect = (name: string, code: string) => {
		setQuery(name);
		setSelectedCountry({ description: { en: name }, code });
		setNoResult(null);
		setShowSuggestionBanner(true);

		setTimeout(() => {
			setFiltered([]);
		}, 0);
	};

	const handleSearch = () => {
		const match = allCountries.find(
			(c) => c.description.en.toLowerCase() === query.toLowerCase()
		);

		setShowSuggestionBanner(false);

		if (match) {
			onSelectCountry(match.code, match.description.en);
			setNoResult(null);
		} else {
			setNoResult(query);
		}
	};

	return (
		<div style={{ position: "relative" }}>
			<Stack spacing={1} direction="row" sx={{ mb: 2 }}>
				<FormControl sx={{ flex: 1 }}>
					<Input
						placeholder="Search a location (e.g., Madagascar, Bronx Zoo...)"
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setSelectedCountry(null);
							setNoResult(null);
							onTyping?.();
						}}
						startDecorator={<SearchRoundedIcon />}
						aria-label="Search"
					/>
					{filtered.length > 0 && (
						<List
							sx={{
								position: "absolute",
								top: "100%",
								left: 0,
								right: 0,
								zIndex: 10,
								backgroundColor: "#fff",
								borderRadius: "md",
								mt: 1,
								boxShadow: "md",
								maxHeight: 200,
								overflowY: "auto",
							}}
						>
							{filtered.map((country) => (
								<ListItem key={country.code}>
									<ListItemButton
										onClick={() =>
											handleAutocompleteSelect(
												country.description.en,
												country.code
											)
										}
									>
										{country.description.en}
									</ListItemButton>
								</ListItem>
							))}
						</List>
					)}
				</FormControl>
				<Button variant="solid" color="success" onClick={handleSearch}>
					Search
				</Button>
			</Stack>

			{noResult && (
				<Typography level="body-sm" color="danger">
					No result for "{noResult}"
				</Typography>
			)}

			{showSuggestionBanner && selectedCountry && (
				<Typography level="body-sm" sx={{ mt: 1 }}>
					Showing results for "{selectedCountry.description.en}"
				</Typography>
			)}
		</div>
	);
}
