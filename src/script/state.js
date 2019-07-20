'use strict';

let canvas,
context,
image = new Image(),
lastImage = image,

margin,

scaledWidth,
scaledHeight,

zoom = 1,

angleInDegrees = 0,

brightness = 0,
saturation = 0,
contrast = 0,
exposure = 0,
sepia = 0,

mouseDown = false,
currPos,
deltaClick,
deltaStart,

currTool = 'none',

selection = null;
