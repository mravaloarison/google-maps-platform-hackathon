import { Box, Typography, Link } from "@mui/joy";

export default function Footer() {
	return (
		<Box component="footer" sx={{ py: 3 }}>
			<Typography level="body-xs" sx={{ textAlign: "center" }}>
				Powered by{" "}
				<Link
					sx={{
						fontWeight: "900",
					}}
					color="neutral"
					href="https://mapsplatform.google.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Google Maps Platform
				</Link>
				,{" "}
				<Link
					sx={{
						fontWeight: "900",
					}}
					color="neutral"
					href="https://deepmind.google/technologies/gemini/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Gemini
				</Link>{" "}
				and{" "}
				<Link
					sx={{
						fontWeight: "900",
					}}
					color="neutral"
					href="https://www.gbif.org/developer/summary"
					target="_blank"
					rel="noopener noreferrer"
				>
					GBIF
				</Link>
			</Typography>
			<Typography level="body-xs" sx={{ textAlign: "center" }}>
				© Built by{" "}
				<Link
					sx={{
						fontWeight: "900",
					}}
					color="neutral"
					href="https://mravaloarison.work"
					target="_blank"
					rel="noopener noreferrer"
				>
					Mami
				</Link>{" "}
				{new Date().getFullYear()}
			</Typography>
		</Box>
	);
}
