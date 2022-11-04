<?php

/**
 * Plugin Name:       Show Fit File
 * Plugin URI:        https://stuarttevendale.com/wordpress-plugin-for-garmin-fit-files/
 * Description:       A fitness-focused plugin for displaying route and exercise data from .fit, .gpx and .tcx files.
 * Version:           1.1.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Stuart Tevendale
 * Author URI:        http://stuarttevendale.com
 * License:           GPL v2
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

/**
*
* Copyright (c), Stuart Tevendale, 2018 - 2022
*
*/


require __DIR__ . '/libraries/phpFITFileAnalysis.php';
require __DIR__ . '/libraries/Line_DouglasPeucker.php';

require_once __DIR__ . '/graphs.php';


if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
    define( 'SFF_DEBUG', true );
}

// Add Shortcode
add_shortcode('showfitfile', 'showFitFile');

// Add the Leaflet.js css & javascript files
add_action('wp_enqueue_scripts', 'sff_scripts_and_styles_load');

// Adds .fit filetype to the allowable types. Without this we can't upload .fit files to the gallery
add_filter('upload_mimes', 'sff_fit_mime_types');

// Upload .fit files to a separate folder, otherwise we can't find them in the yyyy/mm sub-folders
add_filter('wp_handle_upload_prefilter', 'sff_pre_upload');
add_filter('wp_handle_upload', 'sff_post_upload');

// Hook the enqueue functions into the editor
add_action( 'enqueue_block_editor_assets', 'sff_scripts_and_styles_load' );

global $startPoint;
global $endPoint;



/**
*******************************************************************

Code for Block
This is separate to Shortcode functions so that I can add extra functionality
to the block without breaking the Shortcode version
The alternative is splitting the plugin into 2 separate plugins

*******************************************************************
*/


// Add code for Block
add_action('init', function() {
	register_block_type( __DIR__ . '/build', [
		'render_callback' => 'yft_showfitfile_block_render'
	]);
});

function yft_showfitfile_block_render($attr, $content) {

	// return the block output
	$renderHTML = yft_showfitfile_block_summary_table($attr) . yft_showfitfile_block_map($attr);
	
	if ($attr['showAltitudeGraph']) {
		$renderHTML .= yft_showfitfile_block_altitudegraph($attr);
	}
	
	$renderHTML .= "</script>";

	// return the block output
	return $renderHTML;

}

function yft_showfitfile_block_summary_table($attr) {
// 	print_r($attr);
	$durationLabel = "Duration:";
	if ($attr['showSummary']) {
		if ($attr['useMovingTime']) {
			$durationLabel = "Moving Time:";
		}
	// HTML for session details
	$htmlSessionDetails = "<tr><td class=\"dataCell\"><div class=\"dataTitle\">Time:</div><div class=\"dataItem\">" . $attr['time'] . "</div></td>\n<td class=\"dataCell\"><div class=\"dataTitle\">" . $durationLabel . "</div><div class=\"dataItem\">" . ($attr['duration']) . "</div>\n</td><td class=\"dataCell\"><div class=\"dataTitle\">Ascent/Descent:</div><div class=\"dataItem\"><i class=\"fa-solid fa-arrow-trend-up\"></i> " . $attr['ascentString'] . " <i class=\"fa-solid fa-arrow-trend-down\"></i> " . $attr['descentString'] . "</div>\n</td><td style=\"text-align: right\"; class=\"dataCell\"><div class=\"dataTitle\">Distance:</div><div class=\"dataItem\">" . $attr['distanceString'] . "</div></td></tr>";

	
	$html = "<table className=\"dataTable\">" . $htmlSessionDetails . "</table>";

	return $html;
	}
}

function yft_showfitfile_block_canvas_for_altitude_graph() {
	return yft_showfitfile_block_canvas_for_graph("altitude");
}

function yft_showfitfile_block_canvas_for_graph($canvasID) {
	$graphCanvas = "<canvas id=\"" . $canvasID . "\" width=\"650\" height=\"150\"></canvas>\n";
	return $graphCanvas;
}

function yft_showfitfile_block_latitude_data($attr) {

	$points = $attr['route'];
	$polyline = "";
	$nn = 0;

    foreach($points as $latLongPair) {
//     	$polyline .= "[" . $latLongPair[0] . "," . $latLongPair[1] . "],";
    	$polyline .= "{x: " . $nn++ . ", y: " . $latLongPair[0] . "},";
    }

    $polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";

	return $polyline;
}

function yft_showfitfile_block_longitude_data($attr) {
	$points = $attr['route'];
	$polyline = "";
	$nn = 0;

    foreach($points as $latLongPair) {
//     	$polyline .= "[" . $latLongPair[0] . "," . $latLongPair[1] . "],";
    	$polyline .= "{x: " . $nn++ . ", y: " . $latLongPair[1] . "},";
    }

    $polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";

	return $polyline;
}


