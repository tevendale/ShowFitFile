// Functions to handle importing .tcx files

// For fitfileparser for .fit import
import axios from 'axios';
import { Buffer } from 'buffer';
import { DataPoint, SessionData } from './dataStore';

import { TcxFile } from 'tcx-file-class';

export default async function loadTCXFile( fileID, callback, errorCallback ) {
	const downloadsizeTo = 500;
	// preload your attachment
	wp.media
		.attachment( fileID )
		.fetch()
		.then( async function ( data ) {
			// preloading finished
			// after this you can use your attachment normally
			const fileurl = wp.media.attachment( fileID ).get( 'url' );
			const response = await axios.get( fileurl, {
				responseType: 'arraybuffer',
			} );
			const buffer = Buffer.from( response.data, 'utf-8' );

			const tcxfile = new TcxFile();

			tcxfile.readFromString(buffer, (error, result) => {
					if (error) {
						errorCallback( error );
					}
					else {

						const sport = tcxfile.getSport();

						let distance = 0.0;
						let duration = 0;
						let startTime = 0;
						let startTimeString = '';

						const positions = [];
						const altData = [];
						const speedData = [];

						let ascent = 0;
						let descent = 0;
						
						let movingTime = 0;
						
						// Extract the data from the file into a SessionData object
						var sessionData = new SessionData();

						// tcx data is stored as a collection of laps
						const laps = tcxfile.getLaps();
						laps.forEach( function ( lapItem ) {
							if (startTime == 0) {
								startTime = new Date(lapItem.startTime);
								startTimeString = startTime.toLocaleString().substring( 0, 17 );
							}
							distance += lapItem.distanceMeters;
							duration += lapItem.totalTimeSeconds;
							let lastPoint = null;

							lapItem.trackPoints.forEach( function ( point ) {
								const location = point.position;
								var speed = point.speed;
								if (location.latitudeDegrees !== -1) {
									const dist = point.distanceMeters;
									const lat = location.latitudeDegrees;
									const lon = location.longitudeDegrees;
									const alt = location.altitudeMeters;

									// Ascent/Descent calcs
									if ( lastPoint ) {
										let difference = alt - lastPoint.position.altitudeMeters;
										if (difference < 0) {
											descent -= difference;
										}
										else {
											ascent += difference;
										}
									}
									
									if ( lastPoint ) {
										const lastPointTime = new Date( lastPoint.time );
										let pointTime = new Date( point.time );
										const distanceMoved = point.distanceMeters - lastPoint.distanceMeters;
										const timeMoved = pointTime - lastPointTime;
										if (distanceMoved > 0) {
											movingTime += timeMoved;
										}
									}
									

									if ( speed > -1 ) { //Speed data present
										speed = (speed * 3.6); // m/s to kph
									}
									else { //Calculate from time & distance
										if ( lastPoint ) {
											speed = (distanceMoved/(timeMoved/1000.0)) * 3.6;
										}
									}

									positions.push( { x: lat, y: lon } );
									altData.push( [ dist, alt ] );
									
									sessionData.addPoint( lat, lon, alt, speed, dist );
								}
								lastPoint = point;

							});
						});

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

						const sessionDetails = {
							startTime: startTimeString,
							duration: duration,
							movingTime: movingTime/1000,
							distance: distance,
							route: routeData,
							elevation: altDownsampled,
							speed: speedDownsampled,
							sport: titleCase(sport),
							subSport: '',
							ascent: ascent,
							descent: Math.abs(descent)
						};

						callback( sessionDetails );
					}
				});


		});
		const titleCase = (s) =>
			  s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())       // Initial char (after -/_)
			   .replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_

};
