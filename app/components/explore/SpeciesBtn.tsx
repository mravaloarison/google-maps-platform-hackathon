import { LocationOn } from "@mui/icons-material";
import {
	Typography,
	Card,
	CardOverflow,
	AspectRatio,
	CardContent,
	Stack,
} from "@mui/joy";

interface Observation {
	observer: string;
	observed_on: string;
	time_observed_at: string | null;
	location: string;
	image: string | null;
}

export default function SpeciesBtn({ obs }: { obs: Observation }) {
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
		<Card
			variant="outlined"
			orientation="horizontal"
			sx={{
				bgcolor: "neutral.softBg",
				display: "flex",
				flexDirection: "row",
				"&:hover": {
					boxShadow: "lg",
					borderColor:
						"var(--joy-palette-neutral-outlinedDisabledBorder)",
				},
			}}
		>
			<CardOverflow
				sx={{
					mr: 0,
					mb: "var(--CardOverflow-offset)",
					"--AspectRatio-radius":
						"calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0 calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px))",
				}}
			>
				<AspectRatio
					ratio="1"
					sx={{
						minWidth: 150,
					}}
				>
					{obs.image && (
						<img
							src={obs.image ? getHighResImage(obs.image) : ""}
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
					<Stack>
						<Typography sx={{ fontWeight: "md" }}>
							By <strong>{obs.observer}</strong>
						</Typography>
						<Typography level="body-sm">
							{timeAgo(obs.observed_on)}
						</Typography>
					</Stack>
					<Typography
						startDecorator={<LocationOn color="success" />}
						level="body-sm"
					>
						{/* {obs.location} */}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}
