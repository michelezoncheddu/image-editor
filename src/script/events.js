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

			// CROP TEST
			if (currTool == 'crop' && selection.width != 0 && selection.height != 0) {
				var scaleRatio = scaledWidth / image.width;
				var rawStartX = Math.min(
					(selection.x - (canvas.width - scaledWidth) / 2) / scaleRatio,
					(selection.x + selection.width - (canvas.width - scaledWidth) / 2) / scaleRatio);
				var rawStartY = Math.min(
					(selection.y - (canvas.height - scaledHeight) / 2) / scaleRatio,
					(selection.y + selection.height - (canvas.height - scaledHeight) / 2) / scaleRatio);

				var bufferCanvas = document.createElement('canvas');
				var bufferContext = bufferCanvas.getContext('2d');
				bufferCanvas.width = Math.abs(selection.width) / scaleRatio;
				bufferCanvas.height = Math.abs(selection.height) / scaleRatio;

				bufferContext.drawImage(image,
					rawStartX, rawStartY, bufferCanvas.width, bufferCanvas.height, 0, 0, bufferCanvas.width, bufferCanvas.height);
				
				// @ts-ignore
				image = bufferCanvas;
				selection = null;
				setImageSize();

				// angleInDegrees = 0;
				// $('#rotateSlider').val(angleInDegrees);
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

	var x = (canvas.width - scaledWidth) / 2;
	var y = (canvas.height - scaledHeight) / 2;
	var bottomLeft = [x, scaledHeight + y];
	var topLeft = [x, y];
	var topRight = [scaledWidth + x, y];

	var pivot = [canvas.width / 2, canvas.height / 2];

	var angle = Math.abs(angleInDegrees) < 90 ? degToRad(angleInDegrees) : degToRad(180 - angleInDegrees);

	var bottomLeftRot = rotatePoint(pivot, bottomLeft, angle);
	var topLeftRot = rotatePoint(pivot, topLeft, angle);
	var topRightRot = rotatePoint(pivot, topRight, angle);

	var deltaX = Math.min(bottomLeftRot[0], topLeftRot[0]);
	var deltaY = Math.min(topLeftRot[1], topRightRot[1]);

	if (deltaX < deltaY) {
		scaledHeight += deltaX;
		scaledWidth += (deltaX) * ratio;
	} else {
		scaledHeight += deltaY;
		scaledWidth += (deltaY) * ratio;
	}


	// TO EXPORT

	// var fullWidth = Math.abs(scaledWidth * Math.sin(degToRad(90 - angleInDegrees))) +
	// 	Math.abs(scaledHeight * Math.sin(degToRad(angleInDegrees)));
	// var fullHeight = Math.abs(scaledHeight * Math.sin(degToRad(90 - angleInDegrees))) +
	// 	Math.abs(scaledWidth * Math.sin(degToRad(angleInDegrees)));
	// canvas.width = fullWidth;
	// canvas.height = fullHeight;

	// TEST
	// var w = canvas.width, h = canvas.height, alpha = degToRad(angleInDegrees);
	// var zoom = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) * 
	// 	Math.max(
	// 		(Math.abs(Math.cos(Math.atan(w / h) - alpha))) / h, 
	// 		(Math.abs(Math.cos(Math.atan(h / w) - alpha))) / w);

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
