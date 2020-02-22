<?php
/**
 * @package Show_Fit_File
 * @version 0.1
 */
/*
Plugin Name: Show Fit File
Plugin URI: http://wordpress.org/plugins/Show-FIT-File/
Description: A plugin for displaying data from a .fit file (Flexible and Interoperable Data Transfer).
Author: Yellow Field Technologies Ltd
Version: 0.1
Author URI: http://Yellowfield.co.uk
*/


/* TODO
✓ Create one function that reads the .fit file
✓ Have a global oject that stores the imported .fit data and use this in the other functions (map, summary data, etc)
Check if the imported object is null, and import is necessary
✓ Read the file from the folder whewre images are uploaded to? (Uploads) --> find out how to get path to this, also, files seem to be arranged in yyyy/mm folder structure
	- Seems to work with yyyy/mm folders, seems to use the date the post was created.
	- Do some more testing, i.e. add to older post and see what path is produced
	- Add option to upload to custom folder ????

✓ Sort out styling of Table
	- Move styles into a srtylesheet file and load - easier for users to customise
	- Change style names to use 'yft' suffix to asvoid clashes

✓ Add options to Shortcut
	✓- Line colour - RED
	- Show Power - NO
	✓- Can Scroll - NO
	✓- Can Zoom - NO
		✓- Maybe make the above two just 'Is Interactive'?
	- Obfusicate End Points - NO
	✓- Metric/Imperial - Metric
	✓- Show start/end points
	- Set line width
	
	
✓ Method to get start & end points

Check that the date is in local time, not UTC
	

Add Sport Icon?
	- Add option to shortcut to specify icon file?
	- Include icon for swim, bike & run
	
✓ Downsize data array for route - speed up drawing


Set up Github repository
	- Have private one for devlopment, and a public one with a release snap-shot
✓ Set up Webpage
Readme file
Text for Wordpress Page
Investigate how to promote WP Plugins
	- YFT Blog post mostly done.

Phase 2
Add Altitude Graph under map with option to show or hide
Show multisport sessions with all legs
Show laps

'Pro' Version - Paid for
Show graphs of .fit data - HR, power, speed, etc.
*/

require __DIR__ . '/src/phpFITFileAnalysis.php';
require __DIR__ . '/libraries/Line_DouglasPeucker.php';

// Class to hold the various options for the map
class mapOptions {
	public $routeLineColour;
	public $isInteractive;
	public $units;
	public $uniqueID;
	
	function __construct() {
		$routeLineColour = 'red';
		$isInteractive = 'NO';
		$units = 'metric';
	}
}

// Global variable for filename
global $filename;
global $pFFA;
global $options;
global $startPoint;
global $endPoint;
global $startLatLong;

function sff_readFitFile($file) {
	try {
		global $options;
		
		// Files are uploaded to this folder
		$customdir = '/fit_Files';
		$path = wp_upload_dir();
		$path['path']    = str_replace($path['subdir'], '', $path['path']); //remove default subdir (year/month)
		$path['url']     = str_replace($path['subdir'], '', $path['url']);      
		$path['subdir']  = $customdir;
		$path['path']   .= $customdir; 
		$path['url']    .= $customdir;
		
		$url = $path['path'];
		

		$file = $url . '/' . $file;
		$filename = $file;
		
		$fitOptions = [
// 		'garmin_timestamps' => true
		// Just using the defaults so no need to provide
		//		'fix_data'	=> [],
		//		'units'		=> 'metric', Options: statute, raw, metric
		//		'pace'		=> false
		];
		if ($options->units == "imperial") {
			$fitOptions = ['units' => 'statute'];
		}
		
		
		global $pFFA;
		$pFFA = new adriangibbons\phpFITFileAnalysis($file, $fitOptions);
	} catch (Exception $e) {
		echo 'caught exception: '.$e->getMessage();
		die();
	}
}

