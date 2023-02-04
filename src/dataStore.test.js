// import DataPoint from './dataStore';

const testCall = require("./dataStore");
const DataPoint = require("./dataStore").DataPoint;
const SessionData = require("./dataStore").SessionData;
const ShortestDistance = require("./dataStore").ShortestDistance;
const PerpendicularDistance = require("./dataStore").PerpendicularDistance;
const MaxDistance = require("./dataStore").MaxDistance;
const BinarySearch = require("./dataStore").BinarySearch;
const Simplify = require("./dataStore").Simplify;
const SimplifyTo = require("./dataStore").SimplifyTo;


// it("Returns test ", () => {
//     expect(testCall()).toBe("test");
// });

it("sets and returns latitude, longitude, altitude, speed & distance", () => {
	store = new DataPoint(57.5, -78.3, 45);
	expect(store.latitude).toBe(57.5);
	expect(store.longitude).toBe(-78.3);
	expect(store.altitude).toBe(45);
});

it("sets and returns speed & distance", () => {
	store = new DataPoint(null, null, null, 37.48, 25.6);
	store.latitude = 57.5;
	expect(store.speed).toBe(37.48);
	expect(store.distance).toBe(25.6);
	expect(store.latitude).toBe(57.5);
// 	expect(store.longitude).toBe(-78.3);
});

it("builds an array of DataPoints", () => {
	var points = [];
	for (let i = 0; i < 5; i++) {
		newPoint = new DataPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
		points.push(newPoint);
	}
	expect(points[3].altitude).toBe(45);
	expect(points[1].speed).toBe(20);
	
});

it("builds a SessionData Object", () => {
	let session = new SessionData();
	for (let i = 0; i < 5; i++) {
		session.addPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
	}
	expect(session.dataPoints[3].altitude).toBe(45);
	expect(session.dataPoints[1].speed).toBe(20);
	
});

it("Test latitudeArray function in SessionData Object", () => {
	let session = new SessionData();
	for (let i = 0; i < 5; i++) {
		session.addPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
	}
	var latArray = session.latitudeArray();
	
	expect(latArray[3]).toBe(57.5);
	expect(latArray.length).toBe(5);
});

it("Test longitudeArray function in SessionData Object", () => {
	let session = new SessionData();
	for (let i = 0; i < 5; i++) {
		session.addPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
	}
	var longArray = session.longitudeArray();
	
	expect(longArray[3]).toBe(-78.3);
	expect(longArray.length).toBe(5);
});

it("Test altitudeArray function in SessionData Object", () => {
	let session = new SessionData();
	for (let i = 0; i < 5; i++) {
		session.addPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
	}
	var altArray = session.altitudeArray();
	
	expect(altArray[3]).toBe(45);
	expect(altArray.length).toBe(5);
});

it("Test speedArray function in SessionData Object", () => {
	let session = new SessionData();
	for (let i = 0; i < 5; i++) {
		session.addPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
	}
	var spdArray = session.speedArray();
	
	expect(spdArray[3]).toBe(60);
	expect(spdArray.length).toBe(5);
});

it("Test distanceArray function in SessionData Object", () => {
	let session = new SessionData();
	for (let i = 0; i < 5; i++) {
		session.addPoint(57.5, -78.3, (i * 15), i * 20, 25.6);
	}
	var distArray = session.distanceArray();
	
	expect(distArray[3]).toBe(25.6);
	expect(distArray.length).toBe(5);
});

// #region ShortestDistance
test('shortest distance, 0-length line', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(1, 0);
    b = new DataPoint(1, 0);
    expect(ShortestDistance(p, a, b)).toEqual(1);
});
test('shortest distance to horizontal line', () => {
    p = new DataPoint(0, 1);
    a = new DataPoint(-1, 0);
    b = new DataPoint(1, 0);
    expect(ShortestDistance(p, a, b)).toEqual(1);
});
test('shortest distance to vertical line', () => {
    p = new DataPoint(1, 0);
    a = new DataPoint(0, -1);
    b = new DataPoint(0, 1);
    expect(ShortestDistance(p, a, b)).toEqual(1);
});
test('shortest distance to 45-degree line', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(2, 0);
    b = new DataPoint(0, 2);
    expect(ShortestDistance(p, a, b)).toBeCloseTo(Math.SQRT2, 10);
});
test('shortest distance to sloped line', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(5, 0);
    b = new DataPoint(0, 4.0 / Math.cos(Math.PI / 2.0 - Math.atan(0.75)));
    expect(ShortestDistance(p, a, b)).toBeCloseTo(4, 10);
});
test('shortest distance to line, closest to point A', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(1, 0);
    b = new DataPoint(2, 0);
    expect(ShortestDistance(p, a, b)).toEqual(1);
});
test('shortest distance to line, closest to point B', () => {
    p = new DataPoint(3, 0);
    a = new DataPoint(1, 0);
    b = new DataPoint(2, 0);
    expect(ShortestDistance(p, a, b)).toEqual(1);
});
//#endregion

//#region PerpendicularDistance
test('perpendicular distance, 0-length line', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(1, 0 );
    b = new DataPoint(1, 0 );
    expect(PerpendicularDistance(p, a, b)).toEqual(1);
});
test('perpendicular distance to horizontal line', () => {
    p = new DataPoint(0, 1);
    a = new DataPoint(-1, 0);
    b = new DataPoint(1, 0);
    expect(PerpendicularDistance(p, a, b)).toEqual(1);
});
test('perpendicular distance to vertical line', () => {
    p = new DataPoint(1, 0);
    a = new DataPoint(0, -1);
    b = new DataPoint(0, 1);
    expect(PerpendicularDistance(p, a, b)).toEqual(1);
});
test('perpendicular distance to 45-degree line', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(2, 0);
    b = new DataPoint(0, 2);
    expect(PerpendicularDistance(p, a, b)).toBeCloseTo(Math.SQRT2, 10);
});
test('perpendicular distance to sloped line', () => {
    p = new DataPoint(0, 0);
    a = new DataPoint(5, 0);
    b = new DataPoint(0, 4.0 / Math.cos(Math.PI / 2.0 - Math.atan(0.75)));
    expect(PerpendicularDistance(p, a, b)).toBeCloseTo(4, 10);
});
//#endregion

