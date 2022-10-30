/**
 * ToDo
 * ✓ Date format in header - DD/mm/YYYY hh:mm in local format
 * ✓ Format distance in km or miles
 * ✓ Get 'Units' popup working
 * ✓ Get 'Interactive' button Working
 * ✓ Get 'Show/Hide summary' button working
 * ✓ Get Colour selector linked to Route colour
 * ✓ Distance missing is displayed post
 * ✓ - First run in editor, distance shows as 0 km instead of '--'
 * Need to get Moving Time from .fit file
 * - Using Garmin value if it's there
 * - Calculate if it's not
 * ✓ Add option to show or hide start and end markers (option for each)
 * ✓ Downsize the route data
 * Update block.json to latest spec
 * ✓ Test on WP 6.1
 * ✓ Sort out how it looks on a real page
 * ✓ look at what happens when inserted into a new post - errors at the moment.
 *
 *
 * V2
 * ✓ Add sport
 * ✓ Add Altitude Graph
 * ✓ - Altitude graph same colour as route
 * ✓ - Altitude Graph filled in editor
 * ✓ - Altitude Graph tracks route on map
 		✓ - Need to add this to the 'Edit' view
 * ✓ Add Speed graph
 * Export route gpx
 * Set Map Size in css
 * Add photos? Geolocate with markers on map
 */

/**
 *
 * Copyright (c), Stuart Tevendale 2022
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonBiking, faPersonRunning, faPersonSwimming, faHeartPulse } from '@fortawesome/free-solid-svg-icons';

// New Colour Picker
import { CompactPicker } from 'react-color';

// Progress Bar
import { CircleSpinner } from 'react-spinner-overlay'

// Tabs
import Tabs,{Tab} from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';

import loadFitFile from './fitimport';
import loadGPXFile from './gpximport';
import loadTCXFile from './tcximport';

import {ShowSpeedGraph, ShowAltitudeGraph} from './graphs';
import {RouteMap} from './map';
import {SessionTable} from './table';

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
	const [ tabIndex, setTabIndex ] = useState(0);

	function selectFitFile( value ) {
		// We need to save the file name here
		setAttributes( {
			mediaUrl: value.url,
			fileName: value.filename,
			fileID: value.id,
		} );

		const ext = get_url_extension( value.url );
		setHideProgressbar(false);
		if ( ext === 'fit' ) {
			loadFitFile( value.id, processSessionDataCallback, errorCallback );
		}
		if ( ext === 'gpx' ) {
			loadGPXFile( value.id, processSessionDataCallback );
		}
		if ( ext === 'tcx' ) {
			loadTCXFile( value.id, processSessionDataCallback );
		}

	}

	function get_url_extension( url ) {
		return url.split( /[#?]/ )[ 0 ].split( '.' ).pop().trim();
	}

	function processSessionDataCallback( details ) {
		setAttributes( {
			duration: toHHMMSS( details.duration ),
		} );

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


		setHideProgressbar(true);
	}

	function errorCallback ( error ) {
		setErrorMessage( 'Error reading .fit file: ' + error );
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

	const ShowProgressBar = () => {
		return <div className={ `${hideProgressbar ? "hideProgressBar" : "progressBar"}` }>
					<div className="progressBarChild">
						<p className="progressLabel">Loading....</p>
						<div className="progressBarSpinner">
							<CircleSpinner
							  　loading={ loading }
							/>
						</div>
					</div>
			</div>;
	};

	const ShowErrorPanel = () => {
		return <div className={ `${hideErrorPanel ? "hideErrorPanel" : "errorPanel"}` }>
					<div >
						<p className="errorLabel"> { errorMessage } </p>
					</div>
			</div>;
	};

	const GraphPanel = () => {
		return 	<div className="">
					<ShowAltitudeGraph
						altitudeData={ attributes.altitude }
						units={ attributes.units }
						routeColour={ attributes.lineColour }
						showGraph={ attributes.showAltitudeGraph }
					></ShowAltitudeGraph>
					<ShowSpeedGraph
						speedData={ attributes.speed }
						units={ attributes.units }
						routeColour={ attributes.lineColour }
						showGraph={ attributes.showSpeedGraph }
					></ShowSpeedGraph>
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
						sport={ attributes.sport }
						subSport={ attributes.subSport }
						showShareRoute={ attributes.showShareRoute }
						ascent={ attributes.ascent }
						descent={ attributes.descent }
						setAttributes = {setAttributes}
					></SessionTable>

					<RouteMap
						startPos={attributes.startPos}
						endPos={attributes.endPos}
						showStartMarker={ attributes.showStartMarker }
						showEndMarker={ attributes.showEndMarker }
						lineColour= {attributes.lineColour}
						route={ attributes.route }
						interactive={ attributes.interactive }
					></RouteMap>
				</div>;
		};

	const MainPanel = () => {
		if (attributes.useTabbedInterface) {
			return	<Tabs activeTab="1" className="" ulClassName="" activityClassName="">
						<Tab title="Map" className="">
							<div className="">
							<MapPanel />
							</div>
						</Tab>
						<Tab title="Graph" className="">
							<div className="">
							<GraphPanel />
							</div>
						</Tab>
					</Tabs>;
		}
		else {
			return  <div>
						<MapPanel />
						<GraphPanel />
					</div>;
		}
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
							label="Show Share Route Option"
							checked={ attributes.showShareRoute }
							onChange={ ( newval ) =>
								setAttributes( { showShareRoute: newval } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Use Tabs"
							checked={ attributes.useTabbedInterface }
							onChange={ ( newval ) =>
								setAttributes( { useTabbedInterface: newval } )
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
				</PanelBody>
				<PanelBody title="Graph Settings" initialOpen={ true }>
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
							label="Show Speed Graph"
							checked={ attributes.showSpeedGraph }
							onChange={ ( newval ) =>
								setAttributes( { showSpeedGraph: newval } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
