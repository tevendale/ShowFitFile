/**
 * ToDo
 * ✓ Date format in header - DD/mm/YYYY hh:mm in local format
 * ✓ Format distance in km or miles
 * ✓ Get 'Units' popup working
 * ✓ Get 'Interactive' button Working
 * ✓ Get 'Show/Hide summary' button working
 * ✓ Get Colour selector linked to Route colour
 * Distance missing is displayed post
 * - First run in editor, distance shows as 0 km instead of '--'
 * Need to get Moving Time from .fit file
 * - Using Garmin value if it's there
 * - Calculate if it's not
 * ✓ Add option to show or hide start and end markers (option for each)
 * ✓ Downsize the route data
 * Update block.json to latest spec
 * Test on WP 6.1
 * Sort out how it looks on a real page
 * look at what happens when inserted into a new post - errors at the moment.
 *
 *
 * V2
 * Add sport
 * Add Altitude Graph
 * Export route gpx
 * Add photos? Geolocate with markers on map
 */

/**
*
* Copyright (c), Stuart Tevendale 2022
*
*
*/

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
} from '@wordpress/block-editor';

import {
	PanelBody,
	FormToggle,
	PanelRow,
	ToggleControl,
	SelectControl,
	ColorPicker,
	Placeholder,
	TextControl,
	Button,
	Notice,
} from '@wordpress/components';

import { store as noticesStore } from '@wordpress/notices';

