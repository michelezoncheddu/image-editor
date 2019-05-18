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
	var ratio = image.width / image.height;
	scaledWidth = canvas.width;
	scaledHeight = scaledWidth / ratio;
	if (scaledHeight > canvas.height) {
		scaledHeight = canvas.height;
		scaledWidth = scaledHeight * ratio;
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

class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dragged = false;
	}

	contains(point) {
		return point.x >= this.x && point.x <= this.x + this.width &&
			   point.y >= this.y && point.y <= this.y + this.height;
	}
}
