// Functions to handle importing .fit files

// For fitfileparser for .fit import
import axios from 'axios';
import { Buffer } from 'buffer';

import { DataPoint, SessionData } from './dataStore';

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
// 					console.log(data);
					
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


					var distanceLastPoint = 0.0;
					var timeLastPoint = -1;
					var movingTime = 0.0;
					
					// Extract the data from the file into a SessionData object
					var sessionData = new SessionData();
					data.records.forEach( function ( arrayItem ) {
						let lat = null;
						let lon = null;
						let altitude = null;
						let speed = null;
						let distance = null;
						if ( 'position_lat' in arrayItem ) {
							lat = arrayItem.position_lat;
							lon = arrayItem.position_long;
						}
						if ( 'altitude' in arrayItem ) {
							altitude = arrayItem.altitude
						}
						if ( 'speed' in arrayItem ) {
							speed = arrayItem.speed;
						}
						if ( 'distance' in arrayItem ) {
							distance = arrayItem.distance;
							const distanceThisPoint = arrayItem.distance;
							const timeThisPoint = arrayItem.timestamp;
							if ((distanceThisPoint - distanceLastPoint) > 0.0) {
								if (timeLastPoint > 0) {
									movingTime += timeThisPoint - timeLastPoint;
									}
							}
							timeLastPoint = timeThisPoint;
							distanceLastPoint = distanceThisPoint;
						}
						if (lat != null) { // Only add data points that have Lat/Long data
							sessionData.addPoint( lat, lon, altitude, speed, distance );
						}
					} );
					
					// Extract the Laps
					var lapsData = new SessionData();
					data.laps.forEach( function ( arrayItem ) {
						let lat = null;
						let lon = null;
						let altitude = null;
						let speed = null;
						let distance = null;
						let time = null;
						if ( 'end_position_lat' in arrayItem ) {
							lat = arrayItem.end_position_lat;
							lon = arrayItem.end_position_long;
						}
						
						// Extract other data from Records array
						if ( 'records' in arrayItem ) {
							let endRecord = arrayItem.records[arrayItem.records.length - 1];
							if (endRecord) {
								if ( 'speed' in arrayItem ) {
									speed = arrayItem.speed;
								}
								if ( 'distance' in arrayItem ) {
									distance = arrayItem.distance;
								}
								if ( 'altitude' in arrayItem ) {
									altitude = arrayItem.altitude;
								}
							}
						}
						
						if (lat != null) { // Only add data points that have Lat/Long data
							lapsData.addPoint( lat, lon, altitude, speed, distance );
						}
					});
					
					// Check if we have GPS data - file may be from an indoor run or cycle
					if (sessionData.length == 0) {
						errorCallback( "The file doesn't contain any position data." );
						return;
					}
					
					// Simplify the route to 500 points
					// This helps reduce the amount of data stored for each post,
					// and speeds up displaying the map.
					// 500 is an arbitrary figure that seems to work ok
					// There might be a case for making this figure a setting somewhere
					sessionData.simplifyTo(downloadsizeTo );
					
					// Extract the downsampled data arrays
					const routeData = sessionData.latLongArray();
					const altDownsampled = sessionData.distanceAltitudeArray();
					const speedDownsampled = sessionData.distanceSpeedArray();
					const lapData = lapsData.latLongArray();
					
					const sessionDetails = {
						startTime: time,
						duration: duration,
						movingTime: movingTime/1000.0,
						distance: distance,
						route: routeData,
						elevation: altDownsampled,
						speed: speedDownsampled,
						sport: titleCase( sport ),
						subSport: titleCase( subSport ),
						ascent: ascent,
						descent: descent,
						laps: lapData,
					};

					callback( sessionDetails );
				}
			} );
		} );
		
		function movingTime(data) {
			
		}

		const titleCase = (s) =>
			  s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())       // Initial char (after -/_)
			   .replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_
}
