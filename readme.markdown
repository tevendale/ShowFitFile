### ShowFitFile

This plugin allows you to add a map and summary exercise data from a .fit (Flexible and Interoperable Data Transfer) file. The maps are generated using leafletJS with the map tiles provided by OpenStreetMap. THe plugin inclides a shortcode and Gutenberg Block version.

## Usage

![Sample](/images/SuieMap.png)

### Block

Add the ShowFitFile Block to your post. It will initially show a map of central London.

Click on the blue button below the map to select or upload a .fit file. After a few seconds, your file ill be displayed.

The sidebar contains various options for controlling the look and interactivity of the map.

### Shortcode

Upload the .fit file to your Media Library, then simply create a map from the file by adding the following ShortCode to your post:

[showfitfile file="2019-06-16-10-48-12.fit"]

To change the units to Imperial (default is metric):

[showfitfile file="2019-06-16-10-48-12.fit" units = "imperial"]

To change the route colour (default is 'Red'):

[showfitfile file="2019-06-16-10-48-12.fit" colour = "blue"]

To allow scrolling and zooming of the map (default is 'no')

[showfitfile file="2019-06-16-10-48-12.fit" interactive = "yes"]

## Installation

This section describes how to install the plugin and get it working.

1. Upload complete 'showfit' folder to `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Upload a .fit file to your Media Library
1. Add the ShortCode to your post
1. Done!

## Support

For any queries or problems, email stuart@yellowfield.co.uk

