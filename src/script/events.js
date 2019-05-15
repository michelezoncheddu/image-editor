'use strict';

function onMouseDown(evt) {
	if (inside) {
		currPos = getMousePos(evt);

		mouseDown = true;

		if (currTool == 'pencil') {
			context.beginPath();
			context.moveTo(currPos.x, currPos.y);
		}

		if (selection != null) {
			if (currPos.x >= selection.startX && currPos.x <= selection.endX && currPos.y >= selection.startY && currPos.y <= selection.endY)
				alert('inside');
			else
				selection = null;
		} else {
			selection = {
				startX: currPos.x,
				startY: currPos.y
			};
		}

		update();
	}
}

function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		if (selection != null) {
			selection.endX = currPos.x;
			selection.endY = currPos.y;
		}
		update();
	}
}

function onMouseUp(evt) {
	mouseDown = false;
	if (inside && selection != null) {
		selection.endX = currPos.x;
		selection.endY = currPos.y;
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
