'use strict';

function onMouseDown(evt) {
	currPos = getMousePos(evt);
	if (inside) {
		clickPos.x = currPos.x;
		clickPos.y = currPos.y;
		mouseDown = true;
		update();
	}
}

function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		update();
	}
}

function onMouseUp(evt) {
	mouseDown = false;
	if (inside)
		releasePos = getMousePos(evt);
	update();
}

function onRotate() {
	// @ts-ignore
	angleInDegrees = this.value;
	document.getElementById('degrees').innerHTML = angleInDegrees.toString() + '°';
	update();
}

function onBrightness() {
	// @ts-ignore
	brightness = this.value;
	document.getElementById('brightness').innerHTML = (brightness - (100 - brightness)).toString();
	update();
}

function onSaturation() {
	// @ts-ignore
	saturation = this.value;
	document.getElementById('saturation').innerHTML = (saturation - (100 - saturation)).toString();
	update();
}

