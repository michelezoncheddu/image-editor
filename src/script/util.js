'use strict';

function update() {
	requestAnimationFrame(draw);
}

function getMousePos(evt) {
	return {
		x: evt.clientX - canvasBorder.left,
		y: evt.clientY - canvasBorder.top
	};
}

function setImageSize() {
	ratio = image.width / image.height;
	if (image.width <= canvas.width && image.height <= canvas.height) {
		resized = false;
		scaledWidth = image.width;
		scaledHeight = image.height;
	} else {
		resized = true;
		scaledWidth = canvas.width;
		scaledHeight = scaledWidth / ratio;
		if (scaledHeight > canvas.height) {
			scaledHeight = canvas.height;
			scaledWidth = scaledHeight * ratio;
		}
	}
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			// @ts-ignore
			image.src = e.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	}
}

function downloadImage() {
	var bufferCanvas = document.createElement('canvas');
	var bufferContext = bufferCanvas.getContext('2d');

	var fullWidth = Math.abs(image.width * Math.sin(degToRad(90 - angleInDegrees))) +
		Math.abs(image.height * Math.sin(degToRad(angleInDegrees)));
	var fullHeight = Math.abs(image.height * Math.sin(degToRad(90 - angleInDegrees))) +
		Math.abs(image.width * Math.sin(degToRad(angleInDegrees)));

	bufferCanvas.width = fullWidth;
	bufferCanvas.height = fullHeight;

	// TODO: zoom
	bufferContext.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
	bufferContext.rotate(angleInDegrees * Math.PI / 180);
	bufferContext.translate(-bufferCanvas.width / 2, -bufferCanvas.height / 2);
	bufferContext.drawImage(image,
		(bufferCanvas.width - image.width) / 2, (bufferCanvas.height - image.height) / 2,
		image.width, image.height);
	
	var imageData = bufferCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	var download = document.getElementById("download-link");
	// @ts-ignore
	download.href = imageData;
}

// @ts-ignore
Number.prototype.between = function(a, b) {
	return this >= Math.min(a, b) && this <= Math.max(a, b);
};

function rotatePoint(pivot, point, angle) {
	// Rotate clockwise, angle in radians
	var x = Math.round((Math.cos(angle) * (point[0] - pivot[0])) -
					   (Math.sin(angle) * (point[1] - pivot[1])) +
					   pivot[0]),
		y = Math.round((Math.sin(angle) * (point[0] - pivot[0])) +
					   (Math.cos(angle) * (point[1] - pivot[1])) +
					   pivot[1]);
	return [x, y];
};

function degToRad(deg) {
	return deg * Math.PI / 180;
}
