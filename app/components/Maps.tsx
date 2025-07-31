"use client";

import { MarkerClusterer } from "@googlemaps/markerclusterer";
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
	const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

	useEffect(() => {
		const loadSpecies = () => {
			const storedSpecies = localStorage.getItem("species");
			if (storedSpecies) {
				const parsed = JSON.parse(storedSpecies);
				console.log("loadSpecies called, loaded count:", parsed.length);

				const formattedSpecies = parsed.map((obs: any, id: number) => ({
					key: `${obs.observer}-${obs.observed_on}-${id}`,
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

		const onHighlight = (e: Event) => {
			const ce = e as CustomEvent<string>;
			setHighlightedKey(ce.detail);
		};
		window.addEventListener("highlight-marker", onHighlight);

		return () => {
			window.removeEventListener("species-updated", loadSpecies);
			window.removeEventListener("highlight-marker", onHighlight);
		};
	}, []);

	return <>Lol</>;
	// return (
	// 	<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
	// 		<GoogleMap
	// 			style={{ width: "100%", height: "100%" }}
	// 			defaultCenter={{ lat: 22.54992, lng: 0 }}
	// 			defaultZoom={7}
	// 			mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || ""}
	// 		>
	// 			<Markers points={species} highlightedKey={highlightedKey} />
	// 			<FitBounds points={species} />
	// 		</GoogleMap>
	// 	</APIProvider>
	// );
}

type Points = google.maps.LatLngLiteral & { key: string };
type MarkersProps = {
	points: Points[];
	highlightedKey: string | null;
};

const Markers = ({ points, highlightedKey }: MarkersProps) => {
	const map = useMap();
	const clusterer = useRef<MarkerClusterer | null>(null);
	const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});

	// Initialize clusterer and add cluster click zoom
	useEffect(() => {
		if (!map) return;

		if (!clusterer.current) {
			clusterer.current = new MarkerClusterer({ map });

			const clusterclickListener = google.maps.event.addListener(
				clusterer.current,
				"clusterclick",
				(event: any) => {
					map.fitBounds(event.cluster.bounds);
				}
			);

			return () => {
				google.maps.event.removeListener(clusterclickListener);
				clusterer.current?.setMap(null);
				clusterer.current = null;
			};
		}
	}, [map]);

	// Add and update markers on points change
	useEffect(() => {
		if (!map || !clusterer.current) return;

		clusterer.current.clearMarkers();

		// Clear listeners on old markers before discarding
		Object.values(markersRef.current).forEach((marker) =>
			google.maps.event.clearInstanceListeners(marker)
		);

		markersRef.current = {};

		const newMarkers: { [key: string]: google.maps.Marker } = {};

		points.forEach((point) => {
			const marker = new google.maps.Marker({
				position: point,
			});

			marker.addListener("click", () => {
				map.panTo(marker.getPosition()!);
				map.setZoom(Math.max(map.getZoom() || 8, 12));

				window.dispatchEvent(
					new CustomEvent("marker-clicked", { detail: point.key })
				);
			});

			newMarkers[point.key] = marker;
		});

		markersRef.current = newMarkers;
		clusterer.current.addMarkers(Object.values(newMarkers));
	}, [points, map]);

	useEffect(() => {
		if (!map) return;

		Object.values(markersRef.current).forEach((m) => m.setAnimation(null));

		if (highlightedKey && markersRef.current[highlightedKey]) {
			const marker = markersRef.current[highlightedKey];
			marker.setAnimation(google.maps.Animation.BOUNCE);
			map.panTo(marker.getPosition()!);
		}
	}, [highlightedKey, map]);

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
