import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import HeaderSection from "@/app/components/Navbar";

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
						backgroundSize: "cover",
						backgroundImage:
							'url("https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3731&q=80")',
					}}
				/>
			</Box>
		</CssVarsProvider>
	);
}
