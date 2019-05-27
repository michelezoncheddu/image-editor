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
	if (image.width <= canvas.width && image.height <= canvas.height) {
		scaledWidth = image.width;
		scaledHeight = image.height;
	} else {
		var ratio = image.width / image.height;
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
	bufferCanvas.width = image.width;
	bufferCanvas.height = image.height;

	bufferContext.translate(bufferCanvas.width / 2, bufferCanvas.height / 2);
	bufferContext.rotate(angleInDegrees * Math.PI / 180);
	bufferContext.translate(-bufferCanvas.width / 2, -bufferCanvas.height / 2);
	bufferContext.drawImage(image, 0, 0, image.width, image.height);
	
	var imageData = bufferCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	var download = document.getElementById("download-link");
	// @ts-ignore
	download.href = imageData;
}

// @ts-ignore
Number.prototype.between = function(a, b) {
	return this >= Math.min(a, b) && this <= Math.max(a, b);
};