function sff_fitHTML() {
	global $pFFA;
	global $options;
	global $startLatLong;
	
	$mapcode = getMapCode();
	
	$tz = sff_timeZoneForCoords($startLatLong[0], $startLatLong[1]);
	
	
	
// 	$date = new DateTime('now', new DateTimeZone('UTC'));
	$date = new DateTime('now', new DateTimeZone($tz));
    $date_s = $pFFA->data_mesgs['session']['start_time'];
//     $date_s = $pFFA->data_mesgs['activity']['local_timestamp'];
    $date->setTimestamp($date_s);
    
//     $date = new DateTime('1989-12-31', new DateTimeZone('UTC'));
// 	$date_s = $date->getTimestamp() + $pFFA->data_mesgs['session']['start_time'];
    
    $unitsString = "km";
    if ($options->units == "imperial") {
    	$unitsString = "miles";
    }
	
	$html = "<table class=\"dataTable\"><tr><td class=\"dataTable\"><div class=\"dataTitle\">Time:</div><div class=\"dataItem\">" . $date->format('d-M-y g:i a') . "</div></td>\n<td class=\"dataTable\"><div class=\"dataTitle\">Duration:</div><div class=\"dataItem\">" . gmdate('H:i:s', $pFFA->data_mesgs['session']['total_timer_time']) . "</div>\n</td><td class=\"dataTable\"><div class=\"dataTitle\">Distance:</div><div class=\"dataItem\">" . max($pFFA->data_mesgs['record']['distance']) . " " . $unitsString . "</div></td></tr><tr><td colspan=\"3\" class=\"dataTable\">" . $mapcode ."</td></tr></table>";
	
	return $html;
}

function sff_routePolyline() {

	global $pFFA;
	global $startPoint;
	global $endPoint;
	global $startLatLong;

    // Google Static Maps API
    $position_lat = $pFFA->data_mesgs['record']['position_lat'];
    $position_long = $pFFA->data_mesgs['record']['position_long'];
    $lat_long_combined = [];
    
	foreach ($position_lat as $key => $value) {  // Assumes every lat has a corresponding long
		$lat_long_combined[] = [$position_lat[$key],$position_long[$key]];
	}

//     echo (count($lat_long_combined));
//     echo "\r\n<br>";
    
    
	// Reduce the number of Lat/Lonf coords to below 1000 - for a static map, we probably could go lower.
	// For a zoom'able map, we might think about using all the data.
	$delta = 0.00001;
	do {
		$RDP_LatLng_coord = simplify_RDP($lat_long_combined, $delta);  // Simplify the array of coordinates using the Ramer-Douglas-Peucker algorithm.
		$delta += 0.00001;  // Rough accuracy somewhere between 4m and 12m depending where in the World coordinates are, source http://en.wikipedia.org/wiki/Decimal_degrees
		
// 		echo (count($RDP_LatLng_coord));
// 		echo "\r\n<br>";
		
	} while (count($RDP_LatLng_coord) > 1000); 
	
	$startLatLong = $lat_long_combined[0];
	$LatLng_start = implode(',', $lat_long_combined[0]);
    $LatLng_finish = implode(',', $lat_long_combined[count($lat_long_combined)-1]);
    
    $startPoint = "[" . $LatLng_start . "]";
    $endPoint = "[" . $LatLng_finish . "]";
    
    sff_timeZoneForCoords($lat_long_combined[0][0], $lat_long_combined[0][1]);

	
// 	print_r($RDP_LatLng_coord);

	$polyline = "";
// 	echo (count($RDP_LatLng_coord));

    foreach($RDP_LatLng_coord as $latLongPair) {
//     	print_r($latLongPair);
    	$polyline .= "[" . $latLongPair[0] . "," . $latLongPair[1] . "],";
    }
    
    $polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";
	
// 	echo (count($polyline));
	
	return $polyline;
    
// 	$polyline = "";
// 
// 	foreach ($position_lat as $key => $value) {  // Assumes every lat has a corresponding long
// 		$lat_long_combined[] = [$position_lat[$key],$position_long[$key]];
// 		$polyline .= "[" . $position_lat[$key] . "," . $position_long[$key] . "],";
// 	}
// 	$polyline = rtrim($polyline, ",");
// 	$polyline = "[" . $polyline . "]";
// 	
// 	return $polyline;
}

function showFitFile($atts) {

	global $options;
	$options = new mapOptions();

	$atts = array_change_key_case($atts, CASE_LOWER);

	$a = shortcode_atts(array(
		'file' => 'empty string',
		'colour' => '',
		'color' => '',
		'interactive' => 'NO',
		'showpower' => 'NO',
		'units' => 'metric'
	), $atts);
	
	
	$file = $a['file'];
	
	$colour = 'red'; // Default Colour for line
	if (!empty($a['colour'])) {
		$colour = $a['colour'];
	}
	
	if (!empty($a['color'])) {
		$colour = $a['color'];
	}
	
	$options->colour = $colour;
	$options->units = $a['units'];
	$options->isInteractive = $a['interactive'];
	
	$options->uniqueID = uniqid('', TRUE);
	
	sff_readFitFile($file);
	
	return sff_fitHTML();
}

