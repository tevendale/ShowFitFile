/*
Stores the raw data from the .fit, .tcx or .gpx file

One class to store each data point (lat, long, speed, etc.)

One container class to store an array of point objects.

Container class can also produce an array of each object typeof

Container class can also produce down-sized arrays

*/

// Dummy test function
// function testCall() {
// 	return 'test';
// }

// module.exports = test;

// class to define data element types
class DataElements {
	// Constants for the data elements - add for additional elements as required
	kElementLatitude = 1;
	kElementLongitude = 2;
	kElementAltitude = 3;
	kElementSpeed = 4;
	kElementDistance = 5;
}


// Class to hold data point
class DataPoint {

	elementTypes = new DataElements();

	constructor(latitude, longitude, altitude, speed, distance) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.altitude = altitude;
		this.speed = speed;
		this.distance = distance;
	}
	
	addLatitude(latitude) {
		this.latitude = latitude;
	}
	
	addLongitude(longitude) {
		this.longitude = longitude;
	}

	addAltitude(altitude) {
		this.altitude = altitude;
	}

	addSpeed(speed) {
		this.speed = speed;
	}
	
	addDistance(distance) {
		this.distance = distance;
	}
	
	valueForElementType(elementType) {
		if (elementType == this.elementTypes.kElementLatitude) {
			return this.latitude;
		}
		if (elementType == this.elementTypes.kElementLongitude) {
			return this.longitude;
		}
		if (elementType == this.elementTypes.kElementAltitude) {
			return this.altitude;
		}
		if (elementType == this.elementTypes.kElementSpeed) {
			return this.speed;
		}
		if (elementType == this.elementTypes.kElementDistance) {
			return this.distance;
		}
	}
}

// Class to act as a collection of DataPoints
class SessionData {

	elementTypes = new DataElements();

	constructor() {
		this.dataPoints = [];
	}
	
	addPoint(latitude, longitude, altitude, speed, distance) {
		const point = new DataPoint(latitude, longitude, altitude, speed, distance);
		this.dataPoints.push(point);
	}
	
	latitudeArray() {
		return this.arrayOfElements(this.elementTypes.kElementLatitude);
	}
	
	longitudeArray() {
		return this.arrayOfElements(this.elementTypes.kElementLongitude);
	}

	altitudeArray() {
		return this.arrayOfElements(this.elementTypes.kElementAltitude);
	}

	speedArray() {
		return this.arrayOfElements(this.elementTypes.kElementSpeed);
	}

	distanceArray() {
		return this.arrayOfElements(this.elementTypes.kElementDistance);
	}
	
	distanceAltitudeArray() {
		// Returns array of elements as [ distance, altitude ]
		return this.arrayOfElementsWithElement(this.elementTypes.kElementDistance, this.elementTypes.kElementAltitude)
	}
	
	distanceSpeedArray() {
		// Returns array of elements as [ distance, speed ]
		return this.arrayOfElementsWithElement(this.elementTypes.kElementDistance, this.elementTypes.kElementSpeed)
	}
	
	latLongArray() {
		// Returns array of elements as [ latitude, longitude ]
		return this.arrayOfElementsWithElement(this.elementTypes.kElementLatitude, this.elementTypes.kElementLongitude)
	}

	
	arrayOfElements(elementType) {
		const elementArray = [];
		for (let i = 0; i < this.dataPoints.length; i++) {
			elementArray.push(this.dataPoints[i].valueForElementType(elementType));
		}
		return elementArray;
	}
	
	arrayOfElementsWithElement(elementType1, elementType2) {
		const elementArray = [];
		for (let i = 0; i < this.dataPoints.length; i++) {
			const element1 = this.dataPoints[i].valueForElementType(elementType1);
			const element2 = this.dataPoints[i].valueForElementType(elementType2);
			const elementPair = [ element1, element2 ];
			elementArray.push(elementPair);
		}
		return elementArray;
	}
	
	simplifyTo(pointCount) {
		const simplifiedPoints = SimplifyTo(this.dataPoints, pointCount);
		this.dataPoints = simplifiedPoints;
	}
}

 /**
  * Method signature for distance calculation.
  */
//  type DistanceFunc = (p: Point, a: Point, b: Point) => number;
 
 /**
  * Distance and index as returned by `MaxDistance()`.
  */
