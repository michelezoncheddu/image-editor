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
		reader.onloadend = function(e) {
			// @ts-ignore
			image.src = e.target.result;
			update();
		};
		// alternative: onload() { image.src... image.onloadend => update() }
		reader.readAsDataURL(input.files[0]);
	}
}

function onResize() {
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	update();
}

function update() {
	requestAnimationFrame(draw);
}
