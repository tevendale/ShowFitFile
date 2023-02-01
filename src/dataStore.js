/*
Stores the raw data from the .fit, .tcx or .gpx file

One class to store each data point (lat, long, speed, etc.)

One container class to store an array of point objects.

Container class can also produce an array of each object typeof

Container class can also produce down-sized arrays

*/

// Dummy test function
function testCall() {
	return 'test';
}

// module.exports = test;


// Class to hold data point
class DataPoint {

	constructor(latitude, longitude, altitude, speed, distance) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.altitude = altitude;
		this.speed = speed;
		this.distance = distance;
	}
}

// Class to act as a collection of DataPoints
class SessionData {

	constructor() {
		this.dataPoints = [];
		
		// Constants for the data elements - add for additional elements as required
		this.kElementLatitude = 1;
		this.kElementLongitude = 2;
		this.kElementAltitude = 3;
		this.kElementSpeed = 4;
		this.kElementDistance = 5;

	}
	
	addPoint(latitude, longitude, altitude, speed, distance) {
		var point = new DataPoint(latitude, longitude, altitude, speed, distance);
		this.dataPoints.push(point);
	}
	
	latitudeArray() {
		return this.arrayOfElements(this.kElementLatitude);
	}
	
	longitudeArray() {
		return this.arrayOfElements(this.kElementLongitude);
	}

	altitudeArray() {
		return this.arrayOfElements(this.kElementAltitude);
	}

	speedArray() {
		return this.arrayOfElements(this.kElementSpeed);
	}

	distanceArray() {
		return this.arrayOfElements(this.kElementDistance);
	}

	
	arrayOfElements(elementType) {
		var elementArray = [];
		for (let i = 0; i < this.dataPoints.length; i++) {
			if (elementType == this.kElementLatitude) {
				elementArray.push(this.dataPoints[i].latitude);
			}
			if (elementType == this.kElementLongitude) {
				elementArray.push(this.dataPoints[i].longitude);
			}
			if (elementType == this.kElementAltitude) {
				elementArray.push(this.dataPoints[i].altitude);
			}
			if (elementType == this.kElementSpeed) {
				elementArray.push(this.dataPoints[i].speed);
			}
			if (elementType == this.kElementDistance) {
				elementArray.push(this.dataPoints[i].distance);
			}
		}
		return elementArray;
	}

}

// module.exports = DataPoint, testCall, SessionData;
exports.DataPoint = DataPoint;
exports.SessionData = SessionData;
