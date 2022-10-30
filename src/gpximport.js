// Functions to handle importing .gpx files

// TODO: Add error checking - empty file, malformed xml, etc.

import axios from 'axios';
import { Buffer } from 'buffer';

// To simplify the route curve
import { SimplifyTo } from 'curvereduce';

// To downsample the Altitude array
import { LTTB } from 'downsample';

export default async function loadGPXFile( fileID, callback ) {
	wp.media
		.attachment( fileID )
		.fetch()
		.then( async function ( data ) {
			const fileurl = wp.media.attachment( fileID ).get( 'url' );
			const response = await axios.get( fileurl, {
				responseType: 'arraybuffer',
			} );
			const buffer = Buffer.from( response.data, 'utf-8' );
			const gpxParser = require( 'gpxparser' );
			const gpx = new gpxParser();
			gpx.parse( buffer );

			const downloadsizeTo = 500;
			const positions = [];
			const altData = [];
			const speedData = [];
			let distance = 0.0;
			let nn = 1;

			let sport = gpx.tracks[ 0 ].type;

			const totalDistance = gpx.tracks[ 0 ].distance.total;

			const ascent = gpx.tracks[ 0 ].elevation.pos;
			const descent = gpx.tracks[ 0 ].elevation.neg;

			// First entry, zero distance, zero speed.
			speedData.push( [ 0, 0 ] );

			const pointCount = gpx.tracks[ 0 ].points.length;
			while ( nn < pointCount ) {
				if ( 'lat' in gpx.tracks[ 0 ].points[ nn ] ) {
					// Build lat/long route array
					const lat = gpx.tracks[ 0 ].points[ nn ].lat;
					const lon = gpx.tracks[ 0 ].points[ nn ].lon;
					const latLong = { x: lat, y: lon };
					positions.push( latLong );

					// Build distance/speed arrayItem
					distance = gpx.tracks[ 0 ].distance.cumul[ nn ];

					let distanceThisPoint = gpx.tracks[ 0 ].distance.cumul[ nn ] - gpx.tracks[ 0 ].distance.cumul[ nn-1 ]; // in meters
					let time = (gpx.tracks[ 0 ].points[nn].time - gpx.tracks[ 0 ].points[ nn-1 ].time)/1000.0; // in seconds
					let speed = distanceThisPoint / time;  //in meters per milliseconds

					speedData.push( [ distance, (speed * 3.6) ] ); // convert to km/hr from metres/second

					// Build elevation array
					if ( 'ele' in gpx.tracks[ 0 ].points[ nn ] ) {
						altData.push( [ distance, gpx.tracks[ 0 ].points[ nn ].ele ] );
					}

					nn++;
				}
			}

			// Get duration between first and last points (milliseconds)
			const duration =
				( gpx.tracks[ 0 ].points[ gpx.tracks[ 0 ].points.length - 1 ]
					.time -
					gpx.tracks[ 0 ].points[ 0 ].time ) /
				1000.0;

			const time = gpx.tracks[ 0 ].points[ 0 ].time
				.toLocaleString()
				.substring( 0, 17 );

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
			// Downsample the Speed Data to 500 points
			const speedDownsampled = LTTB( speedData, downloadsizeTo );


			const sessionDetails = {
				startTime: time,
				duration: duration,
				distance: totalDistance,
				route: routeData,
				elevation: altDownsampled,
				speed: speedDownsampled,
				sport: titleCase(sport),
				subSport: '',
				ascent: ascent,
				descent: descent
			};

			callback( sessionDetails );
		} );

		const titleCase = (s) =>
			s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())       // Initial char (after -/_)
			.replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase()) // First char after each -/_

}
