'use strict';

/**
 * Handles the mouse down event
 */
function onMouseDown(evt) {
	if (!inside || (currTool != 'crop' && currTool != 'levels')) // click outside the canvas or selection disabled
		return;

	mouseDown = true;
	currPos = getMousePos(evt);

	if (selection != null) {
		if (selection.contains(currPos)) { // dragging selection
			selection.dragged = true;
			selection.deltaX = currPos.x - selection.x;
			selection.deltaY = currPos.y - selection.y;
		} else { // selection deselected
			selection = null;
		}
	} else { // new selection
		// selection can start only inside the image
		if (currPos.x.between(marginX, marginX + scaledWidth) && currPos.y.between(marginY, marginY + scaledHeight))
			selection = new Rectangle(currPos.x, currPos.y, 0, 0);
	}

	update();
}

/**
 * Handles the mouse move event
 */
function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		if (selection != null) {
			if (selection.dragged) { // moving selection
				selection.x = currPos.x - selection.deltaX;
				selection.y = currPos.y - selection.deltaY;

				// start of selection (X axis) out of the image
				if (selection.x < marginX)
					selection.x = marginX;
				else if (selection.x > marginX + scaledWidth)
					selection.x = marginX + scaledWidth;

				// end of selection (X asis) out of the image
				if (selection.width > 0 && selection.x + selection.width > marginX + scaledWidth)
					selection.x = marginX + scaledWidth - selection.width;
				else if (selection.width < 0 && selection.x + selection.width < marginX)
					selection.x = marginX - selection.width;

				// start of selection (Y axis) out of the image
				if (selection.y < marginY)
					selection.y = marginY;
				else if (selection.y > marginY + scaledHeight)
					selection.y = marginY + scaledHeight;
				
				// end of selection (Y asis) out of the image
				if (selection.height > 0 && selection.y + selection.height > marginY + scaledHeight)
					selection.y = marginY + scaledHeight - selection.height;
				else if (selection.height < 0 && selection.y + selection.height < marginY)
					selection.y = marginY - selection.height;

			} else { // creating selection
				var width = currPos.x - selection.x;
				var height = currPos.y - selection.y;

				// check if selection end is going out of the image
				selection.width = width > 0 ?
					Math.min(width, marginX + scaledWidth - selection.x) :
					Math.max(width, marginX - selection.x);
				selection.height = height > 0 ?
					Math.min(height, marginY + scaledHeight - selection.y) :
					Math.max(height, marginY - selection.y);
			}
		}
		update();
	}
}

/**
 * Handles the mouse up event
 */
function onMouseUp() {
	mouseDown = false;
	if (selection != null && selection.dragged)
		selection.dragged = false;
	update();
}

/**
 * TEST: touch support
 */
function onTouchStart(evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	selection = new Rectangle(touches[0].pageX, touches[0].pageY, 0, 0);
}

/**
 * Handles the zoom change event
 */
function onZoomChange() {
	zoom = this.value / 100;
	$('#zoomValue').html(this.value + '%');
	update();
}

/**
 * Handles the rotate change event
 */
function onRotateChange() {
	angleInDegrees = this.value;
	$('#degreesValue').html(angleInDegrees.toString() + '°');

	// coordinates of 3 vertices to detect the overhang, and the pivot to rotate around the center
	var topLeft = {
		x: marginX,
		y: marginY
	};
	var bottomLeft = {
		x: topLeft.x,
		y: scaledHeight + topLeft.y
	};
	var topRight = {
		x: scaledWidth + topLeft.x,
		y: topLeft.y
	};
	var pivot = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};

	var angle = Math.abs(angleInDegrees) < 90 ? degToRad(angleInDegrees) : degToRad(180 - angleInDegrees);

	var bottomLeftRot = rotatePoint(pivot, bottomLeft, angle);
	var topLeftRot = rotatePoint(pivot, topLeft, angle);
	var topRightRot = rotatePoint(pivot, topRight, angle);

	// saves the further vertex in x and y axis
	var deltaX = Math.min(bottomLeftRot.x, topLeftRot.x);
	var deltaY = Math.min(topLeftRot.y, topRightRot.y);

	/** 
	 * Change the scaled resolution if:
	 * - the full res image is bigger than the canvas (scaled == true) OR
	 * - the full res image is smaller than the canvas but:
	 *   - the rotated image is overhanging the canvas (delta < 0) and needs to be scaled down OR
	 *   - the rotated image needs to scale up to the original size (delta > 0), but not bigger
	 */
	if (scaled || (deltaY < 0 || deltaX < 0 || scaledHeight + deltaY <= image.height || scaledWidth + deltaX <= image.width)) {
		if (deltaX < deltaY) {
			scaledHeight += deltaX;
			scaledWidth += (deltaX) * ratio;
		} else {
			scaledHeight += deltaY;
			scaledWidth += (deltaY) * ratio;
		}
	}

	update();
}

/**
 * Handles the brightness change event
 */
function onBrightnessChange() {
	brightness = this.value;
	$('#brightnessValue').html(brightness);
	update();
}

/**
 * Handles the saturation change event
 */
function onSaturationChange() {
	saturation = this.value;
	$('#saturationValue').html((saturation - (100 - saturation)).toString());
	update();
}

/**
 * Detects the key pressing
 */
function onKeyDown(evt) {
	if (evt.ctrlKey) {
		switch(evt.keyCode) {
		case 65: // ctrl-a
			evt.preventDefault();
			selection = new Rectangle(marginX, marginY, scaledWidth, scaledHeight);
			update();
			break;

		case 90: // ctrl-z
		evt.preventDefault();
			image = lastImage;
			setScaledSize();
			update();
			break;
		}
	} else if (evt.keyCode == 13 && currTool == 'crop' && selection != null) { // enter
		evt.preventDefault();
		cropImage();
		update();
	}
}

/**
 * Changes the slider background to follow the thumb
 */
function onSliderChange(evt) {
	var min = evt.target.min, max = evt.target.max, val = evt.target.value;
	$(evt.target).css('background-size', (val - min) * 100 / (max - min) + '% 100%');
}

/**
 * Changes the canvas size
 */
function onResize() {
	canvas.height = window.innerHeight * 0.7;
	canvas.width = window.innerWidth * 0.7;
	setScaledSize();
	update();
}
