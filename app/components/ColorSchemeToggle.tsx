"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useColorScheme } from "@mui/joy";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";

export default function ColorSchemeToggle(props: IconButtonProps) {
	const { mode, setMode } = useColorScheme();

	if (mode === undefined) {
		return null;
	}

	return (
		<IconButton
			id="toggle-mode"
			size="sm"
			variant="outlined"
			color="neutral"
			aria-label="toggle light/dark mode"
			onClick={() => {
				setMode(mode === "light" ? "dark" : "light");
			}}
			{...props}
		>
			{mode === "light" ? (
				<LightModeRoundedIcon />
			) : (
				<DarkModeRoundedIcon />
			)}
		</IconButton>
	);
}
