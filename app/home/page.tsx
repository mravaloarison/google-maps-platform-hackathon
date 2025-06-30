import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";

import NavBar from "../components/NavBar";
import RentalCard from "../components/RentalCard";
import HeaderSection from "../components/HeaderSection";
import Search from "../components/Search";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { speciesCards } from "../testData";

export default function RentalDashboard() {
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
					<Search />
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
