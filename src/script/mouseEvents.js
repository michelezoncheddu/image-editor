'use strict';

/**
 * Handles the mouse down event
 */
function onMouseDown(evt) {
	if (!inside) // click outside the canvas
		return;

	mouseDown = true;
	currPos = getMousePos(evt);

	if (currTool == 'zoom') {
		deltaClick = {
			x: currPos.x - deltaStart.x,
			y: currPos.y - deltaStart.y
		};
	} else if (currTool == 'crop' || currTool == 'filters') {
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
	}

	update();
}

/**
 * Handles the mouse move event
 */
function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		if (currTool == 'zoom') {
			deltaStart = {
				x: currPos.x - deltaClick.x,
				y: currPos.y - deltaClick.y
			};
		} else if (selection != null) {
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
