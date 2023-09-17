import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import { Marker, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// FontAwesome for Camera icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


// Gesture handling to show 'use 2 fingers to zoom'
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

// Start & End Markers for Map
import blueMarker from '../styles/images/marker-icon-2x-blue.png';
import greenMarker from '../styles/images/marker-icon-2x-green.png';
import markerShadow from '../styles/images/marker-shadow.png';


	export const RouteMap = ( {startPos, endPos, showStartMarker, showEndMarker, lineColour, route, interactive, laps, showLaps, lapColour, photos} ) => {
		console.log(photos);
		return 		<MapContainer
						center={ startPos }
						zoom={ 13 }
						zoomAnimation={false}
						fadeAnimation={false}						
						style={ { height: '400px' } }
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<ShowStartMarker
							showStartMarker={ showStartMarker }
							startPos={ startPos }
						></ShowStartMarker>

						<ShowEndMarker
							showEndMarker={ showEndMarker }
							endPos={endPos}
						></ShowEndMarker>
						
						<ShowLapMarkers
							showLaps={ showLaps }
							laps={ laps }
							lapColour={ lapColour }
						></ShowLapMarkers>

						<ShowPhotoMarkers
							photos={ photos }
						></ShowPhotoMarkers>

						<Polyline
							pathOptions={ { color: lineColour } }
							positions={ route }
						/>
						<FitBounds points={ route }></FitBounds>
						<InteractiveOptions
							interactive={ interactive }
						></InteractiveOptions>
					</MapContainer>;
	};

	const FitBounds = ( { points } ) => {
		const map = useMap();
		if ( ! points.length ) {
			return null;
		}

		const polyline = new L.Polyline( points );
		map.fitBounds( polyline.getBounds() );
		return null;
	};

	const InteractiveOptions = ( { interactive } ) => {
		const map = useMap();
		if ( interactive ) {
			map.gestureHandling.enable();
			map.touchZoom.enable();
			map.doubleClickZoom.enable();
			map.scrollWheelZoom.enable();
			map.boxZoom.enable();
			map.keyboard.enable();
			map.dragging.enable();
			// Add the Zoom control back in
			map.zoomControl.addTo( map );
		} else {
			map.gestureHandling.disable();
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
			map.boxZoom.disable();
			map.keyboard.disable();
			map.dragging.disable();
			// Remove the Zoom control
			map.zoomControl.remove();
		}
		return null;
	};

	const ShowStartMarker = ( { showStartMarker, startPos } ) => {
		if ( showStartMarker ) {
			const startMarker = new L.Icon( {
				iconUrl: greenMarker,
				shadowUrl: markerShadow,
				iconSize: [ 25, 41 ],
				iconAnchor: [ 12, 41 ],
				popupAnchor: [ 1, -34 ],
				shadowSize: [ 41, 41 ],
			} );
			return (
				<Marker
					position={ startPos }
					icon={ startMarker }
				></Marker>
			);
		}
		return null;
	};

	const ShowEndMarker = ( { showEndMarker, endPos } ) => {
		if ( showEndMarker ) {
			const endMarker = new L.Icon( {
				iconUrl: blueMarker,
				shadowUrl: markerShadow,
				iconSize: [ 25, 41 ],
				iconAnchor: [ 12, 41 ],
				popupAnchor: [ 1, -34 ],
				shadowSize: [ 41, 41 ],
			} );

			return (
				<Marker
					position={ endPos }
					icon={ endMarker }
				></Marker>
			);
		}
		return null;
	};

	const ShowLapMarkers = ( { showLaps, laps, lapColour } ) => {
		if (showLaps) {
			const lapMarkers = [];
			if (laps) {
				for (let i = 0; i < laps.length; i++)  {
					lapMarkers.push(
					<CircleMarker key={i} center={laps[i]} radius={5} pane={"markerPane"} pathOptions={{ color: lapColour, fillOpacity:0.8}} />
					);
				}
				return <>{ lapMarkers }</>;
			}
		}
		
		return null;
	};

	const ShowPhotoMarkers = ( { showPhotos, photos } ) => {
		if (true) {
			const photoMarkers = [];
// 			const fontAwesomeIcon = L.divIcon({
// 				html: '<i class="fa fa-camera fa-4x"></i>',
// 				iconSize: [20, 20],
// 				className: 'myDivIcon'
// 			});
			if (photos) {
				for (let i = 0; i < photos.length; i++)  {
					console.log(photos[i]);
					const lat = photos[i].lat;
					const lon = photos[i].lon;
// 					const marker = L.marker([{lat, lon}],{ icon:  fontAwesomeIcon})
// 					photoMarkers.push(marker);
					photoMarkers.push(
					<CircleMarker key={i} center={[photos[i].lat, photos[i].lon]} radius={5} pane={"markerPane"} pathOptions={{ color: "Red", fillOpacity:0.8}} />
					);

				}
				return <>{ photoMarkers }</>;
			}
		}
		
		return null;
	};
