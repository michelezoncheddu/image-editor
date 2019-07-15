'use strict';

/**
 * Draws the whole canvas
 */
function update() {
	requestAnimationFrame(draw);
}

/**
 * Returns the mouse position relative to the canvas
 */
function getMousePos(evt) {
	var offset = $('#editor').offset();
	return {
		x: evt.pageX - offset.left,
		y: evt.pageY - offset.top
	  };
}

/**
 * Calculates the scaled image size to fit in the canvas
 */
function setScaledSize() {
	ratio = image.width / image.height;
	if (image.width <= canvas.width && image.height <= canvas.height) {
		scaled = false;
		scaledWidth = image.width;
		scaledHeight = image.height;
	} else {
		scaled = true;
		scaledWidth = canvas.width;
		scaledHeight = scaledWidth / ratio;
		if (scaledHeight > canvas.height) {
			scaledHeight = canvas.height;
			scaledWidth = scaledHeight * ratio;
		}
	}
	marginX = (canvas.width - scaledWidth) / 2;
	marginY = (canvas.height - scaledHeight) / 2;
}

/**
 * Uploads the new photo to edit
 */
function loadFile(input) {
	if (input.files && input.files[0]) { // TODO: check if input is an image file
		selection = null;
		lastImage = image;
		image = new Image();
		image.onload = () => (setScaledSize(), update());

		var reader = new FileReader();
		reader.onload = function(e) {
			image.src = e.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	}
}

/**
 * Downloads the full-resolution edited image
 */
function downloadImage() {
	var bufferCanvas = drawFullResolutionImage();
	
	// TEST: filters
	if (selection != null) {
		var bufferContext = bufferCanvas.getContext('2d');
		var scaleRatio = image.width / scaledWidth;
		bufferContext.globalCompositeOperation = 'saturation';
		bufferContext.globalAlpha = Math.abs(saturation - (100 - saturation)) / 100;
		bufferContext.fillStyle = 'hsl(0, ' + saturation + '%, 50%)';
		// draw filter layer
		bufferContext.fillRect((selection.x - marginX) * scaleRatio, (selection.y - marginY) * scaleRatio,
			selection.width * scaleRatio, selection.height * scaleRatio);
	}

	var imageData = bufferCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	var download = $("#download-link")[0];
	download.href = imageData;
}

/**
 * Saves the full-resolution edited image and replaces it to the current image
 */
function saveImage() {
	var bufferCanvas = drawFullResolutionImage();

	lastImage = image;
	image = bufferCanvas;
	setScaledSize();
}

/**
 * Draws the full resolution image and returns the canvas
 */
function drawFullResolutionImage() {
	var bufferCanvas = document.createElement('canvas');
	var bufferContext = bufferCanvas.getContext('2d');

	var fullWidth = Math.abs(image.width * Math.sin(degToRad(90 - angleInDegrees))) +
		Math.abs(image.height * Math.sin(degToRad(angleInDegrees)));
	var fullHeight = Math.abs(image.height * Math.sin(degToRad(90 - angleInDegrees))) +
		Math.abs(image.width * Math.sin(degToRad(angleInDegrees)));

	bufferCanvas.width = fullWidth;
	bufferCanvas.height = fullHeight;

	bufferContext.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
	bufferContext.rotate(angleInDegrees * Math.PI / 180);
	bufferContext.translate(-bufferCanvas.width / 2, -bufferCanvas.height / 2);
	bufferContext.drawImage(image,
		(bufferCanvas.width - image.width) / 2, (bufferCanvas.height - image.height) / 2,
		image.width, image.height);
	
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
		setScaledSize();
	}
}

/**
 * Returns the coordinates of a point rotated clockwise around a pivot
 */
function rotatePoint(pivot, point, angle) {
	return {
		x: (Math.cos(angle) * (point.x - pivot.x)) - (Math.sin(angle) * (point.y - pivot.y)) + pivot.x,
		y: (Math.sin(angle) * (point.x - pivot.x)) + (Math.cos(angle) * (point.y - pivot.y)) + pivot.y
	};
}

/**
 * Converts a degrees angle to radians
 */
function degToRad(deg) {
	return deg * Math.PI / 180;
}

/**
 * Checks if a number is in the range [a, b]
 */
Number.prototype.between = function(a, b) {
	return this >= Math.min(a, b) && this <= Math.max(a, b);
}

/**
 * Opens the popup on click
 */
function showPopup() {
	$("#helpPopup")[0].classList.toggle("show");
}
