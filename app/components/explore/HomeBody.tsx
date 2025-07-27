import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { EmojiNature, LocationOn } from "@mui/icons-material";
import { TabPanel } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Search from "./Search";
import { useState } from "react";
import Link from "@mui/joy/Link";
import { Shuffle } from "@mui/icons-material";

export default function HomeBody() {
	const [index, setIndex] = useState(0);
	return (
		<Tabs
			aria-label="tabs"
			value={index}
			onChange={(event, newValue) => {
				event && event.preventDefault();
				setIndex(newValue as number);
			}}
		>
			<TabList
				variant="soft"
				tabFlex={1}
				sx={{
					[`& .${tabClasses.root}`]: {
						'&[aria-selected="true"]': {
							bgcolor: "background.surface",
							"&::before": {
								content: '""',
								display: "block",
								position: "absolute",
								height: 2,
								bottom: -2,
								left: 0,
								right: 0,
								bgcolor: "background.surface",
							},
						},
					},
				}}
			>
				<Tab indicatorPlacement="top">
					<ListItemDecorator>
						<EmojiNature color="success" />
					</ListItemDecorator>
					by Species
				</Tab>
				<Tab indicatorPlacement="top">
					<ListItemDecorator>
						<LocationOn color="success" />
					</ListItemDecorator>
					by Location
				</Tab>
			</TabList>
			<TabPanel value={index}>
				<Typography level="body-lg" sx={{ mb: 2 }}>
					{index === 0
						? "Search for a specific animal or plant by name and learn where it lives in the wild."
						: "Pick a country to see the creatures that call it home."}
				</Typography>
				<Search tabIndex={index} />
				<Link
					href={index === 0 ? "/explore" : "/explore/location"}
					startDecorator={<Shuffle />}
					color="success"
					fontSize="sm"
					sx={{
						pt: 1.5,
					}}
				>
					Surprise me!
				</Link>
			</TabPanel>
		</Tabs>
	);
}
