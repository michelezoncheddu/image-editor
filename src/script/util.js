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
	if (input.files && input.files[0]) {
		lastImage = image;
		image = new Image();
		image.onload = () => (resetEditor(), setScaledSize(), update());

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
	var imageData = bufferCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
	var download = $('#download-link')[0];
	download.href = imageData;
}

/**
 * Saves the full-resolution edited image and replaces it to the current image
 */
function saveImage() {
	var bufferCanvas = drawFullResolutionImage();
	lastImage = image;
	image = bufferCanvas;
}

/**
 * Resets the original state of the editor
 */
function resetEditor() {
	$('#zoomSlider').val(100);
	$('#zoomSlider').trigger('input');

	$('#rotateSlider').val(0);
	$('#rotateSlider').trigger('input');

	$('#brightnessSlider').val(0);
	$('#brightnessSlider').trigger('input');
	$('#saturationSlider').val(50);
	$('#saturationSlider').trigger('input');
	$('#contrastSlider').val(0);
	$('#contrastSlider').trigger('input');
	$('#exposureSlider').val(0);
	$('#exposureSlider').trigger('input');
	$('#sepiaSlider').val(0);
	$('#sepiaSlider').trigger('input');


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

/**
 * Opens the popup on click
 */
function showPopup() {
	$('#helpPopup')[0].classList.toggle('show');
}
