'use strict';

/** @type {HTMLCanvasElement} */
var canvas;
var image = new Image();
var context;
var inside;

var scaledWidth, scaledHeight;

var angleInDegrees = 0;

var mouseDown = false;
var clickPos = {
	x: 0,
	y: 0
}
var releasePos = {
	x: 0,
	y: 0
}
var currPos = {
	x: 0,
	y: 0
}

var currTool = 'none';
