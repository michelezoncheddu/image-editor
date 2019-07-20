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
	let offset = $('#editor').offset();
	return {
		x: evt.pageX - offset.left,
		y: evt.pageY - offset.top
	  };
}

/**
 * Calculates the scaled image size to fit in the canvas
 */
function setScaledSize() {
	image.ratio = image.width / image.height;
	if (image.width <= canvas.width && image.height <= canvas.height) {
		image.scaled = false
		scaledWidth = image.width;
		scaledHeight = image.height;
	} else {
		image.scaled = true;
		scaledWidth = canvas.width;
		scaledHeight = scaledWidth / image.ratio;
		if (scaledHeight > canvas.height) {
			scaledHeight = canvas.height;
			scaledWidth = scaledHeight * image.ratio;
		}
	}
	margin = {
		x: (canvas.width - scaledWidth) / 2,
		y: (canvas.height - scaledHeight) / 2
	};
}

/**
 * Uploads the new photo to edit
 */
function loadFile(input) {
	if (input.files && input.files[0]) {
		lastImage = image;
		image = new Image();
		image.onload = () => (resetEditor(), setScaledSize(), update());

		let reader = new FileReader();
		reader.onload = function(e) {
			image.src = e.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	}
}

/**
 * Downloads the full-resolution edited image
 */
function downloadImage(canvas) {
	let bufferCanvas = canvas == null ? drawFullResolutionImage() : canvas;
	let imageData = bufferCanvas.toDataURL('image/png');
	$('#download-link')[0].href = imageData;
}

/**
 * Saves the full-resolution edited image and replaces it to the current image
 */
function saveImage() {
	let bufferCanvas = drawFullResolutionImage();
	lastImage = image;
	image = bufferCanvas;
	return bufferCanvas;
}

/**
 * Resets the original state of the editor
 */
function resetEditor() {
	$('#zoom-slider').val(100);
	$('#zoom-slider').trigger('input');

	$('#rotate-slider').val(0);
	$('#rotate-slider').trigger('input');

	$('#brightness-slider').val(0);
	$('#brightness-slider').trigger('input');
	$('#saturation-slider').val(0);
	$('#saturation-slider').trigger('input');
	$('#contrast-slider').val(0);
	$('#contrast-slider').trigger('input');
	$('#exposure-slider').val(0);
	$('#exposure-slider').trigger('input');
	$('#sepia-slider').val(0);
	$('#sepia-slider').trigger('input');


	selection = null;
	deltaStart = {
		x: 0,
		y: 0
	};
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