function yft_showfitfile_block_map($attr) {
	global $startPoint;
	global $endPoint;
	$lineColour = $attr['lineColour'];


	$mapID = uniqid('', TRUE);
	$maphtml = "<div id=\"mapid-" . $mapID . "\" style=\"width: 100%; height: 400px; outline: none; margin-top: 0px\"></div>";
	
	if ($attr['showAltitudeGraph']) {
		// Add the canvas for the altitude graph
		$maphtml .= yft_showfitfile_block_canvas_for_altitude_graph();
	}


	$maphtml = $maphtml . "<script>
	( function(){
	var map = new L.map('mapid-" . $mapID . "', {
	layers: [
		new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			'attribution': 'Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors'
		})
	],
	center: [51.505, -0.09],
	zoom: 13,
	});

	" . sff_loadIcons() . "

	var poly = L.polyline([" . yft_showfitfile_block_route($attr) . "], {color: '" . $lineColour . "'});

	poly.addTo(map);

	" . yft_showfitfile_block_markers($attr) . "

	var centre = poly.getCenter();
	var bounds = poly.getBounds();

	map.fitBounds(bounds);

	" . yft_showfitfile_block_interactive($attr) . "
	function is_loading() {
			return document.body.classList.contains('loading');
		}
		var timer = 100;
		function checkRender() {
			if( is_loading()) {
				setTimeout(function(){
					checkRender();
				}, timer);
			} else {
				map.invalidateSize(true);
			}
		}
		if( is_loading()) {
			checkRender();
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				map.invalidateSize(true);
			});
		}
	})();
	";
	return $maphtml;
}

function yft_showfitfile_block_markers($attr) {
	global $startPoint;
	global $endPoint;

	$html = "";
	if ($attr['showStartMarker']) {
		$html .= "L.marker(" . $startPoint . ", {icon: greenIcon}).addTo(map)\n";
	}

	if ($attr['showEndMarker']) {
		$html .= "L.marker(" . $endPoint . ", {icon: blueIcon}).addTo(map)\n";
	}

	return $html;
}

function yft_showfitfile_block_route($attr) {

	global $startPoint;
	global $endPoint;

	$points = $attr['route'];
	$polyline = "";

    foreach($points as $latLongPair) {
    	$polyline .= "[" . $latLongPair[0] . "," . $latLongPair[1] . "],";
    }

    $polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";

	$startPoint = "[" . $attr['startPos'][0] . "," . $attr['startPos'][1] . "]";
	$endPoint = "[" . $attr['endPos'][0] . "," . $attr['endPos'][1] . "]";
// 	$endPoint = $attr['endPos'];

// 	if (count($points) > 0) {
// 		$startPoint = "[" . $points[0][0] . "," . $points[0][1] . "]";
// 		$endPoint = "[" . $points[count($points)-1][0] . "," . $points[count($points)-1][1] . "]";
//     }
	return $polyline;
}

function yft_showfitfile_block_interactive($attr) {
	// Determine if the map can be scrolled and panned
	$interactive = $attr['interactive'];
	if ($interactive) {
		return "map.gestureHandling.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
		map.dragging.enable();
		map.zoomControl.addTo(map);\n";
	}
	else {
		return "map.gestureHandling.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
		map.dragging.disable();
		map.zoomControl.remove();\n";
	}
}



/**
*******************************************************************

Code for Shortcode

*******************************************************************
*/


function showFitFile($atts) {
	// Render the shortcode

	global $options;
	$options = new ssf_mapOptions();
	$optionsChanged = false;

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

	if (sff_doesFileExist($file)) {
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

		return sff_showFitFile($options, $file);
	}
	else {
		$filePath = sff_pathToFileInCustomFolder($file);
		return "<p>fit file not found: " . $filePath . "</p>";
	}
}

function sff_showFitFile($options, $file) {
	// Renders an HTML table with the summary of the data and the map with a route overlay

	$options->uniqueID = uniqid('', TRUE);

	$transientID = "sff_transient" . $file;
	$transientOptionsID = "sff_transient" . "options" . $file;

	// Retrieve the cached options
	$cachedOptions = get_transient($transientOptionsID);
	// Test if the cached options are the same as the options passed this time
	if ($cachedOptions === false) {
		set_transient($transientOptionsID, $options);
	}
	else {
		if (($cachedOptions->colour == $options->colour) && ($cachedOptions->units == $options->units) && ($cachedOptions->isInteractive == $options->isInteractive)) {
			$optionsChanged = false;
		}
		else {
			set_transient($transientOptionsID, $options);
			$optionsChanged = true;
		}
	}

	// Cache the HTML so that it's only generated the first time the map is displayed
	$routeHTML = false;
	if ( defined('SFF_DEBUG') && true === SFF_DEBUG ) {
		delete_transient($transientID);
// 		console_log("regenerating map html");
	}
	else {
		$routeHTML = get_transient($transientID);
// 		console_log("Using cached map html");
	}

	if (($routeHTML === false) || $optionsChanged) {
// 		console_log("Regenerating Map");
		$success = sff_readFitFile($file);
		if ( $success === true ) {
			$routeHTML = sff_fitHTML();
			set_transient($transientID, $routeHTML);
		}
	}
	return $routeHTML;
}

