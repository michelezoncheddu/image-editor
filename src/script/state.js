'use strict';

/** @type {HTMLCanvasElement} */
var canvas,
canvasBorder,
image = new Image(),
context,
inside,

scaledWidth, scaledHeight,

angleInDegrees = 0,

brightness = 0,
saturation = 50,

mouseDown = false,
currPos = {
	x: 0,
	y: 0
},

currTool = 'none',

selection = null;
