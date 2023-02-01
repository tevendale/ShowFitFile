// import DataPoint from './dataStore';

const testCall = require("./dataStore");
const DataPoint = require("./dataStore").DataPoint;
const SessionData = require("./dataStore").SessionData;
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