// Class to hold the various options for the map
class ssf_mapOptions {
	public $routeLineColour;
	public $isInteractive;
	public $units;
	public $showSummary;
	public $uniqueID;

	function __construct() {
		$routeLineColour = 'red';
		$isInteractive = 'NO';
		$showSummary = 'YES';
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
		return true;
	} catch (Exception $e) {
		echo '<p>Error reading fit file: ' . $e->getMessage() . '</p>';
		return false;
	}
}

function sff_pathToFileInCustomFolder($file) {
	$customdir = '/fit_Files';
	$path = wp_upload_dir();
	$path['path']    = str_replace($path['subdir'], '', $path['path']); //remove default subdir (year/month)
	$path['url']     = str_replace($path['subdir'], '', $path['url']);
	$path['subdir']  = $customdir;
	$path['path']   .= $customdir;
	$path['url']    .= $customdir;

	$url = $path['path'];

	$filePath = $url . '/' . $file;

	return $filePath;
}

function sff_doesFileExist($file) {
	if (empty($file)) {
		return false;
	}

	$filePath = sff_pathToFileInCustomFolder($file);
	if (file_exists($filePath)) {
		return true;
	}
	else {
		return false;
	}
}

function sff_fitHTML() {
	global $pFFA;
	global $options;
	global $startLatLong;

	$mapcode = sff_getMapCode();

	$tz = sff_timeZoneForCoords($startLatLong[0], $startLatLong[1]);
	$date = new DateTime('now', new DateTimeZone($tz));
    $date_s = $pFFA->data_mesgs['session']['start_time'];
    $date->setTimestamp($date_s);

    $unitsString = "km";
    if ($options->units == "imperial") {
    	$unitsString = "miles";
    }

	$html = "<table class=\"dataTable\">";

// Fails to show map for shortcode if the next line isn't commented out
// 	if ($options->showSummary == 'YES') {
		$html .= "<tr><td class=\"dataTable\"><div class=\"dataTitle\">Time:</div><div class=\"dataItem\">" . $date->format('d-M-y g:i a') . "</div></td>\n<td class=\"dataTable\"><div class=\"dataTitle\">Duration:</div><div class=\"dataItem\">" . gmdate('H:i:s', $pFFA->data_mesgs['session']['total_timer_time']) . "</div>\n</td><td class=\"dataTable\"><div class=\"dataTitle\">Distance:</div><div class=\"dataItem\">" . max($pFFA->data_mesgs['record']['distance']) . " " . $unitsString . "</div></td></tr>";


// 	}
	$html .= "<tr><td colspan=\"3\" class=\"dataTable\">" . $mapcode ."</td></tr></table>";

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

	// Reduce the number of Lat/Lonf coords to below 1000 - for a static map, we probably could go lower.
	// For a zoom'able map, we might think about using all the data.
	$delta = 0.00001;
	do {
		$RDP_LatLng_coord = simplify_RDP($lat_long_combined, $delta);  // Simplify the array of coordinates using the Ramer-Douglas-Peucker algorithm.
		$delta += 0.00001;  // Rough accuracy somewhere between 4m and 12m depending where in the World coordinates are, source http://en.wikipedia.org/wiki/Decimal_degrees
	} while (count($RDP_LatLng_coord) > 1000);

	$startLatLong = $lat_long_combined[0];
	$LatLng_start = implode(',', $lat_long_combined[0]);
    $LatLng_finish = implode(',', $lat_long_combined[count($lat_long_combined)-1]);

    $startPoint = "[" . $LatLng_start . "]";
    $endPoint = "[" . $LatLng_finish . "]";

    sff_timeZoneForCoords($lat_long_combined[0][0], $lat_long_combined[0][1]);

	$polyline = "";

    foreach($RDP_LatLng_coord as $latLongPair) {
    	$polyline .= "[" . $latLongPair[0] . "," . $latLongPair[1] . "],";
    }

    $polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";

	return $polyline;
}

