/* 

icomoonlib

Titanium Alloy library for IcoMoon fonts

setup:

1. create a font using the IcoMoon App located at http://icomoon.io
2. download your font
3. copy your <fontname>.ttf file to /app/assets/fonts
4. copy your selection.json file to /app/assets/fontmaps and name it <fontname>.json
5. copy this file (icomoonlib.js) to /app/lib
6. call getIconXXXXX() functions from your app

common parameters:

fontname: this is the name of the font file matching <fontname>.ttf and <fontname>.json

iconname: this is the name of the icon you want to retrieve

size: the size of the icon you want in dp (it'll be square by default)

options: an optional object of Titanium.UI.label properties to be applied to the object that is returned

 */
var fontMaps = {};

function getFont(fontname) {
	if ( typeof fontMaps[fontname] !== "undefined")
	   return fontMaps[fontname];
	   
	fontMaps[fontname] = {};
    
	try {
		var obj = JSON.parse(Titanium.Filesystem.getFile('fontmaps/' + fontname + '.json').read().text);
		var fontmap = obj.icons;
		for (var i = 0; i < fontmap.length; i++) {
			var iconName = fontmap[i].properties.name;
			var code = fontmap[i].properties.code;			
			fontMaps[fontname][iconName] = String.fromCharCode(code);
		}
	} catch (fontParseError) {
		console.log("*** There was a font parsing error.  " + "Did you copy your font's selection.json file " + "into the assets folder of your application and name it " + fontname + ".json?");
		console.log("*** fontParseError: " + fontParseError);
	}
	return fontMaps[fontname];
}


var getFontList = function(fontname, size, options) {
	var font = getFont(fontname);
	if ( typeof size == "undefined")
		size = 32;
	var scrollView = Ti.UI.createScrollView({
		layout : "vertical",
		top : size + "dp"
	});
	function showCode(e) {
		var iconname = e.source.text;
		alert("Usage:\n" + "var iconlib = require(\"icomoonlib\");\n" + "var icon = iconlib.getIcon(\"" + fontname + "\", \"" + iconname + "\", 32);\n" + "\n");
	};
	for (var iconname in font) {
		var label = Ti.UI.createLabel({
			left : "10dp",
			height : size + "dp",
			width : size + "dp",
			font : {
				fontFamily : fontname,
				fontSize : size + "dp"
			},
			text : font[iconname],
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : "black"
		});
		if ( typeof options == "object") {
			for (var attr in options) {
				label[attr] = options[attr];
			}
		}
		var title = Ti.UI.createLabel({
			text : iconname,
			size : parseInt(size / 2, 10).toString() + "dp",
			left : "10dp"
		});
		var fontRow = Ti.UI.createView({
			layout : "horizontal",
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE
		});
		fontRow.addEventListener("click", showCode);
		fontRow.add(label);
		fontRow.add(title);
		scrollView.add(fontRow);
	}
	var displayWin = Ti.UI.createWindow({
		backgroundColor : "white"
	});
	var deviceVersion = parseInt(Titanium.Platform.version.split(".")[0], 10);
	if (OS_IOS && deviceVersion >= 7)
		displayWin.top = "20dp";

	var btnClose = Titanium.UI.createButton({
		title : 'Close',
		left : "10dp"
	});
	btnClose.addEventListener('click', function(e) {
		displayWin.close();
	});
	var fontTitle = Ti.UI.createLabel({
		text : "font: " + fontname,
		size : parseInt(size / 2, 10).toString() + "dp",
		left : "10dp"
	});

	var header = Ti.UI.createView({
		layout : "horizontal",
		top : 0,
		height : size + "dp",
		width : Ti.UI.FILL,
		backgroundColor : "white",
		borderColor : "gray",
		borderWidth : 1
	});
	header.add(btnClose);
	header.add(fontTitle);
	displayWin.add(header);
	displayWin.add(scrollView);
	displayWin.open();
};

var getIconAsLabel = function(fontname, iconname, size, options) {
	
	var label = Ti.UI.createLabel({
		height : size + "dp",
		width : size + "dp",
		font : {
			fontFamily : fontname,
			fontSize : size + "dp"
		},
		text : getIconText(fontname, iconname),
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : "black"
	});
	if ( typeof options == "object") {
		for (var attr in options) {
			label[attr] = options[attr];
		}
	}
	return label;
};

var getIconText = function(fontname, iconname) {    
    var font = getFont(fontname);
    return typeof iconname == "string" ? font[iconname] : String.fromCharCode(iconname);  
};

var getIconAsBlob = function(fontname, iconname, size, options) {
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	});
	view.add(getIconAsLabel(fontname, iconname, size, options));
	return view.toImage(null, true);
};

var getIconAsImageView = function(fontname, iconname, size, options) {
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	});
	view.add(getIconAsLabel(fontname, iconname, size, options));
	var imageView = Ti.UI.createImageView({
		image : getIcon(fontname, iconname, size, options) //view.toImage(null,true)
	});
	return imageView;
};

var getIcon = function(fontname, iconname, size, options) {
	var filename = Ti.Utils.md5HexDigest(fontname + "." + iconname + "." + size + ( typeof options == "object" ? JSON.stringify(options) : "")) + ".png";
	//console.log("icon filename:" + filename);

	var path = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, filename);
	if (path.exists()) {		
		return path.nativePath;
	} else {		
		var blob = getIconAsBlob(fontname, iconname, size, options);
		console.log(blob.apiName);
		if (Ti.Android) {
			// this is a workaround for Android because toImage() does not return a blob on Android
			// https://jira.appcelerator.org/browse/TIMOB-3268
			// Android toImage() returns a dictionary (with width, height, x, y, cropRect and media)
			path.write(blob.media);
		} else {
			path.write(blob);
		}
		return path.nativePath;
	}
};

exports.getIcon = getIcon;
exports.getIconAsLabel = getIconAsLabel;
exports.getIconAsBlob = getIconAsBlob;
exports.getIconAsImageView = getIconAsImageView;
exports.getFontList = getFontList;
exports.getIconText = getIconText;