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
	var download = document.getElementById("download-link");
	var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	// @ts-ignore
	download.href = image;
}

// @ts-ignore
Number.prototype.between = function(a, b) {
	return this >= Math.min(a, b) && this <= Math.max(a, b);
};
