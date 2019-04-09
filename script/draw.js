"use strict";

function drawRotated(canvas, image, degrees) {
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.save();
	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(degrees * Math.PI / 180);
	context.translate(-canvas.width / 2, -canvas.height / 2);
	
	drawImage(canvas, image);

	context.restore();
}

function drawImage(canvas, image) {
	var context = canvas.getContext("2d");

	var ratio = image.width / image.height;
	var width = canvas.width;
	var height = width / ratio;
	if (height > canvas.height) {
		height = canvas.height;
		width = height * ratio;
	}

	context.drawImage(image, 0, 0, width, height);
}
