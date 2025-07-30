"use client";

import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import {
	APIProvider,
	Map as GoogleMap,
	useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

interface Species {
	key: string;
	lat: number;
	lng: number;
}

export default function GoogleMapsLayout() {
	const [species, setSpecies] = useState<Species[]>([]);

	useEffect(() => {
		const loadSpecies = () => {
			const storedSpecies = localStorage.getItem("species");
			if (storedSpecies) {
				const parsed = JSON.parse(storedSpecies);
				console.log("loadSpecies called, loaded count:", parsed.length);

				const formattedSpecies = parsed.map((obs: any) => ({
					key: `${obs.observer}-${obs.observed_on}`,
					lat: parseFloat(obs.location.split(",")[0]),
					lng: parseFloat(obs.location.split(",")[1]),
				}));

				const uniqueSpecies: any = Array.from(
					new Map(
						formattedSpecies.map((item: any) => [item.key, item])
					).values()
				);

				setSpecies(uniqueSpecies);
			}
		};

		loadSpecies();
		window.addEventListener("species-updated", loadSpecies);
		return () => window.removeEventListener("species-updated", loadSpecies);
	}, []);

	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
			<GoogleMap
				style={{ width: "100%", height: "100%" }}
				defaultCenter={{ lat: 22.54992, lng: 0 }}
				defaultZoom={7}
				mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || ""}
			>
				<Markers points={species} />
				<FitBounds points={species} />
			</GoogleMap>
		</APIProvider>
	);
}

type Points = google.maps.LatLngLiteral & { key: string };
type Props = {
	points: Points[];
};

const Markers = ({ points }: Props) => {
	const map = useMap();
	const clusterer = useRef<MarkerClusterer | null>(null);
	const markersRef = useRef<{ [key: string]: Marker }>({});

	useEffect(() => {
		if (!map) return;
		if (!clusterer.current) {
			clusterer.current = new MarkerClusterer({ map });
		}
	}, [map]);

	useEffect(() => {
		if (!map || !clusterer.current) return;

		clusterer.current.clearMarkers();
		markersRef.current = {};

		const newMarkers: { [key: string]: Marker } = {};
		points.forEach((point) => {
			const marker = new google.maps.Marker({
				position: point,
			});
			newMarkers[point.key] = marker;
		});

		markersRef.current = newMarkers;
		clusterer.current.addMarkers(Object.values(newMarkers));
	}, [points, map]);

	return null;
};

const FitBounds = ({ points }: { points: Points[] }) => {
	const map = useMap();
	useEffect(() => {
		if (!map || points.length === 0) return;
		const bounds = new google.maps.LatLngBounds();
		points.forEach((p) => bounds.extend(p));
		map.fitBounds(bounds);
	}, [map, points]);
	return null;
};