function sff_getMapCode() {
	global $options;
	global $startPoint;
	global $endPoint;

	$maphtml = "<div id=\"mapid-" . $options->uniqueID . "\" style=\"width: 100%; height: 400px;\"></div>";

	$maphtml = $maphtml . "<script>
	( function(){
	var map = new L.map('mapid-" . $options->uniqueID . "', {
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
	function is_loading() {
			return document.body.classList.contains('loading');
		}
		var timer = 100;
		function checkRender() {
			if( is_loading()) {
				setTimeout(function(){
					checkRender();
				}, timer);
			} else {
				map.invalidateSize(true);
			}
		}
		if( is_loading()) {
			checkRender();
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				map.invalidateSize(true);
			});
		}
	})();
	</script>";
	return $maphtml;
}

function sff_timeZoneForCoords($lat, $long) {
	$url = 'http://api.geonames.org/timezone?lat=' . $lat . '&lng=' . $long . '&username=tevendale';
	$xml = simplexml_load_file($url);

return $xml->timezone->timezoneId;
}

function sff_scripts_and_styles_load(){
	global $options;
	// Custom css for table containing map and data
	$cssurl = plugins_url('/styles/showfitfile.css', __FILE__);
	wp_enqueue_style('showfitfile_css', $cssurl);

	//CSS and JS for Leaflet
	$leafletcss = plugins_url('/styles/leaflet.css', __FILE__);
	$leafletjs = plugins_url('/styles/leaflet.js', __FILE__);
	wp_enqueue_style('leafletjs_css', $leafletcss);
	wp_enqueue_script('leafletjs', $leafletjs);

	//CSS and JS for Leaflet Gesture Handling
	$leafletGHcss = plugins_url('/styles/leaflet-gesture-handling.min.css', __FILE__);
	$leafletGHjs = plugins_url('/styles/leaflet-gesture-handling.min.js', __FILE__);
	wp_enqueue_style('leafletghjs_css', $leafletGHcss);
	wp_enqueue_script('leafletghjs', $leafletGHjs);


	//CSS and JS for FontAwesome
	$faSolid = plugins_url('/styles/solid.js', __FILE__);
	$fontawesomejs = plugins_url('/styles/fontawesome.js', __FILE__);
	wp_enqueue_script('faSolid', $faSolid);
	wp_enqueue_script('fontawesomejs', $fontawesomejs);

	// For gpx export
// 	$gpxExport = plugins_url('/src/gpxExport.js', __FILE__);
// 	wp_enqueue_script('gpxExport', $gpxExport);


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

  wp_enqueue_script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
}

function sff_getRouteColour() {
	global $options;
	return esc_js($options->colour);
}

function sff_loadIcons() {
	$greenIcon = plugins_url('/styles/images/marker-icon-2x-green.png', __FILE__);
	$blueIcon = plugins_url('/styles/images/marker-icon-2x-blue.png', __FILE__);
	$shadowIcon = plugins_url('/styles/images/marker-shadow.png', __FILE__);
	$loadIcons = "var greenIcon = new L.Icon({
	  iconUrl: '$greenIcon',
	  shadowUrl: '$shadowIcon',
	  iconSize: [25, 41],
	  iconAnchor: [12, 41],
	  popupAnchor: [1, -34],
	  shadowSize: [41, 41]
	});


	var blueIcon = new L.Icon({
	  iconUrl: '$blueIcon',
	  shadowUrl: '$shadowIcon',
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
		return "map.gestureHandling.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
		map.dragging.enable();";
	}
	else {
		return "map.gestureHandling.disable();
		map.touchZoom.disable();
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

function sff_fit_mime_types( $mimes ) {
	// New allowed mime types.
	$mimes['fit'] = 'application/fit';
	$mimes['gpx'] = 'text/xml';
	$mimes['tcx'] = 'text/xml';
// 	print_r($mimes);
	return $mimes;
}

function sff_pre_upload($file){
    add_filter('upload_dir', 'sff_custom_upload_dir');
    return $file;
}

function sff_post_upload($fileinfo){
    remove_filter('upload_dir', 'sff_custom_upload_dir');
    return $fileinfo;
}

function sff_custom_upload_dir($path){
	$filename = sanitize_file_name($_POST['name'])  ;
    $extension = substr(strrchr($filename,'.'),1);
    if(!empty($path['error']) ||  ($extension != 'fit' &&  $extension != 'gpx'  &&  $extension != 'tcx') ) {
		return $path; //error or other filetype; do nothing.
	}
    $customdir = '/fit_Files';
    $path['path']    = str_replace($path['subdir'], '', $path['path']); //remove default subdir (year/month)
    $path['url']     = str_replace($path['subdir'], '', $path['url']);
    $path['subdir']  = $customdir;
    $path['path']   .= $customdir;
    $path['url']    .= $customdir;
    return $path;
}

// Log into the JS Console
function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) .
');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    echo $js_code;
}

?>