// For Leaflet Map
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import { Marker, Tooltip, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
// import '../styles/leaflet.css';

// For fitfileparser for .fit import
import axios from 'axios';
import { Buffer } from 'buffer';
import fitfileparser from 'fit-file-parser';

// To simplify the route curve
import { Point, Simplify, SimplifyTo } from 'curvereduce';

import React, { useState, useEffect } from 'react';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import placeholder from '../assets/map-placeholder.png';

// Start & End Markers for Map
import blueMarker from '../styles/images/marker-icon-2x-blue.png';
import greenMarker from '../styles/images/marker-icon-2x-green.png';
import markerShadow from '../styles/images/marker-shadow.png';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	var sessionDistance = 0;

	// 	let fitfile = 'http://showfitfile.local/wp-content/uploads/fit_Files/2022-05-08-11-23-34.fit';
	// 	let fitfileID = 72;

	function selectFitFile( value ) {
		// 			console.log('Value = ' + value);
		// 		console.log( value );
		// 			filename = url.substring(value.url.lastIndexOf('/')+1);
		// 			console.log('Filename = ' + filename);
		// We need to save the file name here
		setAttributes( {
			mediaUrl: value.url,
			fileName: value.filename,
		} );
		loadFitFile( value.id );
	}

	function loadFitFile( fitfileID ) {
		// preload your attachment
		wp.media
			.attachment( fitfileID )
			.fetch()
			.then( async function ( data ) {
				// 				wp.data.dispatch('core/notices').removeNotice(
				// 					notices[ 0 ].id
				// 				);

				// preloading finished
				// after this you can use your attachment normally
				// 				console.log( wp.media.attachment( fitfileID ).get( 'url' ) );
				let fiturl = wp.media.attachment( fitfileID ).get( 'url' );
				const response = await axios.get( fiturl, {
					responseType: 'arraybuffer',
				} );
				const buffer = Buffer.from( response.data, 'utf-8' );

				const FitFileParser = require( 'fit-file-parser' ).default;

				const fitFileParser = new FitFileParser( {
					force: true,
					speedUnit: 'm/s',
					lengthUnit: 'm',
					temperatureUnit: 'celsius',
					elapsedRecordField: false,
					mode: 'both',
				} );

				fitFileParser.parse( buffer, function ( error, data ) {
					if ( error ) {
						// Display an error banner if we can't read the file.
						wp.data
							.dispatch( 'core/notices' )
							.createErrorNotice(
								'Error reading .fit file: ' + error,
								{ id: 'my-error' }
							);
					} else {
						// TODO: Look at a file with multiple sessions - triathlon
						// TODO: Look at a session where the first couple of records don't have GPS data
						// 						console.log( data.sessions[ 0 ] );
						// 						console.log( data.records[ 0 ] );
						// 						console.log( data.records[ 1 ] );
						// 						console.log( data.records[ 2 ] );
						// 						console.log( data.records[ 3 ] );

						setAttributes( {
							duration: toHHMMSS(
								data.sessions[ 0 ].total_timer_time
							),
						} );

						setAttributes( {
							time: data.sessions[ 0 ].start_time
								.toLocaleString()
								.substring( 0, 17 ),
						} );

						setAttributes( {
							distanceMetres: data.sessions[ 0 ].total_distance,
						} );

						// built array of GPS data in correct format for Leafletjs map
						// First, simplify the array using Ramer–Douglas–Peucker algorithm
						// Data needs to be array of {x:, y:} objects
						// CurveReduce npm package
						let positions = [];
						data.records.forEach( function ( arrayItem ) {
							if ( 'position_lat' in arrayItem ) {
								var lat = arrayItem.position_lat;
								var lon = arrayItem.position_long;
								positions.push( { x: lat, y: lon } );
							}
						} );

						// Simplify the route to 500 points
						// This helps reduce the amount of data stored for each post,
						// and speeds up displaying the map.
						// 500 is an arbitrary figure that seems to work ok
						// There might be a case for making this figure a setting somewhere
						let simplified = SimplifyTo( positions, 500 );

						// Now, convert the array to the format required by Leaflet
						const routeData = [];
						simplified.forEach( function ( pointItem ) {
							var lat = pointItem.x;
							var lon = pointItem.y;
							routeData.push( [ lat, lon ] );
						} );

						// Save the route
						setAttributes( { route: routeData } );

						// Set the start point based on the first GPS position
						setAttributes( { startPos: routeData[ 0 ] } );
						setAttributes( {
							endPos: routeData[ routeData.length - 1 ],
						} );
					}
				} );
			} );
	}

	function toHHMMSS( secs ) {
		const sec_num = parseInt( secs, 10 );
		const hours = Math.floor( sec_num / 3600 );
		const minutes = Math.floor( sec_num / 60 ) % 60;
		const seconds = sec_num % 60;

		return [ hours, minutes, seconds ]
			.map( ( v ) => ( v < 10 ? `0${ v }` : v ) )
			.filter( ( v, i ) => v !== '00' || i > 0 )
			.join( ':' );
	}

	const buildDistanceString = ( distanceMetres, units ) => {
		let distString = '--';

		// If distance is 0 (i.e. before a .fit file is loaded), then just show '--'
		if ( distanceMetres > 0 ) {
			if ( units == 'metric' ) {
				// Fix distance to 2 significant digits
				distString =
					( distanceMetres / 1000.0 ).toFixed( 2 ).toString() + ' km';
			} else {
				distString =
					( distanceMetres / 1609.34 ).toFixed( 2 ).toString() + ' M';
			}
		}

		return distString;
	};

	const FitBounds = ( { points } ) => {
		if ( ! points.length ) {
			return null;
		} else {
			const map = useMap();
			var polyline = new L.Polyline( points );
			map.fitBounds( polyline.getBounds() );
			return null;
		}
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

	const SessionTable = ( { time, duration, distance, show, units } ) => {
		// Build the distance String in selected units
		let distString = buildDistanceString( distance, units );

		useEffect( () => {
			setAttributes( { distanceString: distString } );
		} );

		if ( show ) {
			return (
				<table style={ { width: '100%' } } className="dataTable">
					<tbody>
						<tr>
							<td className="dataTable">
								<div className="dataTitle">Time:</div>
								<div className="dataItem"> { time }</div>
							</td>
							<td className="dataTable">
								<div className="dataTitle">Duration:</div>
								<div className="dataItem"> { duration } </div>
							</td>
							<td
								style={ { width: '18%' } }
								className="dataTable"
							>
								<div className="dataTitle">Distance:</div>
								<div className="dataItem"> { distString } </div>
							</td>
						</tr>
					</tbody>
				</table>
			);
		} else {
			return null;
		}
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
				<Marker position={ attributes.startPos } icon={ startMarker }>
				</Marker>
			);
		} else {
			return null;
		}
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
				<Marker position={ attributes.endPos } icon={ endMarker }>
				</Marker>
			);
		} else {
			return null;
		}
	};

	return (
		<div { ...useBlockProps() }>
			<SessionTable
				time={ attributes.time }
				duration={ attributes.duration }
				distance={ attributes.distanceMetres }
				show={ attributes.showSummary }
				units={ attributes.units }
			></SessionTable>

			<MapContainer
				center={ attributes.startPos }
				zoom={ 13 }
				style={ { height: '400px' } }
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ShowStartMarker
					showStartMarker={ attributes.showStartMarker }
					startPos={ attributes.startPos }
				></ShowStartMarker>

				<ShowEndMarker
					showEndMarker={ attributes.showEndMarker }
					endPos={ attributes.endPos }
				></ShowEndMarker>

				<Polyline
					pathOptions={ { color: attributes.lineColour } }
					positions={ attributes.route }
				/>
				<FitBounds points={ attributes.route }></FitBounds>
				<InteractiveOptions
					interactive={ attributes.interactive }
				></InteractiveOptions>
			</MapContainer>
			<MediaUpload
				onSelect={ selectFitFile }
				render={ ( { open } ) => {
					return (
						<Button onClick={ open } variant="primary">
							Click to select .fit file to show{ ' ' }
						</Button>
					);
				} }
			/>
			<InspectorControls>
				<PanelBody title="Map Settings" initialOpen={ true }>
					<PanelRow>
						<ToggleControl
							label="Interactive"
							checked={ attributes.interactive }
							onChange={ ( newval ) =>
								setAttributes( { interactive: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Show session summary"
							checked={ attributes.showSummary }
							onChange={ ( newval ) =>
								setAttributes( { showSummary: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Show Start Marker"
							checked={ attributes.showStartMarker }
							onChange={ ( newval ) =>
								setAttributes( { showStartMarker: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Show End Marker"
							checked={ attributes.showEndMarker }
							onChange={ ( newval ) =>
								setAttributes( { showEndMarker: newval } )
							}
						/>
					</PanelRow>

					<PanelRow>
						<SelectControl
							label="Units"
							value={ attributes.units }
							options={ [
								{ label: 'Imperial', value: 'imperial' },
								{ label: 'Metric', value: 'metric' },
							] }
							onChange={ ( newval ) =>
								setAttributes( { units: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>Route Colour</PanelRow>
					<PanelRow>
						<ColorPicker
							color={ attributes.lineColour }
							onChangeComplete={ ( newval ) =>
								setAttributes( { lineColour: newval.hex } )
							}
							disableAlpha
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
