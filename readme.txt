=== Show Fit File ===
Contributors:      stuarttevendale
Tags:              Garmin, fit, gpx, tcx, OpenStreetMap, Wahoo, Polar, Hammerhead
Requires at least: 5.8
Tested up to:      6.1
Stable tag:        1.1.0
Requires PHP:	   7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A plugin to display fit, gpx and tcx files.

== Description ==

Show Fit File is a sports & fitness oriented plugin that allows you to add a map and summary exercise data from a fit, gpx or tcx file. The maps are generated using leafletJS with the map tiles provided by OpenStreetMap.

Both a Gutenberg Block and Shortcode versions are present in this plugin.

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload complete 'showfit' folder to `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Upload a .fit file to your Media Library
4. Add the ShortCode or Block to your post
5. Done!

== Usage ==

= Block =

Add the Show Fit File block to your post

Click on the blue button below the map to upload your .fit file. After a couple of seconds, your file will then be displayed.

An altitude profile graph will be displayed under the map. This can be hidden using the block controls in the side bar.

= Shortcode =

Upload the .fit file to your Media Library, then simply create a map from the file by adding the following ShortCode to your post:

[showfitfile file="2019-06-16-10-48-12.fit"]

To change the units to Imperial (default is metric):

[showfitfile file="2019-06-16-10-48-12.fit" units = "imperial"]

To change the route colour (default is 'Red'):

[showfitfile file="2019-06-16-10-48-12.fit" colour = "blue"]

To allow scrolling and zooming of the map (default is 'no')

[showfitfile file="2019-06-16-10-48-12.fit" interactive = "yes"]

= Icon =

The icon uses Map by Atif Arshad from the Noun Project https://thenounproject.com/browse/icons/term/map/

== Screenshots ==

1. Plugin Showing Map and Altitude Graph

== Frequently Asked Questions ==

= What's the difference between moving time & duration? =

Moving time is the time you actually spent moving during your session, while duration is the time from the start to the finish, including any stops or pauses. If you stop to take a photo or for a quick coffee, that time won't be included in moving time. 

It's worth noting that, depending on the setup of your device, you may not see much difference between Moving Time and Duration, particularly if your device is set to auto-pause.

== Upgrade Notice ==
= 1.1.0 =
When upgrading blocks from V1.0.0, you'll need to import the .fit file again, if you want to display the profile graph or the ascent/descent figures.

== Changelog ==
= 1.1.0 =
* Can now display .gpx & .tcx files for block
* Adds Altitude graph for block
* Adds gesture scroll in block editor
* Shows ascent & descent in table about the map
* Has option of show either moving time or elapsed time
* Other bug fixes

= 1.0.0 =
* Introduces ShowFitFile Block
* Adds gesture scroll to Shortcode version
