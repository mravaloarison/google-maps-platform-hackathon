"use client";

import * as React from "react";
import { useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import NavBar from "../components/NavBar";
import RentalCard from "../components/RentalCard";
import HeaderSection from "../components/HeaderSection";
import Search from "../components/Search";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import RotateRight from "@mui/icons-material/RotateRight";

import { getSpeciesImage } from "../lib/getSpeciesImage";

interface Species {
	title: string;
	category: string;
	image: string;
	redListCategory: string;
	redListCategoryCode: string;
	habitats: string;
	threats: string;
	liked: boolean;
}

export default function RentalDashboard() {
	const [speciesCards, setSpeciesCards] = useState<Species[]>([]);
	const [countryName, setCountryName] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	React.useEffect(() => {
		setSpeciesCards([]);
	}, [countryName]);

	async function fetchSpeciesByCountry(code: string, name: string) {
		setShowResult(false);
		setIsLoading(true);
		setCountryName(name);

		// 1. Fetch occurrences by country
		const occRes = await fetch(
			`https://api.gbif.org/v1/occurrence/search?country=${code}&limit=100`
		);
		const occJson = await occRes.json();

		// 2. Extract top species keys from the facets
		const facet = occJson.facets?.find(
			(f: any) => f.field === "speciesKey"
		);
		const speciesKeys: number[] =
			facet?.counts.map((c: any) => c.name) || [];

		// 3. Fetch details and media for each species (just first 10 for demo)
		const detailed = await Promise.all(
			speciesKeys.slice(0, 10).map(async (key: number) => {
				const [spRes, mediaRes] = await Promise.all([
					fetch(`https://api.gbif.org/v1/species/${key}`),
					fetch(`https://api.gbif.org/v1/species/${key}/media`),
				]);
				const spJson = await spRes.json();
				const mediaJson = await mediaRes.json();

				const imageUrl =
					mediaJson.results?.find((m: any) => m.type === "StillImage")
						?.identifier || null;

				return {
					speciesKey: key,
					scientificName: spJson.scientificName,
					vernacularName: spJson.vernacularName || null,
					image: imageUrl,
				};
			})
		);

		console.log(detailed);

		// update UI state as needed
		setSpeciesCards(
			detailed.map((item) => ({
				title: item.vernacularName || item.scientificName,
				category: item.scientificName,
				image: item.image || "",
				redListCategory: "", // you'd add this if fetched
				redListCategoryCode: "",
				habitats: "",
				threats: "",
				liked: false,
			}))
		);

		setShowResult(true);
		setIsLoading(false);
	}

	return (
		<CssVarsProvider disableTransitionOnChange>
			<CssBaseline />
			<NavBar />
			<Box
				component="main"
				sx={{
					height: "calc(100vh - 55px)",
					display: "grid",
					gridTemplateColumns: { xs: "auto", md: "40% 60%" },
					gridTemplateRows: "auto 1fr auto",
				}}
			>
				<Stack
					sx={{
						backgroundColor: "background.surface",
						px: { xs: 2, md: 4 },
						py: 2,
						borderBottom: "1px solid",
						borderColor: "divider",
					}}
				>
					<HeaderSection />
					<Search
						onSelectCountry={(code, name) =>
							fetchSpeciesByCountry(code, name)
						}
						onTyping={() => setShowResult(false)}
						isLoading={isLoading}
					/>

					{showResult && countryName && (
						<Typography level="body-sm">
							{speciesCards.length >= 100
								? `100+ species found in ${countryName}`
								: `${speciesCards.length} species found in ${countryName}`}
						</Typography>
					)}

					{isLoading && (
						<Typography level="body-sm">
							Loading species data... Please wait.
						</Typography>
					)}
				</Stack>

				<Box
					sx={{
						gridRow: "span 3",
						display: { xs: "none", md: "flex" },
						backgroundColor: "background.level1",
						backgroundSize: "cover",
						backgroundImage:
							'url("https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3731&q=80")',
					}}
				/>

				<Stack
					spacing={2}
					sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}
				>
					<Filters />
					<Stack spacing={2} sx={{ overflow: "auto" }}>
						{speciesCards.length === 1 ? (
							<RotateRight
								style={{ width: 24, height: 24 }}
								sx={{
									animation: "spin 2s linear infinite",
									color: "primary.main",
								}}
							/>
						) : (
							speciesCards.map((species, index) => (
								<RentalCard
									key={index}
									title={species.title}
									category={species.category}
									image={species.image}
									liked={species.liked}
								/>
							))
						)}
						{isLoading ?? (
							<Box
								sx={{
									height: 160,
									borderRadius: "md",
									backgroundColor: "neutral.softBg",
									animation:
										"pulse 1.5s infinite ease-in-out",
								}}
							/>
						)}
					</Stack>
				</Stack>
				<Pagination />
			</Box>
		</CssVarsProvider>
	);
}
