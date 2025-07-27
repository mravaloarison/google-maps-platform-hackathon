import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

type RentalCardProps = {
	category: React.ReactNode;
	image: string;
	liked?: boolean;
	rareFind?: boolean;
	title: React.ReactNode;
	children?: React.ReactNode;
};

export default function SpeciesCard({
	image,
	category,
	title,
	rareFind = false,
	liked = false,
	children,
}: RentalCardProps) {
	const [isLiked, setIsLiked] = React.useState(liked);

	return (
		<Card
			variant="outlined"
			orientation="horizontal"
			sx={{
				bgcolor: "neutral.softBg",
				display: "flex",
				flexDirection: { xs: "column", sm: "row" },
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
					flex
					sx={{
						minWidth: { sm: 120, md: 160 },
						"--AspectRatio-maxHeight": {
							xs: "160px",
							sm: "9999px",
						},
					}}
				>
					<img alt="" src={image} />
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							position: "absolute",
							top: 0,
							width: "100%",
							p: 1,
						}}
					>
						{rareFind && (
							<Chip
								variant="soft"
								color="success"
								startDecorator={<WorkspacePremiumRoundedIcon />}
								size="md"
							>
								Rare find
							</Chip>
						)}
						<IconButton
							variant="plain"
							size="sm"
							color={isLiked ? "danger" : "neutral"}
							onClick={() => setIsLiked((prev) => !prev)}
							sx={{
								display: { xs: "flex", sm: "none" },
								ml: "auto",
								borderRadius: "50%",
								zIndex: "20",
							}}
						>
							<FavoriteRoundedIcon />
						</IconButton>
					</Stack>
				</AspectRatio>
			</CardOverflow>
			<CardContent>
				<Stack
					spacing={1}
					direction="row"
					sx={{
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<div>
						<Typography level="body-sm">{category}</Typography>
						<Typography level="title-md">
							<Link
								overlay
								underline="none"
								href="#interactive-card"
								sx={{ color: "text.primary" }}
							>
								{title}
							</Link>
						</Typography>
					</div>
					<IconButton
						variant="plain"
						size="sm"
						color={isLiked ? "danger" : "neutral"}
						onClick={() => setIsLiked((prev) => !prev)}
						sx={{
							display: { xs: "none", sm: "flex" },
							borderRadius: "50%",
						}}
					>
						<FavoriteRoundedIcon />
					</IconButton>
				</Stack>

				{children && <Stack sx={{ mt: 1 }}>{children}</Stack>}
			</CardContent>
		</Card>
	);
}
