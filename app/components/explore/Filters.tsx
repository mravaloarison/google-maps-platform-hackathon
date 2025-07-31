"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import { DialogContent, DialogTitle, Box } from "@mui/joy";
import Rule from "@mui/icons-material/Rule";
import SortSpeciesResult from "./SortSpeciesResult";

interface GenericFiltersProps {
	onSortChange: (order: "asc" | "desc") => void;
	sortOrder: "asc" | "desc";
	children?: React.ReactNode;
	onApply?: () => void;
}

export default function Filters({
	onSortChange,
	sortOrder,
	children,
	onApply,
}: GenericFiltersProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Stack
			useFlexGap
			direction="row"
			spacing={{ xs: 0, sm: 2 }}
			sx={{
				justifyContent: { xs: "space-between" },
				flexWrap: "wrap",
				minWidth: 0,
			}}
		>
			<Button
				variant="outlined"
				color="neutral"
				startDecorator={<Rule color="success" />}
				onClick={() => setOpen(true)}
			>
				Filters
			</Button>

			<SortSpeciesResult
				onSortChange={onSortChange}
				sortOrder={sortOrder}
			/>

			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				sx={{
					zIndex: 13000,
				}}
			>
				<ModalClose />
				<DialogTitle>Filters</DialogTitle>
				<DialogContent>
					<Box sx={{ p: 2 }}>{children}</Box>
				</DialogContent>
				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
						gap: 1,
						p: 1.5,
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Button
						color="success"
						variant="plain"
						startDecorator={<Rule />}
						onClick={() => {
							if (onApply) onApply();
							setOpen(false);
						}}
					>
						Apply Filters
					</Button>
				</Box>
			</Drawer>
		</Stack>
	);
}