function getMapCode() {
	global $options;
	global $startPoint;
	global $endPoint;
	$maphtml = "<div id=\"mapid-" . $options->uniqueID . "\" style=\"width: 100%; height: 400px;\"></div>";
	
	$maphtml = $maphtml . "<script>	
	var map = new L.map('mapid-" . $options->uniqueID . "', {zoomControl:false, 
	layers: [
		new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			'attribution': 'Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors'
		})
	],
	center: [51.505, -0.09],
	zoom: 13
	}); 
	
	" . sff_loadIcons() . "
	
	var poly = L.polyline([" . sff_routePolyline() . "], {color: '" . sff_getRouteColour() . "'});
	
	poly.addTo(map);
	
	L.marker(" . $startPoint . ", {icon: greenIcon}).addTo(map)
	L.marker(" . $endPoint . ", {icon: blueIcon}).addTo(map)
	
	var centre = poly.getCenter();
	var bounds = poly.getBounds();
	
	map.fitBounds(bounds);
	
	" . sff_getInteractive() . "
</script>";
	return $maphtml;
}

function sff_timeZoneForCoords($lat, $long) {
	$url = 'http://api.geonames.org/timezone?lat=' . $lat . '&lng=' . $long . '&username=tevendale';
// 	echo $url;
	$xml = simplexml_load_file($url);
// 	print_r($xml->timezone->timezoneId);
// 	echo $xml;
// 	foreach ($xml->geoname as $o_location){
// 	printf(
// 		'Timezone %s<br>
// 		lat is %s<br>
// 		lon is %s<br>
// 		',
// 		$o_location->timezoneId,
// 		$o_location->lat,
// 		$o_location->lng,
// 	);
// 	}
return $xml->timezone->timezoneId;
}

// Add Shortcode
add_shortcode('showfitfile', 'showFitFile');


// Add the Leaflet.js css & javascript files
add_action('wp_enqueue_scripts', 'sff_leafletjs_load');

function sff_leafletjs_load(){
	global $options;
	// Custom css for table containing map and data
	$cssurl = plugins_url('/styles/showfitfile.css', __FILE__);
	wp_enqueue_style('showfitfile_css', $cssurl);
	
	//CSS and JS for Leaflet
	wp_enqueue_style('leafletjs_css', 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
	wp_enqueue_script('leafletjs', 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js');
	
	// Custom css for displaying Map
	$map_custom_css = "
		body {
			padding: 0;
			margin: 0;
		}
		html, body, #mapid, mapid, map {
			height: 100%;
			width: 100%;
		}";
  wp_add_inline_style('leafletjs_css', $map_custom_css );
}

function sff_getRouteColour() {
	global $options;
	return esc_js($options->colour);
}

function sff_loadIcons() {
	$loadIcons = "var greenIcon = new L.Icon({
	  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	  iconSize: [25, 41],
	  iconAnchor: [12, 41],
	  popupAnchor: [1, -34],
	  shadowSize: [41, 41]
	});
	
	
	var blueIcon = new L.Icon({
	  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	  iconSize: [25, 41],
	  iconAnchor: [12, 41],
	  popupAnchor: [1, -34],
	  shadowSize: [41, 41]
	});";
	
	return $loadIcons;
}

function sff_getInteractive() {
	// Determine if the map can be scrolled and panned
	global $options;
	if (strtolower($options->isInteractive) == 'yes') {
		return "map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
		map.dragging.enable();";
	}
	else {
		return "map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
		map.dragging.disable();";
	}
}

function sff_getUniqueID() {
	global $options;
	return $options->uniqueID;
}



// Adds .fit filetype to the allowable types. Without this we can't upload .fit files to the gallery
add_filter('upload_mimes', 'fit_mime_types');

function fit_mime_types( $mimes ) {
	
        // New allowed mime types.
        $mimes['fit'] = 'application/fit';

	return $mimes;
}


// Upload .fit files to a separate folder, otherwise we can't find them in the yyyy/mm sub-folders
add_filter('wp_handle_upload_prefilter', 'sff_pre_upload');
add_filter('wp_handle_upload', 'sff_post_upload');

function sff_pre_upload($file){
    add_filter('upload_dir', 'sff_custom_upload_dir');
    return $file;
}

function sff_post_upload($fileinfo){
    remove_filter('upload_dir', 'sff_custom_upload_dir');
    return $fileinfo;
}

function sff_custom_upload_dir($path){    
    $extension = substr(strrchr($_POST['name'],'.'),1);
    if(!empty($path['error']) ||  $extension != 'fit') { return $path; } //error or other filetype; do nothing. 
    $customdir = '/fit_Files';
    $path['path']    = str_replace($path['subdir'], '', $path['path']); //remove default subdir (year/month)
    $path['url']     = str_replace($path['subdir'], '', $path['url']);      
    $path['subdir']  = $customdir;
    $path['path']   .= $customdir; 
    $path['url']    .= $customdir;  
    return $path;
}

?>