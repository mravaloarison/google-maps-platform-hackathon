"use client";

import React, { useState } from "react";
import { Box, Stack, Typography, Button, Drawer, IconButton } from "@mui/joy";
import DescriptionIcon from "@mui/icons-material/Description";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CloseIcon from "@mui/icons-material/Close";

interface Photo {
	url: string | null;
	attribution: string | null;
}

interface SpeciesHeaderProps {
	commonName?: string;
	scientificName?: string;
	photos?: Photo[];
	wikipediaUrl?: string | null;
}

export default function HeaderSectionSpeciesResult({
	commonName,
	scientificName,
	photos,
	wikipediaUrl,
}: SpeciesHeaderProps) {
	const [openDrawer, setOpenDrawer] = useState(false);

	const toggleDrawer =
		(inOpen: boolean) =>
		(event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}
			setOpenDrawer(inOpen);
		};

	function capitalizeFirstLetter(
		str: string | undefined
	): string | undefined {
		if (!str) {
			return undefined;
		}

		if (str.length === 0) {
			return "";
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	return (
		<div>
			<Stack
				sx={{
					flexGrow: 1,
					mb: 2.3,
					mt: 1,
				}}
			>
				<Typography
					level="h2"
					sx={{
						textAlign: "center",
					}}
				>
					{capitalizeFirstLetter(commonName) ?? scientificName}
				</Typography>
				{commonName && (
					<Typography
						level="body-md"
						color="neutral"
						sx={{
							textAlign: "center",
						}}
					>
						{scientificName}
					</Typography>
				)}
				<Stack
					spacing={1.5}
					direction="row"
					useFlexGap
					sx={{ mt: 2, flexGrow: 1 }}
				>
					<Button
						variant="soft"
						color="neutral"
						onClick={() => setOpenDrawer(true)}
						startDecorator={<DescriptionIcon />}
						sx={{
							width: "100%",
						}}
						disabled={!wikipediaUrl}
					>
						Read details
					</Button>

					<Button
						variant="outlined"
						color="success"
						startDecorator={<AddLocationAltIcon />}
						sx={{
							width: "100%",
						}}
					>
						Add sighting
					</Button>
				</Stack>
			</Stack>

			<Drawer
				anchor="left"
				open={openDrawer}
				onClose={toggleDrawer(false)}
				size="lg"
			>
				<Box
					sx={{
						p: 2,
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 2,
						}}
					>
						<Typography level="h4">
							{commonName ?? scientificName} – Details
						</Typography>
						<IconButton onClick={toggleDrawer(false)}>
							<CloseIcon />
						</IconButton>
					</Box>

					{wikipediaUrl ? (
						<Box
							sx={{
								flexGrow: 1,
								overflow: "hidden",
							}}
						>
							<iframe
								src={wikipediaUrl}
								style={{
									border: "none",
									width: "100%",
									height: "100%",
									backgroundColor: "transparent",
								}}
							/>
						</Box>
					) : (
						<Typography>No details available.</Typography>
					)}
				</Box>
			</Drawer>
		</div>
	);
}
