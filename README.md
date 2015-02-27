# icomoonlib

## Titanium Alloy library for IcoMoon fonts
 	
### setup
* Create a font using the IcoMoon App located at http://icomoon.io
* Download your font package
* Copy your &lt;font package&gt;.zip file to project root or configure custom folder in the Alloy Config variable icomoonlib.zipDir
* Copy this file (icomoonlib.js) to /app/lib
* Change or add `pre:load` task to the /app/alloy.jmk
* Install nodejs module `npm install adm-zip -g`

Alloy task:

	task("pre:load", function(event, logger) {
		var path = require('path');
		var icomoonlib = require(path.join(event.dir.lib, 'icomoonlib.js'));
		icomoonlib.pre_load(event, logger, require('adm-zip'));
	}
	
Require library in your code:

	var icomoonlib = require("icomoonlib");


### common parameters:
	
	fontname: this is the name of the font file matching <fontname>.ttf and <fontname>.json

	iconname: this is the name of the icon you want to retrieve

	size: the size of the icon you want in dp (it'll be square by default)

	options: an optional object of Titanium.UI.label properties to be applied to the object that is returned

## methods

### getIcon(fontname, iconname, size, options)
Returns a local filename (including complete local path) of a png image file created to your specifications.  If the file does not exist, it will be created and saved to the Ti.Filesystem.applicationCacheDirectory folder.  If the file already exists in the cache, the complete path and filename will be returned.

	// create a 32dp x 32dp red dog icon
	var myicon = icomoonlib.getIcon("icomoon","big_red_dog",32,{color:"red"});
	console.log("The cached image now resides at: " + myicon);
	var imageView = Ti.UI.createImageView({image:myicon}); 

### getIconAsLabel(fontname, iconname, size, options)
Returns a Titanium.UI.Label object.

	// create a 32dp x 32dp red dog icon
	var mylabel = icomoonlib.getIconAsLabel("icomoon",
										"big_red_dog",
										32,
										{color:"red",top:"10dp",left:"10dp"});
	// mylabel contains a label object that can be added to a view or window

### getIconAsBlob(fontname, iconname, size, options)
Returns a Blob object containing an image.  The image is not cached, so getIcon is preferred in most cases, since it caches images.

	// create a 32dp x 32dp red dog icon
	var myicon = icomoonlib.getIconAsBlob("icomoon","big_red_dog",32,{color:"red"});
	// myicon now holds a blob containing the image
	var imageView = Ti.UI.createImageView({image:myicon}); 
	
### getIconAsImageView(fontname, iconname, size, options)
Creates an image file using getIcon(), then creates and returns a Ti.UI.ImageView object containing the cached image.

	// create a 32dp x 32dp red dog icon
	var myimageview = icomoonlib.getIconAsImageView("icomoon","big_red_dog",32,{color:"red"});
	// myimageview is a Ti.UI.ImageView object that can be added to a view or window

### getFontList(fontname, size, options)
For debug purposes only.  Opens a modal window showing the list of icons and icon names for the given font.  This is provided only for developers who have misplaced their icon name list and need to quickly find the name of an icon they need.

	icomoonlib.getFontList("icomoon",32,{color:"blue");
	
### getFontText(fontname, iconname)
Returns a icon character string

	mylabel.text = icomoonlib.getFontText("icomoon", "big_red_dog")
