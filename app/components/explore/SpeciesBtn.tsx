import { AccessTime, PlaceOutlined } from "@mui/icons-material";
import { Button, Typography, Card } from "@mui/joy";

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

	return (
		<Card sx={{ borderRadius: 0, border: "0px solid transparent" }}>
			<Button
				variant="outlined"
				color="neutral"
				sx={{
					width: "100%",
					borderRadius: 0,
					border: "0px solid transparent",
					display: "flex",
					justifyContent: "start",
					gap: 3,
					alignItems: "start",
					textAlign: "left",
				}}
				startDecorator={
					obs.image && (
						<img
							src={obs.image}
							alt={`Observation by ${obs.observer}`}
							style={{
								width: 90,
								height: 90,
								objectFit: "cover",
								borderRadius: 6,
							}}
						/>
					)
				}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 6,
					}}
				>
					<Typography level="title-sm">
						By <strong>{obs.observer}</strong>
					</Typography>
					<Typography startDecorator={<AccessTime />} level="body-xs">
						{timeAgo(obs.observed_on)}
					</Typography>
					<Typography
						startDecorator={<PlaceOutlined />}
						level="body-xs"
					>
						{obs.location}
					</Typography>
				</div>
			</Button>
		</Card>
	);
}
