'use strict';

/** @type {HTMLCanvasElement} */
var canvas,
image = new Image(),
context,
inside,

scaledWidth, scaledHeight,

angleInDegrees = 0,

brightness,
saturation,

mouseDown = false,
currPos = {
	x: 0,
	y: 0
},

currTool = 'none',

selection = null;
