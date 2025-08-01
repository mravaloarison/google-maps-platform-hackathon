"use client";

import React from "react";
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
	place_guess: string | null;
	image: string | null;
}

export default function SpeciesBtn({
	obs,
	selected,
	id,
}: {
	obs: Observation;
	selected?: boolean;
	id?: string;
}) {
	const [isClicked, setIsClicked] = React.useState(false);

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
			id={id}
			variant="outlined"
			orientation="horizontal"
			sx={{
				display: "flex",
				flexDirection: "row",
				transform: selected || isClicked ? "scale(1.03)" : "scale(1)",
				transition: "transform 0.2s ease",
				borderColor:
					selected || isClicked
						? "success.outlinedBorder"
						: "neutral.outlinedBorder",
				bgcolor:
					selected || isClicked ? "success.softBg" : "neutral.softBg",
				"&:hover": {
					boxShadow: "lg",
					borderColor:
						"var(--joy-palette-neutral-outlinedDisabledBorder)",
					cursor: "pointer",
				},
			}}
			onClick={() => {
				window.dispatchEvent(
					new CustomEvent("highlight-marker", {
						detail: id?.split("-").slice(1).join("-"),
					})
				);

				setIsClicked(true);
			}}
			onMouseLeave={() => {
				window.dispatchEvent(
					new CustomEvent("highlight-marker", { detail: null })
				);

				setIsClicked(false);
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
				<AspectRatio ratio="1" sx={{ minWidth: 106 }}>
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
					<Stack>
						<Typography
							sx={{
								fontWeight: "md",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								WebkitLineClamp: 1,
								WebkitBoxOrient: "vertical",
							}}
						>
							By <strong>{obs.observer}</strong>
						</Typography>
						<Typography level="body-sm">
							{timeAgo(obs.observed_on)}
						</Typography>
					</Stack>
					<Typography
						startDecorator={<LocationOn color="success" />}
						level="body-sm"
						sx={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "-webkit-box",
							WebkitLineClamp: 1,
							WebkitBoxOrient: "vertical",
						}}
					>
						{obs.place_guess || "unknown location"}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}
