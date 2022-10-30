=== Show Fit File ===
Contributors:      stuarttevendale
Tags:              garmin, fit
Tested up to:      6.1
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

== Description ==

This plugin allows you to add a map and summary exercise data from a .fit (Flexible and Interoperable Data Transfer) file. The maps are generated using leafletJS with the map tiles provided by OpenStreetMap.

Both a Gutenberg Block and Shortcode versions are present in this plugin

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload complete 'showfit' folder to `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Upload a .fit file to your Media Library
4. Add the ShortCode or Block to your post
5. Done!

== Usage ==

=== Block ===

Add the Show Fit File block to your post

Click on the blue button below the map to upload your .fit file. After a couple of seconds, your file will then be displayed.

=== Shortcode ===

Upload the .fit file to your Media Library, then simply create a map from the file by adding the following ShortCode to your post:

[showfitfile file="2019-06-16-10-48-12.fit"]

To change the units to Imperial (default is metric):

[showfitfile file="2019-06-16-10-48-12.fit" units = "imperial"]

To change the route colour (default is 'Red'):

[showfitfile file="2019-06-16-10-48-12.fit" colour = "blue"]

To allow scrolling and zooming of the map (default is 'no')

[showfitfile file="2019-06-16-10-48-12.fit" interactive = "yes"]

== Changelog ==

= 1.0.0 =
* Introduces ShowFitFile Block
* Adds gesture scroll to Shortcode version

