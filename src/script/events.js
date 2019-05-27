'use strict';

function onMouseDown(evt) {
	if (!inside)
		return;

	mouseDown = true;
	currPos = getMousePos(evt);

	if (currTool == 'pencil')
		context.beginPath();

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

function onMouseUp() {
	mouseDown = false;
	if (!inside)
		return;

	if (selection != null) {
		if (selection.dragged)
			selection.dragged = false;
		else {
			selection = new Rectangle(selection.x, selection.y, currPos.x - selection.x, currPos.y - selection.y);

			if (currTool == 'crop' && selection.width != 0 && selection.height != 0) {
				var ratio = scaledWidth / image.width;
				var rawStartX = Math.min(
					(selection.x - (canvas.width - scaledWidth) / 2) / ratio,
					(selection.x + selection.width - (canvas.width - scaledWidth) / 2) / ratio);
				var rawStartY = Math.min(
					(selection.y - (canvas.height - scaledHeight) / 2) / ratio,
					(selection.y + selection.height - (canvas.height - scaledHeight) / 2) / ratio);

				var bufferCanvas = document.createElement('canvas');
				var bufferContext = bufferCanvas.getContext('2d');
				bufferCanvas.width = Math.abs(selection.width) / ratio;
				bufferCanvas.height = Math.abs(selection.height) / ratio;

				bufferContext.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
				bufferContext.rotate(angleInDegrees * Math.PI / 180);
				bufferContext.translate(-bufferCanvas.width / 2, -bufferCanvas.height / 2);
				bufferContext.drawImage(image,
					rawStartX, rawStartY, bufferCanvas.width, bufferCanvas.height, 0, 0, bufferCanvas.width, bufferCanvas.height);
				
				// @ts-ignore
				image = bufferCanvas;
				selection = null;
				setImageSize();

				angleInDegrees = 0;
				$('#rotateSlider').val(angleInDegrees);
			}
		}
	}
	update();
}

function onZoomChange() {
	// @ts-ignore
	zoom = this.value / 100;
	document.getElementById('zoomValue').innerHTML = this.value + '%';
	update();
}

function onRotateChange() {
	// @ts-ignore
	angleInDegrees = this.value;
	document.getElementById('degreesValue').innerHTML = angleInDegrees.toString() + '°';
	update();
}

function onBrightnessChange() {
	// @ts-ignore
	brightness = this.value;
	document.getElementById('brightnessValue').innerHTML = (brightness - (100 - brightness)).toString();
	update();
}

function onSaturationChange() {
	// @ts-ignore
	saturation = this.value;
	document.getElementById('saturationValue').innerHTML = (saturation - (100 - saturation)).toString();
	update();
}
