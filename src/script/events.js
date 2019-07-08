'use strict';

/**
 * Handles the mouse down event
 */
function onMouseDown(evt) {
	evt.preventDefault();
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
		var marginX = canvas.width - scaledWidth;
		var marginY = canvas.height - scaledHeight;

		// selection can start only inside the image
		if (currPos.x.between(marginX / 2, marginX / 2 + scaledWidth) && currPos.y.between(marginY / 2, marginY / 2 + scaledHeight))
			selection = new Rectangle(currPos.x, currPos.y, 0, 0);
	}

	update();
}

/**
 * Handles the mouse move event
 */
function onMouseMove(evt) {
	evt.preventDefault();
	if (mouseDown) {
		currPos = getMousePos(evt);
		if (selection != null) {
			var marginX = canvas.width - scaledWidth;
			var marginY = canvas.height - scaledHeight;

			if (selection.dragged) { // moving selection
				selection.x = currPos.x - selection.deltaX;
				selection.y = currPos.y - selection.deltaY;
				
				selection.width = selection.width > 0 ?
					Math.min(selection.width, - (selection.x - (marginX / 2 + scaledWidth))) :
					Math.max(selection.width, - (selection.x - (marginX / 2)));

				if (selection.x < marginX / 2)
					selection.x = marginX / 2;
				else if (selection.x > marginX / 2 + scaledWidth)
					selection.x = marginX / 2 + scaledWidth;
				
				selection.height = selection.height > 0 ?
					Math.min(selection.height, - (selection.y - (marginY / 2 + scaledHeight))) :
					Math.max(selection.height, - (selection.y - (marginY / 2)));

				if (selection.y < marginY / 2)
					selection.y = marginY / 2;
				else if (selection.y > marginY / 2 + scaledHeight)
					selection.y = marginY / 2 + scaledHeight;
			} else { // creating selection
				var width = currPos.x - selection.x;
				var height = currPos.y - selection.y;
				selection.width = width > 0 ?
					Math.min(width, marginX / 2 + scaledWidth - selection.x) :
					Math.max(width, marginX / 2 - selection.x);
				selection.height = height > 0 ?
					Math.min(height, marginY / 2 + scaledHeight - selection.y) :
					Math.max(height, marginY / 2 - selection.y);
			}
		}
		update();
	}
}

/**
 * Handles the mouse up event
 */
function onMouseUp() {
	evt.preventDefault();
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
		x: (canvas.width - scaledWidth) / 2,
		y: (canvas.height - scaledHeight) / 2
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
	evt.preventDefault();
	if (evt.ctrlKey) {
		switch(evt.keyCode) {
		case 65: // ctrl-a
			var marginX = canvas.width - scaledWidth;
			var marginY = canvas.height - scaledHeight;
			selection = new Rectangle(marginX / 2, marginY / 2, scaledWidth, scaledHeight);
			update();
			break;

		case 90: // ctrl-z
			image = lastImage;
			setScaledSize();
			update();
			break;
		}
	} else if (evt.keyCode == 13 && currTool == 'crop' && selection != null) { // enter
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
