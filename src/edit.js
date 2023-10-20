/**
 *
 * Copyright (c), Stuart Tevendale 2022 - 2023
 *
 *
 */

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
	PanelRow,
	ToggleControl,
	SelectControl,
	Button,
} from '@wordpress/components';


import React, { useEffect, useState } from 'react';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

// FontAwesome for Sport icons
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPersonBiking, faPersonRunning, faPersonSwimming, faHeartPulse } from '@fortawesome/free-solid-svg-icons';

// New Colour Picker
import { CompactPicker } from 'react-color';

// Progress Bar
import { CircleSpinner } from 'react-spinner-overlay'

import loadFitFile from './fitimport';
import loadGPXFile from './gpximport';
import loadTCXFile from './tcximport';

import {ShowSpeedGraph, ShowAltitudeGraph} from './graphs';
import {RouteMap} from './map';
import {SessionTable} from './table';

import parsePhoto from './photoparse';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {

	const [ hideProgressbar, setHideProgressbar ] = useState( true );
	const [ hideErrorPanel, setHideErrorPanel ] = useState( true );
	const [ errorMessage, setErrorMessage ] = useState( "Error Happened" );
	const [ loading, setLoading ] = useState( true );
	
	let photoStore = [];

	function selectFitFile( value ) {
		// We need to save the file name here
		setAttributes( {
			mediaUrl: value.url,
			fileName: value.filename,
			fileID: value.id,
		} );
		
		// Clear any error messages
		setHideErrorPanel(true);

		const ext = get_url_extension( value.url );
		setHideProgressbar(false);
		if ( ext === 'fit' ) {
			loadFitFile( value.id, processSessionDataCallback, errorCallback );
		}
		if ( ext === 'gpx' ) {
			loadGPXFile( value.id, processSessionDataCallback );
		}
		if ( ext === 'tcx' ) {
			loadTCXFile( value.id, processSessionDataCallback, errorCallback  );
		}

	}

	function get_url_extension( url ) {
		return url.split( /[#?]/ )[ 0 ].split( '.' ).pop().trim();
	}

	function processSessionDataCallback( details ) {
	
		if (details.duration > 0) {
			setAttributes( {
				duration: toHHMMSS( details.duration ),
			} );
		}
		else {
			setAttributes( {
				duration: "",
			} );
		}
		
		setAttributes( { durationValue: details.duration } );

		setAttributes( {
			time: details.startTime,
		} );

		setAttributes( {
			distanceMetres: details.distance,
		} );

		setAttributes( { route: details.route } );

		// Save the altitude data
		setAttributes( { altitude: details.elevation } );

		// Save the speed data
		setAttributes( { speed: details.speed } );

		// Set the start point based on the first GPS position
		setAttributes( { startPos: details.route[ 0 ] } );
		setAttributes( {
			endPos: details.route[ details.route.length - 1 ],
		} );

		// Save the Sport & Sub-Sport
		setAttributes( { sport: details.sport } );
		setAttributes( { subSport: details.subSport } );

		// Ascent & descent
		setAttributes( { ascent: details.ascent } );
		setAttributes( { descent: details.descent } );
		
		// Moving Time
		setAttributes( { movingTimeValue: details.movingTime } );
		
		// Laps
		setAttributes( { laps: details.laps } );


		setHideProgressbar(true);
	}

	function errorCallback ( error ) {
		setErrorMessage( 'Error reading file: ' + error );
		setHideProgressbar(true);
		setHideErrorPanel(false);
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
	
	function findPhotos() {

		// Also add option to find gps location based on photo timestamp and the gps marker in the fit file for that time.
		const startDate = '2023-01-01T00:00:00';
		const endDate = '2023-12-31T23:59:59';
		const sessionStartDate = '2023-10-01T00:00:00';
		const sessionEndDate = '2023-10-01T23:59:59';

		const apiUrl = `/wp-json/wp/v2/media?after=${startDate}&before=${endDate}&media_type=image`;

		fetch(apiUrl)
		  .then((response) => response.json())
		  .then((mediaData) => {
			// Process the media data here
			  const filteredMedia = mediaData.filter((mediaItem) => {
			  	const timestamp = mediaItem.media_details.image_meta.created_timestamp;
				  const mediaDate = new Date(timestamp * 1000);
				  return mediaDate >= new Date(sessionStartDate) && mediaDate <= new Date(sessionEndDate);
			  });
			  // Parse the collection of photos to see if they're on the route - check if coords are within bounding box of route.
			  filteredMedia.forEach( function ( mediaItem ) {
			  	parsePhoto(mediaItem.id, mediaItem.guid.rendered, photoCallback);
			  });
		  })
		  .catch((error) => {
			console.error('Error fetching media data:', error);
		  });
		  
	}
	
	function photoCallback(photo) {
  		if (photo) {
  			photoStore.push(photo);
  			setAttributes( { testArray: photoStore } );
  			setAttributes( { photosArray: photoStore } );
		}
	}

	const ShowProgressBar = () => {
		return <div className={ `${hideProgressbar ? "sff_hideProgressBar" : "sff_progressBar"}` }>
					<div className="sff_progressBarChild">
						<p className="sff_progressLabel">Loading....</p>
						<div className="sff_progressBarSpinner">
							<CircleSpinner
							  　loading={ loading }
							/>
						</div>
					</div>
			</div>;
	};

	const ShowErrorPanel = () => {
		return <div className={ `${hideErrorPanel ? "sff_hideErrorPanel" : "sff_errorPanel"}` }>
					<div >
						<p className="sff_errorLabel"> { errorMessage } </p>
					</div>
			</div>;
	};

	const GraphPanel = () => {
		return 	<div className="sff_altitudeGraph">
					<ShowAltitudeGraph
						altitudeData={ attributes.altitude }
						units={ attributes.units }
						routeColour={ attributes.lineColour }
						showGraph={ attributes.showAltitudeGraph }
					></ShowAltitudeGraph>
				</div>;
		};


	const MapPanel = () => {
		return 	<div>
					<ShowProgressBar />
					<ShowErrorPanel />

					<SessionTable
						time={ attributes.time }
						duration={ attributes.duration }
						distance={ attributes.distanceMetres }
						show={ attributes.showSummary }
						units={ attributes.units }
						ascent={ attributes.ascent }
						descent={ attributes.descent }
						showMovingTime={ attributes.useMovingTime }
						setAttributes ={ setAttributes }
					></SessionTable>

					<RouteMap
						startPos={attributes.startPos}
						endPos={attributes.endPos}
						showStartMarker={ attributes.showStartMarker }
						showEndMarker={ attributes.showEndMarker }
						lineColour= {attributes.lineColour}
						route={ attributes.route }
						interactive={ attributes.interactive }
						laps={ attributes.laps }
						showLaps={ attributes.showLaps }
						lapColour={ attributes.lapColour }
						photos={ attributes.photosArray }
						showPhotos={ true }
					></RouteMap>
				</div>;
		};

	const MainPanel = () => {
	return  <div>
				<MapPanel />
				<GraphPanel />
			</div>;
	}


	return (
		<div { ...useBlockProps() }>
			<MainPanel />
			<MediaUpload
				onSelect={ selectFitFile }
				render={ ( { open } ) => {
					return (
						<Button onClick={ open } variant="primary">
							Click to select the data file to show{ ' ' }
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
							label="Use Moving Time instead of duration"
							checked={ attributes.useMovingTime }
							onChange={ ( newval ) => {
								setAttributes( { useMovingTime: newval } );
								if (newval) {
									if (attributes.movingTimeValue > 0) {
										setAttributes( {
											duration: toHHMMSS( attributes.movingTimeValue ),
										} );
									}
									else {
										setAttributes( {
											duration: "",
										} );									
									}
								}
								else {
									if (attributes.durationValue > 0) {
										setAttributes( {
											duration: toHHMMSS( attributes.durationValue ),
										} );
									}
									else{
										setAttributes( {
											duration: "",
										} );									
									}
								}
								}
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
						<ToggleControl
							label="Show Altitude Graph"
							checked={ attributes.showAltitudeGraph }
							onChange={ ( newval ) =>
								setAttributes( { showAltitudeGraph: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Show Laps"
							checked={ attributes.showLaps }
							onChange={ ( newval ) =>
								setAttributes( { showLaps: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Show Photos from Media Library"
							checked={ attributes.showPhotos }
							onChange={ ( newval ) =>
								findPhotos()
// 								setAttributes( { showPhotos: newval } )
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
						<CompactPicker
							color={ attributes.lineColour }
							onChangeComplete={ ( newval ) =>
								setAttributes( { lineColour: newval.hex } )
							}
						/>

					</PanelRow>
					<PanelRow>Lap Marker Colour</PanelRow>
					<PanelRow>
						<CompactPicker
							color={ attributes.lapColour }
							onChangeComplete={ ( newval ) =>
								setAttributes( { lapColour: newval.hex } )
							}
						/>

					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
