'use strict';

/**
 * Handles the mouse down event
 */
function onMouseDown(evt) {
	if (!canvas.inside) // click outside the canvas
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
			if (currPos.x.between(margin.x, margin.x + scaledWidth) && currPos.y.between(margin.y, margin.y + scaledHeight))
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
			update();
		} else if (selection != null) {
			if (selection.dragged) { // moving selection
				selection.x = currPos.x - selection.deltaX;
				selection.y = currPos.y - selection.deltaY;

				// start of selection (X axis) out of the image
				if (selection.x < margin.x)
					selection.x = margin.x;
				else if (selection.x > margin.x + scaledWidth)
					selection.x = margin.x + scaledWidth;

				// end of selection (X asis) out of the image
				if (selection.width > 0 && selection.x + selection.width > margin.x + scaledWidth)
					selection.x = margin.x + scaledWidth - selection.width;
				else if (selection.width < 0 && selection.x + selection.width < margin.x)
					selection.x = margin.x - selection.width;

				// start of selection (Y axis) out of the image
				if (selection.y < margin.y)
					selection.y = margin.y;
				else if (selection.y > margin.y + scaledHeight)
					selection.y = margin.y + scaledHeight;
				
				// end of selection (Y asis) out of the image
				if (selection.height > 0 && selection.y + selection.height > margin.y + scaledHeight)
					selection.y = margin.y + scaledHeight - selection.height;
				else if (selection.height < 0 && selection.y + selection.height < margin.y)
					selection.y = margin.y - selection.height;

			} else { // creating selection
				let width = currPos.x - selection.x,
					height = currPos.y - selection.y;

				// check if selection end is going out of the image
				selection.width = width > 0 ?
					Math.min(width, margin.x + scaledWidth - selection.x) :
					Math.max(width, margin.x - selection.x);
				selection.height = height > 0 ?
					Math.min(height, margin.y + scaledHeight - selection.y) :
					Math.max(height, margin.y - selection.y);
			}
			update();
		}
	}
}

/**
 * Handles the mouse up event
 */
function onMouseUp() {
	if (selection != null && selection.dragged)
		selection.dragged = false;
	if (mouseDown)
		update();
	mouseDown = false;
}

/**
 * TEST: touch support
 */
function onTouchStart(evt) {
	evt.preventDefault();
	let touches = evt.changedTouches;
	selection = new Rectangle(touches[0].pageX, touches[0].pageY, 0, 0);
}
