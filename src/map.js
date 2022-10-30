import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import { Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Start & End Markers for Map
import blueMarker from '../styles/images/marker-icon-2x-blue.png';
import greenMarker from '../styles/images/marker-icon-2x-green.png';
import markerShadow from '../styles/images/marker-shadow.png';


	export const RouteMap = ( {startPos, endPos, showStartMarker, showEndMarker, lineColour, route, interactive } ) => {
		return 		<MapContainer
						center={ startPos }
						zoom={ 13 }
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
			map.touchZoom.enable();
			map.doubleClickZoom.enable();
			map.scrollWheelZoom.enable();
			map.boxZoom.enable();
			map.keyboard.enable();
			map.dragging.enable();
			// Add the Zoom control back in
			map.zoomControl.addTo( map );
		} else {
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