//#region MaxDistance
test('max distance, 1 point', () => {
	points = [new DataPoint(0, 0)];
    expect(MaxDistance(points)).toStrictEqual({ distance: 0, index: -1 });
});
test('max distance, 2 points', () => {
	points = [new DataPoint(0,0), new DataPoint(1,1)];
    expect(MaxDistance(points)).toStrictEqual({ distance: 0, index: -1 });
});
test('max distance, 3 points', () => {
	points = [new DataPoint(0,0), new DataPoint(2,2), new DataPoint(4,0)];
    const max = MaxDistance(points, PerpendicularDistance);
    expect(max.distance).toEqual(2);
    expect(max.index).toEqual(1);
});
test('max distance, 4 points', () => {
	points = [new DataPoint(-2, 4), new DataPoint(0, 2), new DataPoint(0, 0), new DataPoint(2, 0)];
    const max = MaxDistance(points, PerpendicularDistance);
    expect(max.distance).toBeCloseTo(Math.SQRT2, 10);
    expect(max.index).toEqual(2);
});
test('max distance with custom function', () => {
	points = [new DataPoint(-2, 4), new DataPoint(0, 2), new DataPoint(0, 0), new DataPoint(2, 0)];
    const max = MaxDistance(points, () => 42);
    expect(max.distance).toEqual(42);
    expect(max.index).toEqual(1);
});
//#endregion

//#region BinarySearch
test('binary search, found', () => {
    const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    expect(BinarySearch(a => 6 - arr[a], 0, arr.length - 1)).toEqual(6);
});
test('binary search, within range', () => {
    const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    expect(BinarySearch(a => 5.5 - arr[a], 0, arr.length - 1)).toEqual(6);
});
test('binary search, bigger than max', () => {
    const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    expect(BinarySearch(a => 10 - arr[a], 0, arr.length - 1)).toEqual(9);
});
test('binary search, less than min', () => {
    const arr = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    expect(BinarySearch(a => -1 - arr[a], 0, arr.length - 1)).toEqual(0);
});
test('binary search, min > max', () => {
    expect(BinarySearch(_ => 1, 1, 0)).toEqual(0);
})
//#endregion

//#region Simplify, generic
test('simplify, epsilon < 0', () => {
    expect(() => Simplify([], -1)).toThrowError();
});
test('simplify, 1 point', () => {
    const points = [ new DataPoint(0, 0) ];
    expect(Simplify(points, 1)).toStrictEqual(points);
});
test('simplify, 2 points', () => {
    const points = [ new DataPoint(0, 0), new DataPoint(1, 1)];
    expect(Simplify(points, 1)).toStrictEqual(points);
});
//#endregion

//#region Simplify, ShortestDistance
test('simplify, 3 points, small epsilon, shortest distance', () => {
    const points = [
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 2 ),
        new DataPoint( 4, 0 )
    ];
    expect(Simplify(points, 1, ShortestDistance)).toStrictEqual(points);
});
test('simplify, 3 points, large epsilon, shortest distance', () => {
    const points = [
        new DataPoint(0, 0 ),
        new DataPoint(2, 2 ),
        new DataPoint(4, 0 )
    ];
    expect(Simplify(points, 2, ShortestDistance)).toStrictEqual([ points[0], points[2] ]);
});
test('simplify, 4 points, small epsilon, shortest distance', () => {
    const points = [
        new DataPoint(-2, 4 ),
        new DataPoint(0, 2 ),
        new DataPoint(0, 0 ),
        new DataPoint(2, 0 )
    ];
    expect(Simplify(points, 0.5, ShortestDistance)).toStrictEqual(points);
});
test('simplify, 4 points, medium epsilon, shortest distance', () => {
    const points = [
        new DataPoint( -2, 4 ),
        new DataPoint( 0, 2 ),
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 0 )
    ];
    expect(Simplify(points, 1, ShortestDistance)).toStrictEqual([ points[0], points[2], points[3] ]);
});
test('simplify, 4 points, large epsilon, shortest distance', () => {
    const points = [
        new DataPoint( -2, 4 ),
        new DataPoint( 0, 2 ),
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 0 )
    ];
    expect(Simplify(points, 2, ShortestDistance)).toStrictEqual([ points[0], points[3] ]);
});
//#endregion

//#region Simplify, PerpendicularDistance
test('simplify, 3 points, small epsilon, perpendicular distance', () => {
    const points = [
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 2 ),
        new DataPoint( 4, 0 )
    ];
    expect(Simplify(points, 1, PerpendicularDistance)).toStrictEqual(points);
});
test('simplify, 3 points, large epsilon, perpendicular distance', () => {
    const points = [
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 2 ),
        new DataPoint( 4, 0 )
    ];
    expect(Simplify(points, 2, PerpendicularDistance)).toStrictEqual([ points[0], points[2] ]);
});
test('simplify, 4 points, small epsilon, perpendicular distance', () => {
    const points = [
        new DataPoint( -2, 4 ),
        new DataPoint( 0, 2 ),
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 0 )
    ];
    expect(Simplify(points, 0.5, PerpendicularDistance)).toStrictEqual(points);
});
test('simplify, 4 points, medium epsilon, perpendicular distance', () => {
    const points = [
        new DataPoint( -2, 4 ),
        new DataPoint( 0, 2 ),
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 0 )
    ];
    expect(Simplify(points, 1, PerpendicularDistance)).toStrictEqual([ points[0], points[2], points[3] ]);
});
test('simplify, 4 points, large epsilon, perpendicular distance', () => {
    const points = [
        new DataPoint( -2, 4 ),
        new DataPoint( 0, 2 ),
        new DataPoint( 0, 0 ),
        new DataPoint( 2, 0 )
    ];
    expect(Simplify(points, 2, PerpendicularDistance)).toStrictEqual([ points[0], points[3] ]);
});
//#endregion

