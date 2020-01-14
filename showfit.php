<?php
/**
 * @package Show_Fit_File
 * @version 0.1
 */
/*
Plugin Name: Show Fit File
Plugin URI: http://wordpress.org/plugins/Show-FIT-File/
Description: Displays the data from a .fit file (Flexible and Interoperable Data Transfer) as part of a blog post.
Author: Yellow Field Technologies Ltd
Version: 0.1
Author URI: http://Yellowfield.co.uk
*/


/* TODO
✓ Create one function that reads the .fit file
✓ Have a global oject that stores the imported .fit data and use this in the other functions (map, summary data, etc)
Check if the imported object is null, and import is necessary
Read the file from the folder whewre images are uploaded to? (Uploads) --> find out how to get path to this, also, files seem to be arranged in yyyy/mm folder structure
	- Seems to work with yyyy/mm folders, seems to use the date the post was created.
	- Do some more testing, i.e. add to older post and see what path is produced
	- Add option to upload to custom folder ????

Sort out styling of Table
	- Move styles into a srtylesheet file and load - easier for users to customise

✓ Add options to Shortcut
	- Line colour - RED
	- Show Power - NO
	- Can Scroll - NO
	- Can Zoom - NO
		- Maybe make the above two just 'Is Interactive'?
	- Obfusicate End Points - NO
	- Metric/Imperial - Metric
	

Add Sport Icon?
	- Add option to shortcut to specify icon file?
	- Include icon for swim, bike & run


Set up Github repository
Set up Webpage
Readme file
Text for Wordpress Page
Investigate how to promote WP Plugins

Phase 2
Add Altitude Graph under map with option to show or hide
Show multisport sessions with all legs
Show laps

'Pro' Version - Paid for
Show graphs of .fit data - HR, power, speed, etc.
*/

require __DIR__ . '/src/phpFITFileAnalysis.php';

// Class to hold the various options for the map
class mapOptions {
	public $routeLineColour;
	public $isInteractive;
	public $units;
	
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

function readFitFile($file) {
	try {
		$upload_dir = wp_upload_dir();
		$url = $upload_dir['path'];

// 		$file = '/files/' . $file;
		$file = $url . '/' . $file;
		$filename = $file;
		
		$options = [
		// Just using the defaults so no need to provide
		//		'fix_data'	=> [],
		//		'units'		=> 'metric', Options: statue, raw, metric
		//		'pace'		=> false
		];
		global $pFFA;
		$pFFA = new adriangibbons\phpFITFileAnalysis($file, $options);
	} catch (Exception $e) {
		echo 'caught exception: '.$e->getMessage();
		die();
	}
}

function fitHTML() {
	global $pFFA;
	global $options;
	$date = new DateTime('now', new DateTimeZone('UTC'));
    $date_s = $pFFA->data_mesgs['session']['start_time'];
    $date->setTimestamp($date_s);
    
    $unitsString = "km";
    if ($options->units == "imperial") {
    	$unitsString = "miles";
    }
	
	$html = "<table class=\"dataTable\"><tr><td class=\"dataTable\"><div class=\"dataTitle\">Time:</div><div class=\"dataItem\">" . $date->format('d-M-y g:i a') . "</div></td><td class=\"dataTable\"><div class=\"dataTitle\">Duration:</div><div class=\"dataItem\">" . gmdate('H:i:s', $pFFA->data_mesgs['session']['total_elapsed_time']) . "</div></td><td class=\"dataTable\"><div class=\"dataTitle\">Distance:</div><div class=\"dataItem\">" . max($pFFA->data_mesgs['record']['distance']) . " " . $unitsString . "</div></td></tr><tr><td colspan=\"3\" class=\"dataTable\"><div id=\"mapid\" style=\"width: 100%; height: 400px;\"></div></td></tr></table>";
	
	return $html;
}

function routePolyline() {

	global $pFFA;

    // Google Static Maps API
    $position_lat = $pFFA->data_mesgs['record']['position_lat'];
    $position_long = $pFFA->data_mesgs['record']['position_long'];
    $lat_long_combined = [];
    
	$polyline = "";

	foreach ($position_lat as $key => $value) {  // Assumes every lat has a corresponding long
		$lat_long_combined[] = [$position_lat[$key],$position_long[$key]];
		$polyline .= "[" . $position_lat[$key] . "," . $position_long[$key] . "],";
	}
	$polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";
	
	return $polyline;
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
	
	readFitFile($file);
	
	return fitHTML();
}

// Add Shortcode
add_shortcode('showFitFile', 'showFitFile');


// Add the Leaflet.js css & javascript files
add_action('wp_enqueue_scripts', 'leafletjs_load');

function leafletjs_load(){
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

// Add the javascript for the map to the footer section
add_action( 'wp_footer', 'my_footer_scripts' );
function my_footer_scripts(){
  ?>  <script>	
	var map = new L.map('mapid', {zoomControl:false, 
	layers: [
		new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			'attribution': 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		})
	],
	center: [51.505, -0.09],
	zoom: 13
	}); 
	
	var poly = L.polyline([<?php echo routePolyline(); ?>], {color: '<?php echo getRouteColour(); ?>'});
	
	poly.addTo(map);
	
	var centre = poly.getCenter();
	var bounds = poly.getBounds();
	
	map.fitBounds(bounds);
	
	<?php echo getInteractive(); ?>
</script>
  <?php
}

function getRouteColour() {
	global $options;
	return esc_js($options->colour);
}

function getInteractive() {
	// Determine if the map can be scrolled and panned
	global $options;
	if ($options->isInteractive == 'YES') {
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


// Adds .fit filetype to the allowable types. Without this we can't upload .fit files to the gallery
function my_custom_mime_types( $mimes ) {
	
        // New allowed mime types.
        $mimes['fit'] = 'application/fit';

	return $mimes;
}
add_filter( 'upload_mimes', 'my_custom_mime_types' );

?>