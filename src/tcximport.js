// Functions to handle importing .tcx files

// For fitfileparser for .fit import
import axios from 'axios';
import { Buffer } from 'buffer';

// To simplify the route curve
import { SimplifyTo } from 'curvereduce';

// To downsample the Altitude array
import { LTTB } from 'downsample';

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
								const speed = point.speed;
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

									if ( speed > -1 ) { //Speed data present
										speedData.push( [dist, (speed * 3.6)] ); // m/s to kph
									}
									else { //Calculate from time & distance
										if ( lastPoint ) {
											const lastPointTime = new Date( lastPoint.time );
											let pointTime = new Date( point.time );
											const distanceMoved = point.distanceMeters - lastPoint.distanceMeters;
											const timeMoved = pointTime - lastPointTime;
											const speedThisPoint = distanceMoved/(timeMoved/1000.0);
											speedData.push( [ dist, ( speedThisPoint * 3.6 ) ] ); // m/s to kph
										}

									}

									positions.push( { x: lat, y: lon } );
									altData.push( [ dist, alt ] );
								}
								lastPoint = point;

							});
						});

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
							startTime: startTimeString,
							duration: duration,
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
