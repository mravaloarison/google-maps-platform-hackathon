import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import HeaderSection from "@/app/components/Navbar";
import GoogleMapsLayout from "@/app/components/Maps";

export default function ExploreByLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<CssVarsProvider disableTransitionOnChange>
			<CssBaseline />
			<HeaderSection />
			<Box
				component="div"
				sx={{
					height: "calc(100vh - 80px)",
					display: "grid",
					gridTemplateColumns: { xs: "auto", md: "33% 67%" },
				}}
			>
				{children}
				<Box
					sx={{
						gridRow: "span 3",
						display: { xs: "none", md: "flex" },
						backgroundColor: "background.level1",
					}}
				>
					<GoogleMapsLayout />
				</Box>
			</Box>
		</CssVarsProvider>
	);
}
