// import { loadFitFile } from './fitimport';
// import loadGPXFile from './gpximport';
// import loadTCXFile from './tcximport';


function exportRoute( fitfileID ) {

	loadFitFile( fitfileID, processRouteData, errorCallback );

	function processRouteData( details) {
		const { buildGPX, GarminBuilder } = require('gpx-builder');
		const { Point } = GarminBuilder.MODELS;

		const route = details.unfilteredRoute;
		const gpxPoints =[];

		route.forEach( function ( dataPoint ) {
			const point = new Point( dataPoint.x, dataPoint.y );
			gpxPoints.push( point );
		});

		const gpxData = new GarminBuilder();

		gpxData.setSegmentPoints(points);

		console.log(buildGPX(gpxData.toObject()));
	}

	function errorCallback( error ) {
		console.log( error );
	}
}
