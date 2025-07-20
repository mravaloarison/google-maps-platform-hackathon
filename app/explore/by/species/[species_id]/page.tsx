"use client";

import React, { useState, useEffect } from "react";

interface Observation {
	observer: string;
	observed_on: string;
	time_observed_at: string | null;
	location: string;
	image: string | null;
}

interface SpeciesDetails {
	taxon_id: string;
	common_name?: string;
	scientific_name?: string;
	image?: string;
	summary?: string;
	iucn_status?: string | null;
	is_endemic?: boolean | null;
	page: number;
	total_results: number;
	observations: Observation[];
}

interface PageProps {
	params: Promise<{ species_id: string }>;
}
const PER_PAGE = 10;

export default function SpeciesDetailsPage({ params }: PageProps) {
	const { species_id } = React.use(params);

	const [page, setPage] = useState(1);
	const [speciesDetails, setSpeciesDetails] = useState<SpeciesDetails | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSpeciesDetails = async (taxonId: string, pageNumber: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/i_naturalist/species_details?taxon_id=${taxonId}&page=${pageNumber}`
			);
			if (!res.ok) {
				throw new Error("Failed to fetch species details");
			}
			const data: SpeciesDetails = await res.json();
			setSpeciesDetails(data);
		} catch (err: any) {
			setError(err.message || "Unknown error");
			setSpeciesDetails(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSpeciesDetails(species_id, page);
	}, [species_id, page]);

	if (loading) {
		return <p>Loading species details...</p>;
	}

	if (error) {
		return <p style={{ color: "red" }}>Error: {error}</p>;
	}

	if (!speciesDetails) {
		return <p>No data available.</p>;
	}

	const {
		common_name,
		scientific_name,
		image,
		summary,
		iucn_status,
		is_endemic,
		observations,
		total_results,
	} = speciesDetails;

	const totalPages = Math.ceil(total_results / PER_PAGE);

	function timeAgo(dateString: string) {
		const now = new Date();
		const date = new Date(dateString);
		const diff = now.getTime() - date.getTime();

		const seconds = Math.floor(diff / 1000);
		if (seconds < 60)
			return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

		const minutes = Math.floor(seconds / 60);
		if (minutes < 60)
			return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

		const days = Math.floor(hours / 24);
		if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

		const months = Math.floor(days / 30);
		if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

		const years = Math.floor(months / 12);
		return `${years} year${years !== 1 ? "s" : ""} ago`;
	}

	return (
		<main style={{ padding: 20 }}>
			<header style={{ display: "flex", alignItems: "center", gap: 20 }}>
				{image && (
					<img
						src={image}
						alt={common_name ?? scientific_name}
						style={{
							width: 120,
							height: 120,
							objectFit: "cover",
							borderRadius: 8,
						}}
					/>
				)}
				<div>
					<h1>{common_name ?? scientific_name}</h1>
					{common_name && (
						<h2 style={{ fontStyle: "italic", color: "#555" }}>
							{scientific_name}
						</h2>
					)}
					{iucn_status && (
						<p>
							<strong>Conservation Status:</strong> {iucn_status}
						</p>
					)}
					{is_endemic !== null && (
						<p>
							<strong>Is Endemic:</strong>{" "}
							{is_endemic ? "Yes" : "No"}
						</p>
					)}
				</div>
			</header>

			{summary && (
				<section style={{ marginTop: 20 }}>
					<h3>Summary</h3>
					<div
						dangerouslySetInnerHTML={{ __html: summary ?? "" }}
						style={{ lineHeight: 1.5 }}
					/>
				</section>
			)}

			<section style={{ marginTop: 30 }}>
				<h3>
					Observations (Page {page} of {totalPages})
				</h3>
				{observations.length === 0 && <p>No observations found.</p>}
				<ul style={{ listStyle: "none", paddingLeft: 0 }}>
					{observations.map((obs, i) => (
						<li
							key={`${obs.observer}-${i}`}
							style={{
								display: "flex",
								gap: 15,
								alignItems: "center",
								padding: 10,
								borderBottom: "1px solid #ccc",
							}}
						>
							{obs.image && (
								<img
									src={obs.image}
									alt={`Observation by ${obs.observer}`}
									style={{
										width: 80,
										height: 80,
										objectFit: "cover",
										borderRadius: 6,
									}}
								/>
							)}
							<div>
								<p>
									<strong>Observer:</strong> {obs.observer}
								</p>
								<p>{timeAgo(obs.observed_on)}</p>
								<p>
									<strong>Location:</strong> {obs.location}
								</p>
							</div>
						</li>
					))}
				</ul>

				<nav style={{ marginTop: 20, display: "flex", gap: 10 }}>
					<button
						disabled={page <= 1}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						Previous
					</button>
					<button
						disabled={page >= totalPages}
						onClick={() =>
							setPage((p) => Math.min(totalPages, p + 1))
						}
					>
						Next
					</button>
				</nav>
			</section>
		</main>
	);
}
