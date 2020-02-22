Description

This plugin allows you to add a map and summary data from a .fit (Flexible and Interoperable Data Transfer) file. THe maps are generated using leafletJS with the map tiles provided by OpenStreetMap.

MAPS

Simply create a map from a .fit file with:

[showfitfile file="2019-06-16-10-48-12.fit"]

Upload the .fit file to the Wordpress media library.

To change the units to Imperial:

[showfitfile file="2019-06-16-10-48-12.fit" units = "imperial"]

To change the route colour:

[showfitfile file="2019-06-16-10-48-12.fit" colour = "blue"]

To allow scrolling and zooming of the map

To change the units to Imperial:

[showfitfile file="2019-06-16-10-48-12.fit" interactive = "yes"]





Lookup an address with:

[leaflet-map address="chicago"]
Know the latitude and longitude of a location? Use them (and a zoom level) with:

[leaflet-map lat=44.67 lng=-63.61 zoom=5]
Add a marker under your map shortcode, like so:

[leaflet-map]
[leaflet-marker]
Want more? Make more (and fit the map to contain all of them):

[leaflet-map fitbounds]
[leaflet-marker address="tokyo"]
[leaflet-marker address="oslo"]
[leaflet-marker address="cairo"]
[leaflet-marker address="toronto"]
You can even add popups (to any shape) with their names:

[leaflet-map fitbounds]
[leaflet-marker address="tokyo"]Tokyo[/leaflet-marker]
[leaflet-marker address="oslo"]Oslo[/leaflet-marker]
...
Add a link to the popup messages the same way you would add any other link with the WordPress editor.

OTHER SHAPES, GEOJSON, AND KML

Add a line to the map by adding [leaflet-line]. You can specify the postions with a list separated by semi-colon ; or bar | using lat/lng: [leaflet-line latlngs="41, 29; 44, 18"] or addresses: [leaflet-line addresses="Istanbul; Sarajevo"], or x/y coordinates for image maps.

Add a circle to the map by adding [leaflet-circle]. You can specify the position using lat and lng and the radius in meters using radius. You can also customize the style using Leaflet’s Path options. Example: [leaflet-circle message="max distance" lng=5.117909610271454 lat=52.097914814706094 radius=17500 color="#0DC143" fillOpacity=0.1].

Or you can add a geojson shape via a url (make sure you are allowed to access it if it’s not hosted on your own server): [leaflet-geojson src="https://example.com/path/to.geojson"]. Add custom popups with field names; try out the default src file and fields like so (note fitbounds needs to be on leaflet-geojson (for now)):

[leaflet-map]
[leaflet-geojson fitbounds]{name}[/leaflet-geojson]


name is a property on that GeoJSON, and it can be accessed with curly brackets and the property name.
IMAGE MAPS

Alternatively, you could use a plain image for visitors to zoom and pan around with [leaflet-image src="path/to/image/file.jpg"]. See screenshots 3 – 5 for help setting that up.

MORE

Check out other examples on the Shortcode Helper page in the Leaflet Map admin section.

Check out the source code and more details on GitHub!

Screenshots


Put the shortcode into the post.

See the shortcode play out on the front end.

For [leaflet-image] upload an image, and copy the URL from the right-hand side

For [leaflet-image] paste that image URL into an attribute titled source: example: src="https://picsum.photos/1000/1000/".

See the [leaflet-image] on the front end.

If you use [leaflet-marker draggable], then you can drag the marker where you want it, open a developers console, and see the specific shortcode to use.

Add geojson via URL: [leaflet-geojson src="https://example.com/path/to.geojson"]

MapQuest requires an app key, get it from their website; alternatively, you can use OpenStreetMap as a free tile service (remember to add an attribution where necessary).
Put the shortcode into the post.
See the shortcode play out on the front end.
For [leaflet-image] upload an image, and copy the URL from the right-hand side
For [leaflet-image] paste that image URL into an attribute titled source: example: src="https://picsum.photos/1000/1000/".
See the [leaflet-image] on the front end.
If you use [leaflet-marker draggable], then you can drag the marker where you want it, open a developers console, and see the specific shortcode to use.
Add geojson via URL: [leaflet-geojson src="https://example.com/path/to.geojson"]
MapQuest requires an app key, get it from their website; alternatively, you can use OpenStreetMap as a free tile service (remember to add an attribution where necessary).
FAQ

Can I have an SVG Marker?
How do I change the style for lines/geojson?
My map now says direct tile access has been discontinued (July 11, 2016); can you fix it?
Can I add geojson?
Can I add kml/gpx?
Can I add a message to a marker?
Can I use your plugin with a picture instead of a map?
Can I use my own self-hosted Leaflet files?
How can I add a link to a marker?
Can I add a line to the map?
Can I add my own attributions to custom tile layers?
Contributors & Developers

“Leaflet Map” is open source software. The following people have contributed to this plugin.