import * as React from "react";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

export default function HeaderSectionLocationSearch({
	placeName,
}: {
	placeName: string;
}) {
	return (
		<Stack sx={{ my: 2 }}>
			<Stack
				direction="row"
				sx={{ justifyContent: "space-between", width: "100%" }}
			>
				<Typography level="h2">{placeName}</Typography>
			</Stack>
		</Stack>
	);
}
