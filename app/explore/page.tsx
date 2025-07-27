"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Footer from "../components/Footer";

import ColorSchemeToggle from "../components/ColorSchemeToggle";
import HeaderSection from "../components/HeaderSection";
import { NaturePeople } from "@mui/icons-material";
import HomeBody from "../components/explore/HomeBody";

export default function JoySignInSideTemplate() {
	return (
		<CssVarsProvider disableTransitionOnChange>
			<CssBaseline />
			<GlobalStyles
				styles={{
					":root": {
						"--Form-maxWidth": "800px",
						"--Transition-duration": "0.4s",
					},
				}}
			/>
			<Box
				sx={(theme) => ({
					width: { xs: "100%", md: "50vw" },
					transition: "width var(--Transition-duration)",
					transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
					position: "relative",
					zIndex: 1,
					display: "flex",
					justifyContent: "flex-end",
					backdropFilter: "blur(12px)",
					backgroundColor: "rgba(255 255 255 / 0.2)",
					[theme.getColorSchemeSelector("dark")]: {
						backgroundColor: "rgba(19 19 24 / 0.4)",
					},
				})}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						minHeight: "100dvh",
						width: "100%",
						px: 2,
					}}
				>
					<Box
						component="div"
						sx={{
							py: 3,
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								gap: 2,
								display: "flex",
								alignItems: "center",
							}}
						>
							<IconButton
								variant="soft"
								color="success"
								size="sm"
							>
								<NaturePeople />
							</IconButton>
							<Typography level="title-lg">
								Explore Wildlife
							</Typography>
						</Box>
						<ColorSchemeToggle />
					</Box>
					<Box
						component="div"
						sx={{
							my: "auto",
							py: 2,
							pb: 5,
							display: "flex",
							flexDirection: "column",
							gap: 2,
							width: 600,
							maxWidth: "100%",
							mx: "auto",
							borderRadius: "sm",
							"& form": {
								display: "flex",
								flexDirection: "column",
								gap: 2,
							},
							[`& .MuiFormLabel-asterisk`]: {
								visibility: "hidden",
							},
						}}
					>
						<HeaderSection />
						<HomeBody />
					</Box>
					<Footer />
				</Box>
			</Box>
			<Box
				sx={(theme) => ({
					height: "100%",
					position: "fixed",
					right: 0,
					top: 0,
					bottom: 0,
					left: { xs: 0, md: "50vw" },
					transition:
						"background-image var(--Transition-duration), left var(--Transition-duration) !important",
					transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
					backgroundColor: "background.level1",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundImage:
						"url(https://plus.unsplash.com/premium_photo-1667955009611-f4102162ed86?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjI5fHx3aWxkJTIwYW5pbWFsc3xlbnwwfHwwfHx8MA%3D%3D)",
					[theme.getColorSchemeSelector("dark")]: {
						backgroundImage:
							"url(https://images.unsplash.com/photo-1736242176145-d310381eaa65?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2lsZGxpZmUlMjBuaWdodHxlbnwwfHwwfHx8MA%3D%3D)",
					},
				})}
			/>
		</CssVarsProvider>
	);
}
