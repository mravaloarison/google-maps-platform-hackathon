import * as React from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

export default function HeaderSection() {
	return (
		<Stack sx={{ mb: 2 }}>
			<Stack
				direction="row"
				sx={{ justifyContent: "space-between", width: "100%" }}
			>
				<Typography level="h2">Explore Wildlife Near You</Typography>
			</Stack>
			<Typography level="body-md" color="neutral">
				Discover Species Around the World
			</Typography>
		</Stack>
	);
}
