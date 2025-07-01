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

interface Species {
	title: string;
	category: string;
	image: string;
	liked: boolean;
}

export default function RentalDashboard() {
	const [speciesCards, setSpeciesCards] = useState<Species[]>([]);
	const [countryName, setCountryName] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);

	const fetchSpeciesByCountry = async (code: string, name: string) => {
		setShowResult(false);
		setCountryName(name);

		const res = await fetch(`/api/countries/${code}`);
		const data = await res.json();

		const newCards = data.assessments?.map((item: any) => ({
			title: item.taxon_scientific_name,
			category: item.red_list_category_code,
			image: `https://source.unsplash.com/featured/?animal,${item.taxon_scientific_name}`,
			liked: false,
		}));

		setSpeciesCards(newCards || []);
		setShowResult(true);
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
					/>
					{showResult && countryName && (
						<Typography level="body-sm" sx={{ mt: 1 }}>
							{speciesCards.length} species found in {countryName}
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
						{speciesCards.map((species, index) => (
							<RentalCard
								key={index}
								title={species.title}
								category={species.category}
								image={species.image}
								liked={species.liked}
							/>
						))}
					</Stack>
				</Stack>
				<Pagination />
			</Box>
		</CssVarsProvider>
	);
}