//#region SimplifyTo, ShortestDistance
test('simplify to 1 point, shortest distance', () => {
    const points = [ new DataPoint( 1.20401E-09,  -0.00120428 ),
					 new DataPoint( 0.018,  0.241799 ),
					 new DataPoint( 0.1044,  1.34392 ),
					 new DataPoint( 0.1494,  1.89758 ),
					 new DataPoint( 0.2178,  2.67942 ),
					 new DataPoint( 0.5247,  6.91973 ),
					 new DataPoint( 1.269,  14.8002 ),
					 new DataPoint( 1.6371,  18.0504 ),
					 new DataPoint( 2.2104,  22.3001 ),
					 new DataPoint( 2.5893,  24.7082 ),
					 new DataPoint( 3.1806,  27.6589 ),
					 new DataPoint( 3.9924,  30.4127 ),
					 new DataPoint( 4.4073,  31.39 ),
					 new DataPoint( 5.2713,  32.8131 ),
					 new DataPoint( 5.9382,  33.5356 ),
					 new DataPoint( 6.8382,  34.1971 ),
					 new DataPoint( 7.7517,  34.599 ),
					 new DataPoint( 8.6814,  34.8161 ),
					 new DataPoint( 9.8613,  34.904 ),
					 new DataPoint( 10.4173,  34.8803 ),
					 new DataPoint( 11.1417,  34.8032 ),
					 new DataPoint( 11.865,  34.6729 ),
					 new DataPoint( 12.9515,  34.4192 ),
					 new DataPoint( 14.0371,  34.13 ),
					 new DataPoint( 14.7603,  33.9307 ),
					 new DataPoint( 16.2079,  33.5205 ),
					 new DataPoint( 16.9323,  33.3147 ),
					 new DataPoint( 18.0181,  33.0196 ),
					 new DataPoint( 19.4648,  32.6417 ),
					 new DataPoint( 20.1892,  32.453 ),
					 new DataPoint( 20.9134,  32.2699 ),
					 new DataPoint( 21.6373,  32.0942 ),
					 new DataPoint( 22.36,  31.9221 ),
					 new DataPoint( 23.0845,  31.7573 ),
					 new DataPoint( 24.5326,  31.435 ),
					 new DataPoint( 25.2555,  31.2795 ),
					 new DataPoint( 25.9798,  31.1348 ),
					 new DataPoint( 27.4278,  30.8467 ),
					 new DataPoint( 28.8751,  30.5719 ),
					 new DataPoint( 30.3234,  30.3101 ),
					 new DataPoint( 31.0461,  30.1809 ),
					 new DataPoint( 32.1322,  29.9963 ),
					 new DataPoint( 33.2184,  29.8226 ),
					 new DataPoint( 34.6657,  29.5867 ),
					 new DataPoint( 35.7514,  29.4231 ),
					 new DataPoint( 36.4754,  29.3182 ),
					 new DataPoint( 37.5612,  29.1651 ),
					 new DataPoint( 39.3705,  28.9197 ),
					 new DataPoint( 40.4564,  28.7797 ),
					 new DataPoint( 42.2661,  28.5613 ),
					 new DataPoint( 43.7134,  28.3835 ),
					 new DataPoint( 45.1612,  28.2194 ),
					 new DataPoint( 46.6087,  28.0604 ),
					 new DataPoint( 47.3327,  27.9812 ),
					 new DataPoint( 48.0567,  27.9055 ),
					 new DataPoint( 48.7811,  27.83 ),
					 new DataPoint( 50.5904,  27.6477 ),
					 new DataPoint( 52.0378,  27.5109 ),
					 new DataPoint( 53.1232,  27.4082 ),
					 new DataPoint( 54.9332,  27.251 ),
					 new DataPoint( 56.0185,  27.1584 ),
					 new DataPoint( 57.1038,  27.0701 ),
					 new DataPoint( 58.5527,  26.9543 ),
					 new DataPoint( 59.6379,  26.8715 ),
					 new DataPoint( 60.7239,  26.7892 ),
					 new DataPoint( 62.1717,  26.6807 ),
					 new DataPoint( 63.2575,  26.6065 ),
					 new DataPoint( 64.3433,  26.5366 ),
					 new DataPoint( 65.4286,  26.4584 ),
					 new DataPoint( 66.1529,  26.4133 ),
					 new DataPoint( 66.8761,  26.3701 ),
					 new DataPoint( 67.9623,  26.3016 ),
					 new DataPoint( 69.0481,  26.2356 ),
					 new DataPoint( 69.7714,  26.1927 ),
					 new DataPoint( 70.8578,  26.1324 ),
					 new DataPoint( 71.5807,  26.0938 ),
					 new DataPoint( 73.3904,  25.9954 ),
					 new DataPoint( 74.1143,  25.953 ),
					 new DataPoint( 74.8387,  25.918 ),
					 new DataPoint( 76.286,  25.8486 ),
					 new DataPoint( 77.01,  25.8149 ),
					 new DataPoint( 77.7343,  25.7787 ),
					 new DataPoint( 78.8199,  25.7266 ),
					 new DataPoint( 80.6293,  25.6524 ),
					 new DataPoint( 82.4392,  25.5782 ),
					 new DataPoint( 83.1619,  25.5492 ),
					 new DataPoint( 84.9719,  25.4842 ),
					 new DataPoint( 86.7816,  25.421 ),
					 new DataPoint( 87.5059,  25.3962 ),
					 new DataPoint( 88.5912,  25.3638 ),
					 new DataPoint( 89.3155,  25.3418 ),
					 new DataPoint( 90.0387,  25.3214 ),
					 new DataPoint( 91.1249,  25.2914 ),
					 new DataPoint( 92.2106,  25.2578 ),
					 new DataPoint( 93.2966,  25.2301 ),
					 new DataPoint( 94.7432,  25.189 ),
					 new DataPoint( 95.8293,  25.1627 ),
					 new DataPoint( 96.9156,  25.1362 ),
					 new DataPoint( 97.6382,  25.1209 ),
					 new DataPoint( 98.3628,  25.1058 ),
					 new DataPoint( 99.0872,  25.0926 ),
					 new DataPoint( 100.534,  25.0648 ),
					 new DataPoint( 101.258,  25.0517 ),
					 new DataPoint( 102.344,  25.0337 ),
					 new DataPoint( 103.429,  25.0138 ),
					 new DataPoint( 104.878,  24.9899 ),
					 new DataPoint( 106.688,  24.9631 ),
					 new DataPoint( 107.773,  24.9493 ),
					 new DataPoint( 108.858,  24.9377 ),
					 new DataPoint( 109.583,  24.933 ),
					 new DataPoint( 110.306,  24.9261 ),
					 new DataPoint( 111.392,  24.9175 ),
					 new DataPoint( 112.115,  24.9104 ),
					 new DataPoint( 112.84,  24.9088 ),
					 new DataPoint( 114.287,  24.8994 ),
					 new DataPoint( 115.373,  24.8961 ),
					 new DataPoint( 117.183,  24.8923 ),
					 new DataPoint( 118.269,  24.8906 ),
					 new DataPoint( 119.354,  24.8896 ),
					 new DataPoint( 121.164,  24.8829 ),
					 new DataPoint( 121.887,  24.8809 ),
					 new DataPoint( 122.974,  24.8806 ),
					 new DataPoint( 124.421,  24.8773 ),
					 new DataPoint( 125.145,  24.8776 ),
					 new DataPoint( 125.869,  24.883 ),
					 new DataPoint( 127.316,  24.8808 ),
					 new DataPoint( 128.764,  24.8861 ),
					 new DataPoint( 129.85,  24.8953 ),
					 new DataPoint( 130.936,  24.8972 ),
					 new DataPoint( 131.659,  24.9034 ),
					 new DataPoint( 133.107,  24.9107 ),
					 new DataPoint( 133.831,  24.9139 ),
					 new DataPoint( 134.916,  24.9186 ),
					 new DataPoint( 136.002,  24.9269 ),
					 new DataPoint( 137.45,  24.9386 ),
					 new DataPoint( 138.173,  24.9428 ),
					 new DataPoint( 139.622,  24.9513 ),
					 new DataPoint( 141.068,  24.9584 ),
					 new DataPoint( 142.517,  24.9644 ),
					 new DataPoint( 143.241,  24.9674 ),
					 new DataPoint( 143.963,  24.9708 ),
					 new DataPoint( 145.05,  24.9757 ),
					 new DataPoint( 146.859,  24.9872 ),
					 new DataPoint( 147.584,  24.9901 ),
					 new DataPoint( 148.308,  24.9883 ),
					 new DataPoint( 149.031,  24.9938 ),
					 new DataPoint( 149.754,  24.9976 ),
					 new DataPoint( 150.479,  25.0018 ),
					 new DataPoint( 151.203,  25.0094 ),
					 new DataPoint( 151.927,  25.0118 ),
					 new DataPoint( 152.65,  25.0161 ),
					 new DataPoint( 153.736,  25.0286 ),
					 new DataPoint( 155.183,  25.0368 ),
					 new DataPoint( 156.269,  25.0525 ),
					 new DataPoint( 156.994,  25.0633 ),
					 new DataPoint( 157.718,  25.074 ),
					 new DataPoint( 160.974,  25.1281 ),
					 new DataPoint( 161.698,  25.1416 ),
					 new DataPoint( 163.146,  25.1691 ),
					 new DataPoint( 163.87,  25.1818 ),
					 new DataPoint( 164.594,  25.1939 ),
					 new DataPoint( 165.317,  25.2092 ),
					 new DataPoint( 166.041,  25.2276 ),
					 new DataPoint( 167.489,  25.2626 ),
					 new DataPoint( 168.575,  25.2875 ),
					 new DataPoint( 169.299,  25.3027 ),
					 new DataPoint( 170.022,  25.3221 ),
					 new DataPoint( 170.746,  25.3423 ),
					 new DataPoint( 171.832,  25.3681 ),
					 new DataPoint( 173.28,  25.4073 ),
					 new DataPoint( 174.003,  25.4242 ),
					 new DataPoint( 175.09,  25.4554 ),
					 new DataPoint( 175.812,  25.4752 ),
					 new DataPoint( 177.261,  25.5176 ),
					 new DataPoint( 177.985,  25.5419 ),
					 new DataPoint( 179.432,  25.5877 ),
					 new DataPoint( 180.518,  25.6204 ),
					 new DataPoint( 182.689,  25.69 ),
					 new DataPoint( 183.775,  25.7234 ),
					 new DataPoint( 185.222,  25.7738 ),
					 new DataPoint( 186.671,  25.8215 ),
					 new DataPoint( 188.118,  25.8727 ),
					 new DataPoint( 188.842,  25.8953 ),
					 new DataPoint( 189.927,  25.9282 ),
					 new DataPoint( 190.652,  25.9477 ),
					 new DataPoint( 191.375,  25.965 ),
					 new DataPoint( 192.461,  25.9954 ),
					 new DataPoint( 193.184,  26.0178 ),
					 new DataPoint( 194.633,  26.0538 ),
					 new DataPoint( 195.718,  26.0786 ),
					 new DataPoint( 197.166,  26.1166 ),
					 new DataPoint( 197.889,  26.1354 ),
					 new DataPoint( 198.975,  26.1596 ),
					 new DataPoint( 199.699,  26.1729 ) 
					 ];
    expect(SimplifyTo(points, 1)).toStrictEqual([ points[0], points[points.length - 1] ]);
});
test('simplify to 20 points, shortest distance', () => {
    const points = [ new DataPoint( 1.20401E-09,  -0.00120428 ),
					 new DataPoint( 0.018,  0.241799 ),
					 new DataPoint( 0.1044,  1.34392 ),
					 new DataPoint( 0.1494,  1.89758 ),
					 new DataPoint( 0.2178,  2.67942 ),
					 new DataPoint( 0.5247,  6.91973 ),
					 new DataPoint( 1.269,  14.8002 ),
					 new DataPoint( 1.6371,  18.0504 ),
					 new DataPoint( 2.2104,  22.3001 ),
					 new DataPoint( 2.5893,  24.7082 ),
					 new DataPoint( 3.1806,  27.6589 ),
					 new DataPoint( 3.9924,  30.4127 ),
					 new DataPoint( 4.4073,  31.39 ),
					 new DataPoint( 5.2713,  32.8131 ),
					 new DataPoint( 5.9382,  33.5356 ),
					 new DataPoint( 6.8382,  34.1971 ),
					 new DataPoint( 7.7517,  34.599 ),
					 new DataPoint( 8.6814,  34.8161 ),
					 new DataPoint( 9.8613,  34.904 ),
					 new DataPoint( 10.4173,  34.8803 ),
					 new DataPoint( 11.1417,  34.8032 ),
					 new DataPoint( 11.865,  34.6729 ),
					 new DataPoint( 12.9515,  34.4192 ),
					 new DataPoint( 14.0371,  34.13 ),
					 new DataPoint( 14.7603,  33.9307 ),
					 new DataPoint( 16.2079,  33.5205 ),
					 new DataPoint( 16.9323,  33.3147 ),
					 new DataPoint( 18.0181,  33.0196 ),
					 new DataPoint( 19.4648,  32.6417 ),
					 new DataPoint( 20.1892,  32.453 ),
					 new DataPoint( 20.9134,  32.2699 ),
					 new DataPoint( 21.6373,  32.0942 ),
					 new DataPoint( 22.36,  31.9221 ),
					 new DataPoint( 23.0845,  31.7573 ),
					 new DataPoint( 24.5326,  31.435 ),
					 new DataPoint( 25.2555,  31.2795 ),
					 new DataPoint( 25.9798,  31.1348 ),
					 new DataPoint( 27.4278,  30.8467 ),
					 new DataPoint( 28.8751,  30.5719 ),
					 new DataPoint( 30.3234,  30.3101 ),
					 new DataPoint( 31.0461,  30.1809 ),
					 new DataPoint( 32.1322,  29.9963 ),
					 new DataPoint( 33.2184,  29.8226 ),
					 new DataPoint( 34.6657,  29.5867 ),
					 new DataPoint( 35.7514,  29.4231 ),
					 new DataPoint( 36.4754,  29.3182 ),
					 new DataPoint( 37.5612,  29.1651 ),
					 new DataPoint( 39.3705,  28.9197 ),
					 new DataPoint( 40.4564,  28.7797 ),
					 new DataPoint( 42.2661,  28.5613 ),
					 new DataPoint( 43.7134,  28.3835 ),
					 new DataPoint( 45.1612,  28.2194 ),
					 new DataPoint( 46.6087,  28.0604 ),
					 new DataPoint( 47.3327,  27.9812 ),
					 new DataPoint( 48.0567,  27.9055 ),
					 new DataPoint( 48.7811,  27.83 ),
					 new DataPoint( 50.5904,  27.6477 ),
					 new DataPoint( 52.0378,  27.5109 ),
					 new DataPoint( 53.1232,  27.4082 ),
					 new DataPoint( 54.9332,  27.251 ),
					 new DataPoint( 56.0185,  27.1584 ),
					 new DataPoint( 57.1038,  27.0701 ),
					 new DataPoint( 58.5527,  26.9543 ),
					 new DataPoint( 59.6379,  26.8715 ),
					 new DataPoint( 60.7239,  26.7892 ),
					 new DataPoint( 62.1717,  26.6807 ),
					 new DataPoint( 63.2575,  26.6065 ),
					 new DataPoint( 64.3433,  26.5366 ),
					 new DataPoint( 65.4286,  26.4584 ),
					 new DataPoint( 66.1529,  26.4133 ),
					 new DataPoint( 66.8761,  26.3701 ),
					 new DataPoint( 67.9623,  26.3016 ),
					 new DataPoint( 69.0481,  26.2356 ),
					 new DataPoint( 69.7714,  26.1927 ),
					 new DataPoint( 70.8578,  26.1324 ),
					 new DataPoint( 71.5807,  26.0938 ),
					 new DataPoint( 73.3904,  25.9954 ),
					 new DataPoint( 74.1143,  25.953 ),
					 new DataPoint( 74.8387,  25.918 ),
					 new DataPoint( 76.286,  25.8486 ),
					 new DataPoint( 77.01,  25.8149 ),
					 new DataPoint( 77.7343,  25.7787 ),
					 new DataPoint( 78.8199,  25.7266 ),
					 new DataPoint( 80.6293,  25.6524 ),
					 new DataPoint( 82.4392,  25.5782 ),
					 new DataPoint( 83.1619,  25.5492 ),
					 new DataPoint( 84.9719,  25.4842 ),
					 new DataPoint( 86.7816,  25.421 ),
					 new DataPoint( 87.5059,  25.3962 ),
					 new DataPoint( 88.5912,  25.3638 ),
					 new DataPoint( 89.3155,  25.3418 ),
					 new DataPoint( 90.0387,  25.3214 ),
					 new DataPoint( 91.1249,  25.2914 ),
					 new DataPoint( 92.2106,  25.2578 ),
					 new DataPoint( 93.2966,  25.2301 ),
					 new DataPoint( 94.7432,  25.189 ),
					 new DataPoint( 95.8293,  25.1627 ),
					 new DataPoint( 96.9156,  25.1362 ),
					 new DataPoint( 97.6382,  25.1209 ),
					 new DataPoint( 98.3628,  25.1058 ),
					 new DataPoint( 99.0872,  25.0926 ),
					 new DataPoint( 100.534,  25.0648 ),
					 new DataPoint( 101.258,  25.0517 ),
					 new DataPoint( 102.344,  25.0337 ),
					 new DataPoint( 103.429,  25.0138 ),
					 new DataPoint( 104.878,  24.9899 ),
					 new DataPoint( 106.688,  24.9631 ),
					 new DataPoint( 107.773,  24.9493 ),
					 new DataPoint( 108.858,  24.9377 ),
					 new DataPoint( 109.583,  24.933 ),
					 new DataPoint( 110.306,  24.9261 ),
					 new DataPoint( 111.392,  24.9175 ),
					 new DataPoint( 112.115,  24.9104 ),
					 new DataPoint( 112.84,  24.9088 ),
					 new DataPoint( 114.287,  24.8994 ),
					 new DataPoint( 115.373,  24.8961 ),
					 new DataPoint( 117.183,  24.8923 ),
					 new DataPoint( 118.269,  24.8906 ),
					 new DataPoint( 119.354,  24.8896 ),
					 new DataPoint( 121.164,  24.8829 ),
					 new DataPoint( 121.887,  24.8809 ),
					 new DataPoint( 122.974,  24.8806 ),
					 new DataPoint( 124.421,  24.8773 ),
					 new DataPoint( 125.145,  24.8776 ),
					 new DataPoint( 125.869,  24.883 ),
					 new DataPoint( 127.316,  24.8808 ),
					 new DataPoint( 128.764,  24.8861 ),
					 new DataPoint( 129.85,  24.8953 ),
					 new DataPoint( 130.936,  24.8972 ),
					 new DataPoint( 131.659,  24.9034 ),
					 new DataPoint( 133.107,  24.9107 ),
					 new DataPoint( 133.831,  24.9139 ),
					 new DataPoint( 134.916,  24.9186 ),
					 new DataPoint( 136.002,  24.9269 ),
					 new DataPoint( 137.45,  24.9386 ),
					 new DataPoint( 138.173,  24.9428 ),
					 new DataPoint( 139.622,  24.9513 ),
					 new DataPoint( 141.068,  24.9584 ),
					 new DataPoint( 142.517,  24.9644 ),
					 new DataPoint( 143.241,  24.9674 ),
					 new DataPoint( 143.963,  24.9708 ),
					 new DataPoint( 145.05,  24.9757 ),
					 new DataPoint( 146.859,  24.9872 ),
					 new DataPoint( 147.584,  24.9901 ),
					 new DataPoint( 148.308,  24.9883 ),
					 new DataPoint( 149.031,  24.9938 ),
					 new DataPoint( 149.754,  24.9976 ),
					 new DataPoint( 150.479,  25.0018 ),
					 new DataPoint( 151.203,  25.0094 ),
					 new DataPoint( 151.927,  25.0118 ),
					 new DataPoint( 152.65,  25.0161 ),
					 new DataPoint( 153.736,  25.0286 ),
					 new DataPoint( 155.183,  25.0368 ),
					 new DataPoint( 156.269,  25.0525 ),
					 new DataPoint( 156.994,  25.0633 ),
					 new DataPoint( 157.718,  25.074 ),
					 new DataPoint( 160.974,  25.1281 ),
					 new DataPoint( 161.698,  25.1416 ),
					 new DataPoint( 163.146,  25.1691 ),
					 new DataPoint( 163.87,  25.1818 ),
					 new DataPoint( 164.594,  25.1939 ),
					 new DataPoint( 165.317,  25.2092 ),
					 new DataPoint( 166.041,  25.2276 ),
					 new DataPoint( 167.489,  25.2626 ),
					 new DataPoint( 168.575,  25.2875 ),
					 new DataPoint( 169.299,  25.3027 ),
					 new DataPoint( 170.022,  25.3221 ),
					 new DataPoint( 170.746,  25.3423 ),
					 new DataPoint( 171.832,  25.3681 ),
					 new DataPoint( 173.28,  25.4073 ),
					 new DataPoint( 174.003,  25.4242 ),
					 new DataPoint( 175.09,  25.4554 ),
					 new DataPoint( 175.812,  25.4752 ),
					 new DataPoint( 177.261,  25.5176 ),
					 new DataPoint( 177.985,  25.5419 ),
					 new DataPoint( 179.432,  25.5877 ),
					 new DataPoint( 180.518,  25.6204 ),
					 new DataPoint( 182.689,  25.69 ),
					 new DataPoint( 183.775,  25.7234 ),
					 new DataPoint( 185.222,  25.7738 ),
					 new DataPoint( 186.671,  25.8215 ),
					 new DataPoint( 188.118,  25.8727 ),
					 new DataPoint( 188.842,  25.8953 ),
					 new DataPoint( 189.927,  25.9282 ),
					 new DataPoint( 190.652,  25.9477 ),
					 new DataPoint( 191.375,  25.965 ),
					 new DataPoint( 192.461,  25.9954 ),
					 new DataPoint( 193.184,  26.0178 ),
					 new DataPoint( 194.633,  26.0538 ),
					 new DataPoint( 195.718,  26.0786 ),
					 new DataPoint( 197.166,  26.1166 ),
					 new DataPoint( 197.889,  26.1354 ),
					 new DataPoint( 198.975,  26.1596 ),
					 new DataPoint( 199.699,  26.1729 ) 
					 ];
    expect(SimplifyTo(points, 20).length).toEqual(20);
});
test('simplify to 1000 point, shortest distance', () => {
    const points = [ new DataPoint( 1.20401E-09,  -0.00120428 ),
					 new DataPoint( 0.018,  0.241799 ),
					 new DataPoint( 0.1044,  1.34392 ),
					 new DataPoint( 0.1494,  1.89758 ),
					 new DataPoint( 0.2178,  2.67942 ),
					 new DataPoint( 0.5247,  6.91973 ),
					 new DataPoint( 1.269,  14.8002 ),
					 new DataPoint( 1.6371,  18.0504 ),
					 new DataPoint( 2.2104,  22.3001 ),
					 new DataPoint( 2.5893,  24.7082 ),
					 new DataPoint( 3.1806,  27.6589 ),
					 new DataPoint( 3.9924,  30.4127 ),
					 new DataPoint( 4.4073,  31.39 ),
					 new DataPoint( 5.2713,  32.8131 ),
					 new DataPoint( 5.9382,  33.5356 ),
					 new DataPoint( 6.8382,  34.1971 ),
					 new DataPoint( 7.7517,  34.599 ),
					 new DataPoint( 8.6814,  34.8161 ),
					 new DataPoint( 9.8613,  34.904 ),
					 new DataPoint( 10.4173,  34.8803 ),
					 new DataPoint( 11.1417,  34.8032 ),
					 new DataPoint( 11.865,  34.6729 ),
					 new DataPoint( 12.9515,  34.4192 ),
					 new DataPoint( 14.0371,  34.13 ),
					 new DataPoint( 14.7603,  33.9307 ),
					 new DataPoint( 16.2079,  33.5205 ),
					 new DataPoint( 16.9323,  33.3147 ),
					 new DataPoint( 18.0181,  33.0196 ),
					 new DataPoint( 19.4648,  32.6417 ),
					 new DataPoint( 20.1892,  32.453 ),
					 new DataPoint( 20.9134,  32.2699 ),
					 new DataPoint( 21.6373,  32.0942 ),
					 new DataPoint( 22.36,  31.9221 ),
					 new DataPoint( 23.0845,  31.7573 ),
					 new DataPoint( 24.5326,  31.435 ),
					 new DataPoint( 25.2555,  31.2795 ),
					 new DataPoint( 25.9798,  31.1348 ),
					 new DataPoint( 27.4278,  30.8467 ),
					 new DataPoint( 28.8751,  30.5719 ),
					 new DataPoint( 30.3234,  30.3101 ),
					 new DataPoint( 31.0461,  30.1809 ),
					 new DataPoint( 32.1322,  29.9963 ),
					 new DataPoint( 33.2184,  29.8226 ),
					 new DataPoint( 34.6657,  29.5867 ),
					 new DataPoint( 35.7514,  29.4231 ),
					 new DataPoint( 36.4754,  29.3182 ),
					 new DataPoint( 37.5612,  29.1651 ),
					 new DataPoint( 39.3705,  28.9197 ),
					 new DataPoint( 40.4564,  28.7797 ),
					 new DataPoint( 42.2661,  28.5613 ),
					 new DataPoint( 43.7134,  28.3835 ),
					 new DataPoint( 45.1612,  28.2194 ),
					 new DataPoint( 46.6087,  28.0604 ),
					 new DataPoint( 47.3327,  27.9812 ),
					 new DataPoint( 48.0567,  27.9055 ),
					 new DataPoint( 48.7811,  27.83 ),
					 new DataPoint( 50.5904,  27.6477 ),
					 new DataPoint( 52.0378,  27.5109 ),
					 new DataPoint( 53.1232,  27.4082 ),
					 new DataPoint( 54.9332,  27.251 ),
					 new DataPoint( 56.0185,  27.1584 ),
					 new DataPoint( 57.1038,  27.0701 ),
					 new DataPoint( 58.5527,  26.9543 ),
					 new DataPoint( 59.6379,  26.8715 ),
					 new DataPoint( 60.7239,  26.7892 ),
					 new DataPoint( 62.1717,  26.6807 ),
					 new DataPoint( 63.2575,  26.6065 ),
					 new DataPoint( 64.3433,  26.5366 ),
					 new DataPoint( 65.4286,  26.4584 ),
					 new DataPoint( 66.1529,  26.4133 ),
					 new DataPoint( 66.8761,  26.3701 ),
					 new DataPoint( 67.9623,  26.3016 ),
					 new DataPoint( 69.0481,  26.2356 ),
					 new DataPoint( 69.7714,  26.1927 ),
					 new DataPoint( 70.8578,  26.1324 ),
					 new DataPoint( 71.5807,  26.0938 ),
					 new DataPoint( 73.3904,  25.9954 ),
					 new DataPoint( 74.1143,  25.953 ),
					 new DataPoint( 74.8387,  25.918 ),
					 new DataPoint( 76.286,  25.8486 ),
					 new DataPoint( 77.01,  25.8149 ),
					 new DataPoint( 77.7343,  25.7787 ),
					 new DataPoint( 78.8199,  25.7266 ),
					 new DataPoint( 80.6293,  25.6524 ),
					 new DataPoint( 82.4392,  25.5782 ),
					 new DataPoint( 83.1619,  25.5492 ),
					 new DataPoint( 84.9719,  25.4842 ),
					 new DataPoint( 86.7816,  25.421 ),
					 new DataPoint( 87.5059,  25.3962 ),
					 new DataPoint( 88.5912,  25.3638 ),
					 new DataPoint( 89.3155,  25.3418 ),
					 new DataPoint( 90.0387,  25.3214 ),
					 new DataPoint( 91.1249,  25.2914 ),
					 new DataPoint( 92.2106,  25.2578 ),
					 new DataPoint( 93.2966,  25.2301 ),
					 new DataPoint( 94.7432,  25.189 ),
					 new DataPoint( 95.8293,  25.1627 ),
					 new DataPoint( 96.9156,  25.1362 ),
					 new DataPoint( 97.6382,  25.1209 ),
					 new DataPoint( 98.3628,  25.1058 ),
					 new DataPoint( 99.0872,  25.0926 ),
					 new DataPoint( 100.534,  25.0648 ),
					 new DataPoint( 101.258,  25.0517 ),
					 new DataPoint( 102.344,  25.0337 ),
					 new DataPoint( 103.429,  25.0138 ),
					 new DataPoint( 104.878,  24.9899 ),
					 new DataPoint( 106.688,  24.9631 ),
					 new DataPoint( 107.773,  24.9493 ),
					 new DataPoint( 108.858,  24.9377 ),
					 new DataPoint( 109.583,  24.933 ),
					 new DataPoint( 110.306,  24.9261 ),
					 new DataPoint( 111.392,  24.9175 ),
					 new DataPoint( 112.115,  24.9104 ),
					 new DataPoint( 112.84,  24.9088 ),
					 new DataPoint( 114.287,  24.8994 ),
					 new DataPoint( 115.373,  24.8961 ),
					 new DataPoint( 117.183,  24.8923 ),
					 new DataPoint( 118.269,  24.8906 ),
					 new DataPoint( 119.354,  24.8896 ),
					 new DataPoint( 121.164,  24.8829 ),
					 new DataPoint( 121.887,  24.8809 ),
					 new DataPoint( 122.974,  24.8806 ),
					 new DataPoint( 124.421,  24.8773 ),
					 new DataPoint( 125.145,  24.8776 ),
					 new DataPoint( 125.869,  24.883 ),
					 new DataPoint( 127.316,  24.8808 ),
					 new DataPoint( 128.764,  24.8861 ),
					 new DataPoint( 129.85,  24.8953 ),
					 new DataPoint( 130.936,  24.8972 ),
					 new DataPoint( 131.659,  24.9034 ),
					 new DataPoint( 133.107,  24.9107 ),
					 new DataPoint( 133.831,  24.9139 ),
					 new DataPoint( 134.916,  24.9186 ),
					 new DataPoint( 136.002,  24.9269 ),
					 new DataPoint( 137.45,  24.9386 ),
					 new DataPoint( 138.173,  24.9428 ),
					 new DataPoint( 139.622,  24.9513 ),
					 new DataPoint( 141.068,  24.9584 ),
					 new DataPoint( 142.517,  24.9644 ),
					 new DataPoint( 143.241,  24.9674 ),
					 new DataPoint( 143.963,  24.9708 ),
					 new DataPoint( 145.05,  24.9757 ),
					 new DataPoint( 146.859,  24.9872 ),
					 new DataPoint( 147.584,  24.9901 ),
					 new DataPoint( 148.308,  24.9883 ),
					 new DataPoint( 149.031,  24.9938 ),
					 new DataPoint( 149.754,  24.9976 ),
					 new DataPoint( 150.479,  25.0018 ),
					 new DataPoint( 151.203,  25.0094 ),
					 new DataPoint( 151.927,  25.0118 ),
					 new DataPoint( 152.65,  25.0161 ),
					 new DataPoint( 153.736,  25.0286 ),
					 new DataPoint( 155.183,  25.0368 ),
					 new DataPoint( 156.269,  25.0525 ),
					 new DataPoint( 156.994,  25.0633 ),
					 new DataPoint( 157.718,  25.074 ),
					 new DataPoint( 160.974,  25.1281 ),
					 new DataPoint( 161.698,  25.1416 ),
					 new DataPoint( 163.146,  25.1691 ),
					 new DataPoint( 163.87,  25.1818 ),
					 new DataPoint( 164.594,  25.1939 ),
					 new DataPoint( 165.317,  25.2092 ),
					 new DataPoint( 166.041,  25.2276 ),
					 new DataPoint( 167.489,  25.2626 ),
					 new DataPoint( 168.575,  25.2875 ),
					 new DataPoint( 169.299,  25.3027 ),
					 new DataPoint( 170.022,  25.3221 ),
					 new DataPoint( 170.746,  25.3423 ),
					 new DataPoint( 171.832,  25.3681 ),
					 new DataPoint( 173.28,  25.4073 ),
					 new DataPoint( 174.003,  25.4242 ),
					 new DataPoint( 175.09,  25.4554 ),
					 new DataPoint( 175.812,  25.4752 ),
					 new DataPoint( 177.261,  25.5176 ),
					 new DataPoint( 177.985,  25.5419 ),
					 new DataPoint( 179.432,  25.5877 ),
					 new DataPoint( 180.518,  25.6204 ),
					 new DataPoint( 182.689,  25.69 ),
					 new DataPoint( 183.775,  25.7234 ),
					 new DataPoint( 185.222,  25.7738 ),
					 new DataPoint( 186.671,  25.8215 ),
					 new DataPoint( 188.118,  25.8727 ),
					 new DataPoint( 188.842,  25.8953 ),
					 new DataPoint( 189.927,  25.9282 ),
					 new DataPoint( 190.652,  25.9477 ),
					 new DataPoint( 191.375,  25.965 ),
					 new DataPoint( 192.461,  25.9954 ),
					 new DataPoint( 193.184,  26.0178 ),
					 new DataPoint( 194.633,  26.0538 ),
					 new DataPoint( 195.718,  26.0786 ),
					 new DataPoint( 197.166,  26.1166 ),
					 new DataPoint( 197.889,  26.1354 ),
					 new DataPoint( 198.975,  26.1596 ),
					 new DataPoint( 199.699,  26.1729 ) 
					 ];
    expect(SimplifyTo(points, 1000)).toStrictEqual(points);
});
//#endregion



