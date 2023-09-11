// Functions to parse photos for gps data

import axios from 'axios';
import { Buffer } from 'buffer';
import ExifReader from 'exifreader';


export default async function parsePhoto( imageID, imageURL, callback, errorCallback ) {
			console.log(imageURL);
			const response = await axios.get( imageURL, {
				responseType: 'arraybuffer',
			} );
			const buffer = Buffer.from( response.data, 'utf-8' );
			
			console.log(buffer);
			
			var exifData = ExifReader.load(buffer);
			
			console.log(exifData);
			
			// Check if GPS data exists in the EXIF metadata
			if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
				var latitude = exifData.GPSLatitude.description;
				var longitude = exifData.GPSLongitude.description;

				// Output the GPS coordinates
				console.log("Latitude: " + latitude);
				console.log("Longitude: " + longitude);
				
				const photo = {
					url: imageURL,
					lat: latitude,
					lon: longitude
				}
				
				callback( photo );
				
			} else {
				console.log("GPS coordinates not found in EXIF data.");
			}
			
}
