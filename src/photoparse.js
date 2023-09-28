// Functions to parse photos for gps data

import axios from 'axios';
import { Buffer } from 'buffer';
import ExifReader from 'exifreader';


export default async function parsePhoto( imageID, imageURL, callback, errorCallback ) {
// 			console.log(imageURL);
			const response = await axios.get( imageURL, {
				responseType: 'arraybuffer',
			} );
			const buffer = Buffer.from( response.data, 'utf-8' );
			
			var exifData = ExifReader.load(buffer);
			
			// Check if GPS data exists in the EXIF metadata
			if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
				var latitude = exifData.GPSLatitude.description;
				var longitude = exifData.GPSLongitude.description;
				if (exifData.GPSLatitudeRef.value =='S')
					latitude = latitude * -1;

				if (exifData.GPSLongitudeRef.value =='W')
					longitude = longitude * -1;
				
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
