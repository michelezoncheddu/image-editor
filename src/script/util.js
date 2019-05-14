'use strict';

function update() {
	requestAnimationFrame(draw);
}

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
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

function onResize() {
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	update();
}
