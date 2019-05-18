'use strict';

function onMouseDown(evt) {
	if (!inside)
		return;

	mouseDown = true;
	currPos = getMousePos(evt);

	if (currTool == 'pencil') {
		context.beginPath();
		context.moveTo(currPos.x, currPos.y);
	}

	if (selection != null) {
		if (selection.contains(currPos)) {
			selection.dragged = true;
			selection.deltaX = currPos.x - selection.x;
			selection.deltaY = currPos.y - selection.y;
		}
		else {
			selection = null;
		}
	} else {
		selection = new Rectangle(currPos.x, currPos.y, 0, 0);
	}

	update();
}

function onTouchStart(evt) {
	var touches = evt.changedTouches;
	selection = new Rectangle(touches[0].pageX, touches[0].pageY, 0, 0);
}

function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		if (selection != null) {
			if (selection.dragged) {
				selection.x = currPos.x - selection.deltaX;
				selection.y = currPos.y - selection.deltaY;
			} else {
				selection.width = currPos.x - selection.x;
				selection.height = currPos.y - selection.y;
			}
		}
		update();
	}
}

function onMouseUp(evt) {
	mouseDown = false;
	if (!inside)
		return;

	if (selection != null) {
		if (selection.dragged)
			selection.dragged = false;
		else {
			selection = new Rectangle(
				Math.min(selection.x, currPos.x),
				Math.min(selection.y, currPos.y),
				Math.abs(selection.x - currPos.x),
				Math.abs(selection.y - currPos.y));
		}
		return; // no update
	}
	update();
}

function onRotateChange() {
	// @ts-ignore
	angleInDegrees = this.value;
	document.getElementById('degrees').innerHTML = angleInDegrees.toString() + '°';
	update();
}

function onBrightnessChange() {
	// @ts-ignore
	brightness = this.value;
	document.getElementById('brightness').innerHTML = (brightness - (100 - brightness)).toString();
	update();
}

function onSaturationChange() {
	// @ts-ignore
	saturation = this.value;
	document.getElementById('saturation').innerHTML = (saturation - (100 - saturation)).toString();
	update();
}
