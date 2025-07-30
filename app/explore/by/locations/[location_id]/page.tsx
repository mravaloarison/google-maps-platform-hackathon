"use client";

import Search from "@/app/components/explore/Search";
import React from "react";

interface PageProps {
	params: Promise<{ country_code: string }>;
}

export default function LocationPage({ params }: PageProps) {
	const { country_code } = React.use(params);

	return (
		<div>{country_code}</div>
	);
}
