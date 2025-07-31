import * as React from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Sort } from "@mui/icons-material";

interface Props {
	onSortChange: (order: "asc" | "desc") => void;
	sortOrder: "asc" | "desc";
}

export default function SortSpeciesResult({ onSortChange, sortOrder }: Props) {
	const selectedValue = sortOrder === "asc" ? "earliest" : "latest";

	return (
		<Select
			value={selectedValue}
			onChange={(_, newValue) => {
				if (newValue === "earliest") onSortChange("asc");
				if (newValue === "latest") onSortChange("desc");
			}}
			placeholder="Order by"
			indicator={<KeyboardArrowDown />}
			startDecorator={<Sort />}
			sx={{
				[`& .${selectClasses.indicator}`]: {
					transition: "0.2s",
					[`&.${selectClasses.expanded}`]: {
						transform: "rotate(-180deg)",
					},
				},
			}}
		>
			<Option value="earliest">Earliest</Option>
			<Option value="latest">Latest</Option>
		</Select>
	);
}
