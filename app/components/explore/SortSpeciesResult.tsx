import * as React from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { SwapVert } from "@mui/icons-material";

export default function SortSpeciesResult() {
	return (
		<Select
			placeholder="Sort by"
			indicator={<KeyboardArrowDown />}
			sx={{
				[`& .${selectClasses.indicator}`]: {
					transition: "0.2s",
					[`&.${selectClasses.expanded}`]: {
						transform: "rotate(-180deg)",
					},
				},
			}}
			startDecorator={<SwapVert />}
		>
			<Option value="dog">earliest</Option>
			<Option value="cat">latest</Option>
		</Select>
	);
}
