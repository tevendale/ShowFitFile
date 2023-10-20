import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import { Marker, Polyline, CircleMarker, Popup } from 'react-leaflet';
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
import camera from '../styles/images/photoMarker.png';

// Leaflet.MarketClusterGroup
// import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import "../styles/Leaflet.markercluster/";
import "../styles/Leaflet.Photo/Leaflet.Photo.js";

// import '@nconnector/leaflet.markercluster';
// import {Photo, Cluster} from '@lychee-org/leaflet.photo';

	export const RouteMap = ( {startPos, endPos, showStartMarker, showEndMarker, lineColour, route, interactive, laps, showLaps, lapColour, photos} ) => {
		return 		<MapContainer
						center={ startPos }
						zoom={ 13 }
						maxZoom= { 25 }
						minZoom={5}
						zoomAnimation={false}
						fadeAnimation={false}						
						style={ { height: '400px' } }
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						
						<Polyline
							pathOptions={ { color: lineColour } }
							positions={ route }
						/>
						
						<FitBounds points={ route }></FitBounds>


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
// 		return null;
		if (true) {
			const photoMarkers = [];
// 			photoMarkers.push(
// 				<MarkerClusterGroup>
// 			);
			const template = `
			  <div class="popup">
				<a href="{photo}">
				  <img width="{width}" height="{height}" src="{photo}" />
				  <div class="meta">
					<span class="date">{date}</span><span class="caption">{caption}</span>
				  </div>
				</a>
			  </div>
			`;
			
			if (L.MarkerClusterGroup) {
				console.log("MarkerClusterGroup exists");
			}
			else {
				console.log("MarkerClusterGroup doesn't exist");
			}
				
			const photoLayer = L.photo.cluster().on('click', function(evt) {
			  evt.layer.bindPopup(L.Util.template(template, evt.layer.photo)).openPopup();
			});

			
			const photoMarker = new L.Icon( {
				iconUrl: camera,
				iconSize: [ 41, 41 ],
				iconAnchor: [ 41, 41 ],
			} );
			
			const map = useMap();
			
// 			var markers = L.markerClusterGroup();

			const photoData = [];

			if (photos) {
// 				photoMarkers.push(
// 					<MarkerClusterGroup>
// 				)
// 				for (let i = 0; i < photos.length; i++)  {
// 					const lat = photos[i].lat;
// 					const lon = photos[i].lon;
// 					const photo = photos[i].url;
// 					
// 					photoData.push({
// 						lat: lat,
// 						lng: lon,
// 						width: 250,
// 						height: 250,
// 						photo: photo,
// 						date: "2023-10-01",
// 						caption: "Caption",
// 						thumbnail: photo
// 					});
// 					
// 					
// 					
// // 					var latlng = [photos[i].lat, photos[i].lon];
// // 					
// // 					var marker = L.marker(latlng, {icon: photoMarker});
// // 					marker.addTo(map);
// // 					markers.addLayer(marker);
// 					
// 					
// 					
// // 					photoMarkers.push(
// // 					<Marker
// // 						position={ latlng }
// // 						icon={ photoMarker }
// // 					></Marker>
// // 					)
// 				}
				    photoData.push({
                        lat: 57.433969444444,
                        lng: -2.3971972222222,
                        width: 250,
                        height: 250,
                        photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.39.10.jpeg",
                        date: "2023-10-01",
                        caption: "Caption",
                        thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.39.10.jpeg"
                    });

                    photoData.push({
                        lat: 57.434827777778,
                        lng: -2.39645,
                        width: 250,
                        height: 250,
                        photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.42.09.jpeg",
                        date: "2023-10-01",
                        caption: "Caption",
                        thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.42.09.jpeg"
                    });
// 
//                     photoData.push({
//                         lat: 57.441633333333,
//                         lng: -2.3655305555556,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.52.23.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.52.23.jpeg"
//                     });
// 
//                     photoData.push({
//                         lat: 57.455488888889,
//                         lng: -2.382975,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.23.18.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.23.18.jpeg"
//                     });
// 
//                     photoData.push({
//                         lat: 57.459002777778,
//                         lng: -2.3616444444444,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.57.32.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.57.32.jpeg"
//                     });
// 
//                     photoData.push({
//                         lat: 57.455808333333,
//                         lng: -2.3830777777778,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.28.53.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.28.53.jpeg"
//                     });
// 
//                     photoData.push({
//                         lat: 57.441669444444,
//                         lng: -2.3636694444444,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.52.18.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.52.18.jpeg"
//                     });
// 
//                     photoData.push({
//                         lat: 57.442641666667,
//                         lng: -2.3962361111111,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.33.11.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.33.11.jpeg"
//                     });
// 
//                     photoData.push({
//                         lat: 57.464627777778,
//                         lng: -2.3700888888889,
//                         width: 250,
//                         height: 250,
//                         photo: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.18.02.jpeg",
//                         date: "2023-10-01",
//                         caption: "Caption",
//                         thumbnail: "http://showfitfile.local/wp-content/uploads/2023/10/2023-10-01-11.18.02.jpeg"
//                     });

				console.log(photoData);
				photoLayer.add(photoData).addTo(map);
// 				photoMarkers.push(</MarkerClusterGroup>);
// 				console.log(markers);
// 				console.log(map);
// 				map.addLayer(markers);
// 				return <><MarkerClusterGroup>{ photoMarkers }</MarkerClusterGroup></>;
// 				return <MarkerClusterGroup>{ photoMarkers }</MarkerClusterGroup>;
// 				return <>{ photoMarkers }</>;
// 				return { photoMarkers };
				return null;
			}
		}
		
		return null;
	};
