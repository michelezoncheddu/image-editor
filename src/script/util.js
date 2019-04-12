'use strict';

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			// @ts-ignore
			image.src = e.target.result;
			requestAnimationFrame(draw);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

function onResize() {
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	requestAnimationFrame(draw);
}
