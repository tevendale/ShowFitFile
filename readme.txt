=== Show Fit File ===
Contributors: stuarttevendale
Donate link: https://yellowfield.co.uk
Tags: Garmin, fit
Requires at least: 5.0
Tested up to: 5.8
Stable tag: trunk
Requires PHP: 5.2.4
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

This plugin allows you to add a map and summary exercise data from a .fit (Flexible and Interoperable Data Transfer) file. The maps are generated using leafletJS with the map tiles provided by OpenStreetMap.

=== Usage ===

Upload the .fit file to your Media Library, then simply create a map from the file by adding the following ShortCode to your post:

[showfitfile file="2019-06-16-10-48-12.fit"]

To change the units to Imperial (default is metric):

[showfitfile file="2019-06-16-10-48-12.fit" units = "imperial"]

To change the route colour (default is 'Red'):

[showfitfile file="2019-06-16-10-48-12.fit" colour = "blue"]

To allow scrolling and zooming of the map (default is 'no')

[showfitfile file="2019-06-16-10-48-12.fit" interactive = "yes"]

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload complete 'showfit' folder to `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Upload a .fit file to your Media Library
4. Add the ShortCode to your post
5. Done!

== Changelog ==

= 0.4 =
Fixes occasional JSON error when saving a post

== Support ==

For any queries or problems, email stuart@yellowfield.co.uk

