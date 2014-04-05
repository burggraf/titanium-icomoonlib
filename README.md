# icomoonlib

## Titanium Alloy library for IcoMoon fonts
 	
### setup
1. create a font using the IcoMoon App located at http://icomoon.io
2. download your font
3. copy your <fontname>.ttf file to /app/assets/fonts
4. copy your selection.json file to /app/assets/fontmaps and name it <fontname>.json
5. copy this file (icomoonlib.js) to /app/lib
6. call getIconXXXXX() functions from your app

### common parameters:
	
	fontname: this is the name of the font file matching <fontname>.ttf and <fontname>.json

	iconname: this is the name of the icon you want to retrieve

	size: the size of the icon you want in dp (it'll be square by default)

	options: an optional object of Titanium.UI.label properties to be applied to the object that is returned

## methods

### getIcon(fontname, iconname, size, options)
Returns a local filename (including complete local path) of a png image file created to your specifications.  If the file does not exist, it will be created and saved to the Ti.Filesystem.applicationCacheDirectory folder.  If the file already exists in the cache, the complete path and filename will be returned.

	var icomoonlib = require("icomoonlib");
	// create a 32dp x 32dp red dog icon
	var myicon = icomoonlib.getIcon("icomoon","big_red_dog",32,{color:"red"});
	console.log("The cached image now resides at: " + myicon);
	var imageView = Ti.UI.createImageView({image:myicon}); 

### getIconAsLabel(fontname, iconname, size, options)
Returns a Titanium.UI.Label object.

	var icomoonlib = require("icomoonlib");
	// create a 32dp x 32dp red dog icon
	var mylabel = icomoonlib.getIconAsLabel("icomoon",
										"big_red_dog",
										32,
										{color:"red",top:"10dp",left:"10dp"});
	// mylabel contains a label object that can be added to a view or window

### getIconAsBlob(fontname, iconname, size, options)
Returns a Blob object containing an image.  The image is not cached, so getIcon is preferred in most cases, since it caches images.

	var icomoonlib = require("icomoonlib");
	// create a 32dp x 32dp red dog icon
	var myicon = icomoonlib.getIconAsBlob("icomoon","big_red_dog",32,{color:"red"});
	// myicon now holds a blob containing the image
	var imageView = Ti.UI.createImageView({image:myicon}); 
	
### getIconAsImageView(fontname, iconname, size, options)
Creates an image file using getIcon(), then creates and returns a Ti.UI.ImageView object containing the cached image.

	var icomoonlib = require("icomoonlib");
	// create a 32dp x 32dp red dog icon
	var myimageview = icomoonlib.getIconAsImageView("icomoon","big_red_dog",32,{color:"red"});
	// myimageview is a Ti.UI.ImageView object that can be added to a view or window

### getFontList(fontname, size, options)
For debug purposes only.  Opens a modal window showing the list of icons and icon names for the given font.  This is provided only for developers who have misplaced their icon name list and need to quickly find the name of an icon they need.

	var icomoonlib = require("icomoonlib");
	icomoonlib.getFontList("icomoon",32,{color:"blue");
