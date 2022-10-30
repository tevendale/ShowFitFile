// Functions to handle importing .fit files

// For fitfileparser for .fit import
import axios from 'axios';
import { Buffer } from 'buffer';
// import fitfileparser from 'fit-file-parser';

// To simplify the route curve
import { SimplifyTo } from 'curvereduce';

// To downsample the Altitude array
import { LTTB } from 'downsample';

export default async function loadFitFile( fitfileID, callback, errorCallback ) {
	// preload your attachment
	wp.media
		.attachment( fitfileID )
		.fetch()
		.then( async function ( data ) {
			// preloading finished
			// after this you can use your attachment normally
			const fiturl = wp.media.attachment( fitfileID ).get( 'url' );
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
					errorCallback( error );
				} else {
					// TODO: Look at a file with multiple sessions - triathlon
					// TODO: Look at a session where the first couple of records don't have GPS dat

					const sport = data.sessions[ 0 ].sport;
					var subSport = data.sessions[ 0 ].sub_sport;
					if (subSport.toUpperCase() === 'GENERIC') {
						subSport = '';
					}

					const downloadsizeTo = 500;

					// Might be better to return a Date object, rather than a strings
					const time = data.sessions[ 0 ].start_time
						.toLocaleString()
						.substring( 0, 17 );
					const distance = data.sessions[ 0 ].total_distance;
					const duration = data.sessions[ 0 ].total_timer_time;

					// Ascent & Descent
					const ascent = data.sessions[ 0 ].total_ascent;
					const descent = data.sessions[ 0 ].total_descent;


					// built array of GPS data in correct format for Leafletjs map
					// First, simplify the array using Ramer–Douglas–Peucker algorithm
					// Data needs to be array of {x:, y:} objects
					// CurveReduce npm package
					// We also extract the altitude data here - we'll probably do the
					// same for the other training data that we're interested it.
					const positions = [];
					const altData = [];
					const speedData = [];
					data.records.forEach( function ( arrayItem ) {
						if ( 'position_lat' in arrayItem ) {
							const lat = arrayItem.position_lat;
							const lon = arrayItem.position_long;
							positions.push( { x: lat, y: lon } );
						}
						if ( 'altitude' in arrayItem ) {
							const distanceThisPoint = arrayItem.distance;
							altData.push( [
								distanceThisPoint,
								arrayItem.altitude,
							] );
						}
						if ( 'speed' in arrayItem ) {
							const distanceThisPoint = arrayItem.distance;
							speedData.push( [
								distanceThisPoint,
								arrayItem.speed,
							] );
						}

					} );

					// Simplify the route to 500 points
					// This helps reduce the amount of data stored for each post,
					// and speeds up displaying the map.
					// 500 is an arbitrary figure that seems to work ok
					// There might be a case for making this figure a setting somewhere
					const simplified = SimplifyTo( positions, downloadsizeTo );

					// Now, convert the array to the format required by Leaflet
					const routeData = [];
					simplified.forEach( function ( pointItem ) {
						const lat = pointItem.x;
						const lon = pointItem.y;
						routeData.push( [ lat, lon ] );
					} );

					// Downsample the Altitude Data to 500 points
					const altDownsampled = LTTB( altData, downloadsizeTo );
					const speedDownsampled = LTTB( speedData, downloadsizeTo );

					const sessionDetails = {
						startTime: time,
						duration: duration,
						distance: distance,
						route: routeData,
						elevation: altDownsampled,
						speed: speedDownsampled,
						sport: titleCase( sport ),
						subSport: titleCase( subSport ),
						ascent: ascent,
						descent: descent,
					};

					callback( sessionDetails );
				}
			} );
		} );

		const titleCase = (s) =>
			  s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())       // Initial char (after -/_)
			   .replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_
}