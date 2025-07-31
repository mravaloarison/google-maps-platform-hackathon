"use client";

import * as React from "react";
import {
	Box,
	IconButton,
	CircularProgress,
	Menu,
	MenuItem,
	Typography,
	MenuButton,
	Dropdown,
} from "@mui/joy";
import { EmojiNature, Home, Place, Settings } from "@mui/icons-material";
// import ColorSchemeToggle from "./ColorSchemeToggle";
import Search from "./explore/Search";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import dynamic from "next/dynamic";

const ColorSchemeToggle = dynamic(
	() => import("@/app/components/ColorSchemeToggle"),
	{ ssr: false }
);

export default function HeaderSection() {
	const router = useRouter();
	const pathname = usePathname();
	const [navigating, setNavigating] = useState(false);

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const isSpeciesId = pathname.includes("/explore/by/species/");
	const [searchTabIndex, setSearchTabIndex] = useState(isSpeciesId ? 0 : 1);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		if (anchorEl) {
			setAnchorEl(null);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleSelectMode = (mode: "species" | "location") => {
		handleCloseMenu();
		if (mode === "species") {
			setSearchTabIndex(0);
		} else {
			setSearchTabIndex(1);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				width: "100%",
				top: 0,
				py: 1.5,
				px: 4,
				zIndex: 10000,
				backgroundColor: "background.body",
				borderBottom: "1px solid",
				borderColor: "divider",
				position: "sticky",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 1.5,
					width: { xs: "auto", md: "412px" },
				}}
			>
				<IconButton
					variant="soft"
					onClick={() => {
						setNavigating(true);
						router.push("/explore");
					}}
				>
					<Home />
				</IconButton>
				<Search tabIndex={searchTabIndex} />
				<Dropdown>
					<MenuButton
						slots={{ root: IconButton }}
						slotProps={{
							root: { variant: "outlined", color: "neutral" },
						}}
					>
						<Settings />
					</MenuButton>
					<Menu placement="bottom-start" sx={{ zIndex: 10000 }}>
						<MenuItem
							selected={searchTabIndex === 1}
							onClick={() => handleSelectMode("location")}
						>
							<Typography
								startDecorator={<Place color="success" />}
							>
								Search by Location
							</Typography>
						</MenuItem>
						<MenuItem
							selected={searchTabIndex === 0}
							onClick={() => handleSelectMode("species")}
						>
							<Typography
								startDecorator={<EmojiNature color="success" />}
							>
								Search by Species
							</Typography>
						</MenuItem>
					</Menu>
				</Dropdown>
			</Box>
			<Box
				sx={{ display: "flex", flexDirection: "row", gap: 3, pl: 1.5 }}
			>
				<ColorSchemeToggle sx={{ alignSelf: "center" }} />
			</Box>

			{navigating && (
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: "rgba(255,255,255,0.6)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 20,
						width: "100vw",
						height: "100vh",
					}}
				>
					<CircularProgress size="lg" />
				</div>
			)}
		</Box>
	);
}
