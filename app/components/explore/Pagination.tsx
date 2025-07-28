import * as React from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	totalPages,
	currentPage,
	onPageChange,
}: PaginationProps) {
	return (
		<div>
			<Box
				className="Pagination-mobile"
				sx={{
					display: "flex",
					alignItems: "center",
					mx: 4,
					mb: 2,
				}}
			>
				<IconButton
					aria-label="previous page"
					variant="outlined"
					color="neutral"
					size="sm"
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				>
					<ArrowBackIosRoundedIcon />
				</IconButton>
				<Typography level="body-sm" sx={{ mx: "auto" }}>
					Observations {currentPage} of {totalPages}
				</Typography>
				<IconButton
					aria-label="next page"
					variant="outlined"
					color="neutral"
					size="sm"
					onClick={() =>
						onPageChange(Math.min(totalPages, currentPage + 1))
					}
				>
					<ArrowForwardIosRoundedIcon />
				</IconButton>
			</Box>
		</div>
	);
}
