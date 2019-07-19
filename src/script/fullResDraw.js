'use strict';

/**
 * Draws the full resolution image and returns the canvas
 */
function drawFullResolutionImage() {
	var bufferCanvas = document.createElement('canvas');
	var bufferContext = bufferCanvas.getContext('2d');

	// size of the canvas to contain the rotated image
	var fullWidth = Math.abs(image.width * Math.sin(degToRad(90 - angleInDegrees))) +
					Math.abs(image.height * Math.sin(degToRad(angleInDegrees))),
		fullHeight = Math.abs(image.height * Math.sin(degToRad(90 - angleInDegrees))) +
					 Math.abs(image.width * Math.sin(degToRad(angleInDegrees)));

	bufferCanvas.width = fullWidth;
	bufferCanvas.height = fullHeight;

	bufferContext.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
	bufferContext.rotate(angleInDegrees * Math.PI / 180);
	bufferContext.translate(-bufferCanvas.width / 2, -bufferCanvas.height / 2);
	bufferContext.drawImage(image,
		(bufferCanvas.width - image.width) / 2, (bufferCanvas.height - image.height) / 2,
		image.width, image.height);
	
	// draw filters
	if (selection != null) {
		var scaleRatio = image.width / scaledWidth;

		var startX = (selection.x - marginX) * scaleRatio,
			startY = (selection.y - marginY) * scaleRatio,
			width = selection.width * scaleRatio,
			height = selection.height * scaleRatio;

		drawBrightnessFilter(bufferContext, startX, startY, width, height);
		drawSaturationFilter(bufferContext, startX, startY, width, height);
		drawContrastFilter(bufferContext, startX, startY, width, height);
		drawExposureFilter(bufferContext, startX, startY, width, height);
		drawSepiaFilter(bufferContext, startX, startY, width, height);
	}
	
	return bufferCanvas;
}

/**
 * Crops the image to the selection
 */
function cropImage() {
	if (selection.width != 0 && selection.height != 0) {
		lastImage = image;
		var scaleRatio = image.width / scaledWidth;
		var rawStartX = Math.min(
			(selection.x - marginX) * scaleRatio,
			(selection.x + selection.width - marginX) * scaleRatio);
		var rawStartY = Math.min(
			(selection.y - marginY) * scaleRatio,
			(selection.y + selection.height - marginY) * scaleRatio);
		
		var bufferCanvas = document.createElement('canvas');
		var bufferContext = bufferCanvas.getContext('2d');
		bufferCanvas.width = Math.abs(selection.width) * scaleRatio;
		bufferCanvas.height = Math.abs(selection.height) * scaleRatio;

		bufferContext.drawImage(image,
			rawStartX, rawStartY, bufferCanvas.width, bufferCanvas.height, 0, 0, bufferCanvas.width, bufferCanvas.height);
		
		image = bufferCanvas;
		selection = null;
	}
}
