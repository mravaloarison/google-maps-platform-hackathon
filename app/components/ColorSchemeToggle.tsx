"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useColorScheme } from "@mui/joy";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import * as React from "react";

export default function ColorSchemeToggle(props: IconButtonProps) {
	const { onClick, ...other } = props;
	const { mode, setMode } = useColorScheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => setMounted(true), []);

	return (
		<IconButton
			aria-label="toggle light/dark mode"
			size="sm"
			variant="outlined"
			disabled={!mounted}
			onClick={(event) => {
				setMode(mode === "light" ? "dark" : "light");
				onClick?.(event);
			}}
			{...other}
		>
			{mode === "light" ? (
				<DarkModeRoundedIcon />
			) : (
				<LightModeRoundedIcon />
			)}
		</IconButton>
	);
}
