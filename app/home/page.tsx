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

	const fetchSpeciesByCountry = async (code: string, name: string) => {
		setShowResult(false);
		setIsLoading(true);
		setCountryName(name);

		const res = await fetch(`/api/countries/${code}`);
		const data = await res.json();

		const assessments = data.assessments || [];

		for (const assessment of assessments) {
			const assessmentId = assessment.assessment_id;

			try {
				const full = await fetch(
					`/api/iucn_assessment/${assessmentId}`
				);
				const fullData = await full.json();

				const taxon = fullData?.taxon || {};
				const red_list_category = fullData?.red_list_category || {};
				const documentation = fullData?.documentation || {};

				const commonName = taxon.common_names?.find(
					(n: any) => n.language === "eng"
				)?.name;

				const title =
					commonName ||
					taxon.scientific_name ||
					assessment.taxon_scientific_name;
				const category =
					taxon.class_name || assessment.red_list_category_code;

				const image = await getSpeciesImage(title);

				const habitats = documentation.habitats || "";
				const threats = documentation.threats || "";

				const redListCategory = red_list_category.description?.en || "";
				const redListCategoryCode = red_list_category.code || "";

				setSpeciesCards((prev) => [
					...prev,
					{
						title,
						category,
						image,
						redListCategory,
						redListCategoryCode,
						habitats,
						threats,
						liked: false,
					},
				]);
			} catch (err) {
				console.error(`Failed for Assessment ID ${assessmentId}:`, err);
			}
		}

		setShowResult(true);
		setIsLoading(false);
	};

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
						<Typography level="body-sm" sx={{ mt: 1 }}>
							{speciesCards.length >= 100
								? `100+ species found in ${countryName}`
								: `${speciesCards.length} species found in ${countryName}`}
						</Typography>
					)}

					{isLoading && (
						<Typography level="body-sm" sx={{ mt: 1 }}>
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
							<Typography>
								Loading species data... Please wait.
							</Typography>
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
