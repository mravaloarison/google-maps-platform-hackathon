import type { Metadata } from "next";
import { CssVarsProvider } from "@mui/joy/styles";
import "@fontsource/inter";

export const metadata: Metadata = {
	title: "Nature Explorer",
	description: "Google Maps Platform Hackathon",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<CssVarsProvider>{children}</CssVarsProvider>
			</body>
		</html>
	);
}
