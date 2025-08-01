"use client";

import { Description } from "@mui/icons-material";
import { Button, Typography, Drawer, Box } from "@mui/joy";
import { ModalClose, DialogTitle, DialogContent } from "@mui/joy";

import React from "react";
import PlaceDescriptionDrawer from "./PlaceDescriptionDrawer";

export default function GeneratePlacesDescription({
	placeName,
}: {
	placeName: string;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<Button
				variant="soft"
				color="neutral"
				sx={{ width: "fit-content" }}
				startDecorator={<Description color="success" />}
				onClick={() => setOpen(true)}
			>
				Read more about this location
			</Button>

			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				sx={{ zIndex: 13000 }}
			>
				<ModalClose />
				<DialogTitle>
					<Description color="success" sx={{ mr: 1 }} />
					About {placeName}
				</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							padding: 2,
							display: "flex",
							flexDirection: "column",
						}}
					>
						<PlaceDescriptionDrawer placeName={placeName} />
					</Box>
				</DialogContent>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						p: 1.5,
						pb: 2,
						borderTop: "1px solid",
						borderColor: "divider",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Typography level="body-xs">
						Powered by <strong>Gemini</strong>
					</Typography>
				</Box>
			</Drawer>
		</React.Fragment>
	);
}