//  type DistanceIndex = { distance: number, index: number };


 /**
  * Calculates the shortest distance between point `p` and the line segment between points `a` and `b`.
  * @param p point
  * @param a line point
  * @param b line point
  * @returns distance
  */
 const ShortestDistance = (p, a, b) => {
 
     // function to calculate the square of the distance between two points
     const pointDistSq = (i, j) => Math.pow(i.latitude - j.latitude, 2) + Math.pow(i.longitude - j.longitude, 2);
 
     let distance;
     const lineLenSq = pointDistSq(a, b);
 
     // line is actually just a point
     if (lineLenSq === 0) distance = pointDistSq(p, a);
 
     // line is a line
     else {
 
         // which endpoint is the point closer to?
         const t = ((p.latitude - a.latitude) * (b.latitude - a.latitude) + (p.longitude - a.longitude) * (b.longitude - a.longitude)) / lineLenSq;
 
         // closer to point A
         if (t < 0) distance = pointDistSq(p, a);
         
         // closer to point B
         else if (t > 1) distance = pointDistSq(p, b);
 
         // somewhere in the middle
         else {
         	mm = new DataPoint(a.latitude + t * (b.latitude - a.latitude), a.longitude + t * (b.longitude - a.longitude));
            distance = pointDistSq(p, mm);
         }
     }
 
     // make sure we return the square root of the distance
     return Math.sqrt(distance);
 }
 
 /**
  * Calculates the perpendicular distance between point `p` and the line intersecting points `a` and `b`.
  * @param p point
  * @param a line point
  * @param b line point
  * @returns distance
  */
 const PerpendicularDistance = (p, a, b) => {
     let distance;
 
     // horizontal line
     if (a.latitude === b.latitude) distance = Math.abs(p.latitude - a.latitude);
 
     // vertical line
     else if (a.longitude === b.longitude) distance = Math.abs(p.longitude - a.longitude);
 
     // sloped line
     else {
         const slope = (b.longitude - a.longitude) / (b.latitude - a.latitude);
         const intercept = a.longitude - (slope * a.latitude);
         distance = Math.abs(slope * p.latitude - p.longitude + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
     }
 
     return distance;
 }
 
  /**
  * The default distance function if none is specified.
  */
 let DefaultDistanceFunc = ShortestDistance;
 
 /**
  * Finds the data point in the curve that is furthest away from the straight line between the first and last points of the curve.
  * @param points points describing the curve
  * @param distanceFunc function used for determining distance
  * @returns distance and index of furthest point
  */
 const MaxDistance = (points, distanceFunc) => {
     
     // save the first and last points
     const first = points[0];
     const last = points[points.length - 1];
 
     // distance and index of furthest point
     let index = -1;
     let distance = 0;
 
     // loop through the points between the first and the last
     for (let i = 1; i < points.length - 1; i++) {
 
         // get the distance using the provided distance function
         let d = distanceFunc(points[i], first, last);
 
         // save the distance and index if this is the longest so far
         if (d > distance) {
             distance = d;
             index = i;
         }
     }
 
     return { distance, index };
 }
 
  /**
  * Generic binary search algorithm, used by `SimplifyTo()`.
  * @param test function used for evaluating the number being tested
  * @param min the low end of the range to test
  * @param max the high end of the range to test
  * @returns the number closest to the target
  */
 const BinarySearch = (test, min = 1, max = Number.MAX_SAFE_INTEGER) => {
 
     // set up our left, right, and middle points
     let l = Math.floor(min), r = Math.floor(max), m = Math.floor(l + (r - l) / 2)
 
     // as long as we have something to test
     while (r - l >= 1) {
 
         // check the middle point
         const t = test(m);
 
         // it's on target, return it
         if (t == 0) return m;
 
         // it's low, use the lower half of our search range
         else if (t < 0) r = m - 1;
 
         // it's high, use the upper half of our search range
         else l = m + 1;
         
         // recalculate the middle point
         m = Math.floor(l + (r - l) / 2);
     }
 
     // we never found what we were looking for, but the middle point is the
     // closest that we have, so return it
     return m;
 };
 
  /**
  * Simplifies a curve with an explicit epsilon value using the Ramer-Douglas-Peucker algorithm.
  * @param points points describing the curve
  * @param epsilon the minimum distance from the curve
  * @param distanceFunc function used for determining distance
  * @returns points making up the simplified curve
  */
 const Simplify = (points, epsilon, distanceFunc = DefaultDistanceFunc) => {
 
     // make sure that our epsilon value is not negative
     if (epsilon < 0) {
         throw new Error('Epsilon must not be negative.');
     }
 
     var result;
 
     // make sure we don't do unnecessary work
     if (epsilon === 0 || points.length < 3) result = points.slice(0);
 
     // recursively break down the curve
     else {
         
         // get the max distance in the curve
         const max = MaxDistance(points, distanceFunc);
 
         // if the max distance is greater than epsilon
         if (max.distance > epsilon) {
 
             // break down curve at the max distance point and recursively simplify each side
             result = [
                 ...Simplify(points.slice(0, max.index + 1), epsilon, distanceFunc).slice(0, -1),
                 ...Simplify(points.slice(max.index), epsilon, distanceFunc)
             ];
         }
         
         // the max distance is insignificant, so just remove all the points in the middle
         else result = [ points[0], points[points.length - 1] ];
     }
 
     return result;
 }
 
  /**
  * Simplifies a curve to approximately the desired number of data points using the Ramer-Douglas-Peucker algorithm.
  * @param points points describing the curve
  * @param pointCount the desired number of points in the simplified curve
  * @param distanceFunc function used for determining distance
  * @returns points making up the simplified curve
  */
  
 //TODO: This needs to accept a SessionData object and return the same 
 // extract the 'points' variable from the SessionData object and use that to work on
 // Create a new SessionData object and inject the returned data points into it - needs a new method in SsssionData class.
 // Scrap the above - add this as a method of SessionData, and just downsize the array that's contained in it.
 const SimplifyTo = (points, pointCount, distanceFunc = DefaultDistanceFunc) => {
 
     let result;
 
     // let's not do unnecessary work
     if (pointCount < 3) result = [ points[0], points[points.length - 1] ];
     else if (pointCount >= points.length) result = points.slice(0);
 
     // search for the best epsilon value
     else {
 
         // a really big number to use as the denominator of our step
         const max = Number.MAX_SAFE_INTEGER;
 
         // use the max distance of the curve as the numerator
         const step = MaxDistance(points, distanceFunc).distance / max;
 
         // binary search to find a good epsilon value
         result = Simplify(points, step * BinarySearch(i => {
 
             // return a comparison between the target number of points and the
             // number of points generated using the specified epsilon value
             return Simplify(points, step * i, distanceFunc).length - pointCount;
         }, 1, max), distanceFunc);
     }
 
     // this probably has the desired number of points, but it's not guaranteed
     return result;
 }

exports.DataPoint = DataPoint;
exports.SessionData = SessionData;
exports.ShortestDistance = ShortestDistance;
exports.PerpendicularDistance = PerpendicularDistance;
exports.MaxDistance = MaxDistance;
exports.BinarySearch = BinarySearch;
exports.Simplify = Simplify;
