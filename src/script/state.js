'use strict';

/** @type {HTMLCanvasElement} */
var canvas,
image = new Image(),
context,
inside,

scaledWidth, scaledHeight,

angleInDegrees = 0,

mouseDown = false,
clickPos = {
	x: 0,
	y: 0
},
releasePos = {
	x: 0,
	y: 0
},
currPos = {
	x: 0,
	y: 0
},

currTool = 'none';
