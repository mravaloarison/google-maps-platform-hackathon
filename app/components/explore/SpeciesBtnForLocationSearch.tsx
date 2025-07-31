import { AccessTime, LocationOn, Visibility } from "@mui/icons-material";
import {
	Typography,
	Card,
	CardOverflow,
	AspectRatio,
	CardContent,
	Stack,
} from "@mui/joy";
import TaxonTitle from "@/app/components/explore/TaxonTitleForLocationSearch";

interface Observation {
	observer: string;
	observed_on: string;
	place_guess: string | null;
	image: string | null;
	taxon: {
		id: number;
		scientific_name: string;
		common_name: string | null;
		wikipedia_url: string | null;
	} | null;
}

export default function SpeciesBtnForLocationSearch({
	obs,
}: {
	obs: Observation;
}) {
	function timeAgo(dateString: string) {
		const now = new Date();
		const date = new Date(dateString);
		const diff = now.getTime() - date.getTime();

		const seconds = Math.floor(diff / 1000);
		if (seconds < 60)
			return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

		const minutes = Math.floor(seconds / 60);
		if (minutes < 60)
			return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

		const days = Math.floor(hours / 24);
		if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

		const months = Math.floor(days / 30);
		if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

		const years = Math.floor(months / 12);
		return `${years} year${years !== 1 ? "s" : ""} ago`;
	}

	const getHighResImage = (url: string) => {
		return url.replace("square", "medium").replace("small", "medium");
	};

	return (
		<>
			<Card
				variant="outlined"
				orientation="horizontal"
				sx={{
					bgcolor: "neutral.softBg",
					display: "flex",
					flexDirection: { sm: "row", xs: "column" },
					"&:hover": {
						boxShadow: "lg",
						borderColor:
							"var(--joy-palette-neutral-outlinedDisabledBorder)",
					},
				}}
			>
				<CardOverflow
					sx={{
						mr: { xs: "var(--CardOverflow-offset)", sm: 0 },
						mb: { xs: 0, sm: "var(--CardOverflow-offset)" },
						"--AspectRatio-radius": {
							xs: "calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0",
							sm: "calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0 calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px))",
						},
					}}
				>
					<AspectRatio
						ratio="1"
						sx={{
							minWidth: { sm: 120, md: 160 },
							width: "100%",
							"--AspectRatio-maxHeight": {
								xs: "160px",
								sm: "9999px",
							},
						}}
					>
						{obs.image && (
							<img
								src={getHighResImage(obs.image)}
								alt={`Observation by ${obs.observer}`}
								style={{ objectFit: "cover" }}
							/>
						)}
					</AspectRatio>
				</CardOverflow>

				<CardContent>
					<Stack
						sx={{
							height: "100%",
							justifyContent: "space-between",
							flexGrow: 1,
						}}
					>
						<TaxonTitle taxon={obs.taxon} />
						<Stack spacing={0.5} sx={{ mt: 1 }}>
							{obs.observer && (
								<Typography
									level="body-xs"
									startDecorator={
										<Visibility color="success" />
									}
								>
									<strong
										style={{
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 1,
											WebkitBoxOrient: "vertical",
										}}
									>
										{obs.observer}
									</strong>
								</Typography>
							)}

							{obs.observed_on && (
								<Typography
									level="body-xs"
									startDecorator={
										<AccessTime color="success" />
									}
								>
									{timeAgo(obs.observed_on)}
								</Typography>
							)}

							<Typography
								startDecorator={<LocationOn color="success" />}
								level="body-xs"
							>
								<span
									style={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										WebkitLineClamp: 1,
										WebkitBoxOrient: "vertical",
									}}
								>
									{obs.place_guess || "unknown location"}
								</span>
							</Typography>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
