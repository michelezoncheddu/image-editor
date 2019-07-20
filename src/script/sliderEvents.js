'use strict';

/**
 * Changes the slider background to follow the thumb
 */
function onSliderChange(evt) {
	let min = evt.target.min, max = evt.target.max, val = evt.target.value;
	$(evt.target).css('background-size', (val - min) * 100 / (max - min) + '% 100%');
}

/**
 * Handles the zoom change event
 */
function onZoomChange() {
	zoom = this.value / 100;
	$('#zoom-value').html(this.value + '%');
	update();
}

/**
 * Handles the rotate change event, resizing the image if needed
 */
function onRotateChange() {
	angleInDegrees = this.value;
	$('#degrees-value').html(angleInDegrees.toString() + '°');

	// coordinates of 3 vertices to detect the overhang, and the pivot to rotate around the center
	let topLeft = {
		x: (canvas.width - scaledWidth) / 2,
		y: (canvas.height - scaledHeight) / 2
	},
	bottomLeft = {
		x: topLeft.x,
		y: scaledHeight + topLeft.y
	},
	topRight = {
		x: scaledWidth + topLeft.x,
		y: topLeft.y
	},
	pivot = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};

	let angle = Math.abs(angleInDegrees) < 90 ? degToRad(angleInDegrees) : degToRad(180 - angleInDegrees);

	let bottomLeftRot = rotatePoint(pivot, bottomLeft, angle),
		topLeftRot = rotatePoint(pivot, topLeft, angle),
		topRightRot = rotatePoint(pivot, topRight, angle);

	// saves the further vertex in x and y axis
	let deltaX = Math.min(bottomLeftRot.x, topLeftRot.x),
		deltaY = Math.min(topLeftRot.y, topRightRot.y);

	/** 
	 * Change the scaled resolution if:
	 * - the full res image is bigger than the canvas (scaled == true) OR
	 * - the full res image is smaller than the canvas but:
	 *   - the rotated image is overhanging the canvas (delta < 0) and needs to be scaled down OR
	 *   - the rotated image needs to scale up to the original size (delta > 0), but not bigger
	 */
	if (image.scaled || (deltaY < 0 || deltaX < 0 || scaledHeight + deltaY <= image.height || scaledWidth + deltaX <= image.width)) {
		if (deltaX < deltaY) {
			scaledHeight += deltaX;
			scaledWidth += (deltaX) * image.ratio;
		} else {
			scaledHeight += deltaY;
			scaledWidth += (deltaY) * image.ratio;
		}
	}

	update();
}

/**
 * Handles the brightness change event
 */
function onBrightnessChange() {
	brightness = this.value;
	$('#britghtness-value').html(brightness);
	update();
}

/**
 * Handles the saturation change event
 */
function onSaturationChange() {
	saturation = this.value;
	$('#saturation-value').html(saturation);
	update();
}

/**
 * Handles the contrast change event
 */
function onContrastChange() {
	contrast = this.value;
	$('#contrast-value').html(contrast);
	update();
}

/**
 * Handles the exposure change event
 */
function onExposureChange() {
	exposure = this.value;
	$('#exposure-value').html(exposure / 100);
	update();
}

/**
 * Handles the sepia change event
 */
function onSepiaChange() {
	sepia = this.value / 100;
	$('#sepia-value').html(this.value);
	update();
}
