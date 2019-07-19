'use strict';

/** @type {HTMLCanvasElement} */
var canvas,
widthPercentage = 0.65,
heightPercentage = 0.65,
canvasBorder,
image = new Image(),
lastImage = image,
context,
inside,

scaledWidth, scaledHeight,
marginX, marginY,
ratio,
scaled,
zoom = 1,

angleInDegrees = 0,

brightness = 0,
saturation = 50,
contrast = 0,
exposure = 0,
sepia = 0,

mouseDown = false,
currPos = {
	x: 0,
	y: 0
},
clickPos = {
	x: 0,
	y: 0
},
deltaClick = {
	x: 0,
	y: 0
},
deltaStart = {
	x: 0,
	y: 0
},

currTool = 'none',

selection = null;
