## Inspiration
Nature should be as easy to explore as city life. When you search on Google Maps for coffee shops or restaurants near you, results are instant. The idea was to re-create the same experience but for wildlife and biodiversity.

Instead of making biodiversity data complicated and intimidating (as it often is in scientific apps), this project focuses on making it accessible and curiosity-driven for everyone.

## Why not just use iNaturalist/GBIF/IUCN directly?
These platforms are amazing for research but are not built for casual exploration. This project is designed to make nature as approachable as opening Google Maps for any places we go to everyday.

## Where are the data coming from
It uses verified records from:
- [iNaturalist](https://www.inaturalist.org/)
- [GBIF](https://www.gbif.org/)
- [IUCN Red List](https://www.iucnredlist.org/) 

to display verified species sightings.

## How It Uses Google Maps Platform
- `Location-based search:` Reverse geocoding and Places API help users choose regions intuitively.
- `Map-based exploration:` The app uses the Maps JavaScript API to visualize nearby species like you would see restaurants or cafes.
- `Seamless navigation:` Users pan and zoom the map to see species clusters and sighting locations.

## Tech Stack
- Next.js 14 (React)
- Google Maps Platform (Maps, Places, Geocoding APIs)
- iNaturalist API
- GBIF API
- IUCN Red List API
- Joy UI (MUI) for modern UI components
