'use strict';

function run() {
	/** @type {HTMLCanvasElement} */
	// @ts-ignore
	const canvas = document.getElementById('editor');
	canvas.height = window.innerHeight * 0.7;
	canvas.width = window.innerWidth * 0.7;
	$('#main').css('width', canvas.width);
	var context = canvas.getContext('2d');

	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;
	
	context.fillStyle = "#262626"; // background color
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background

	var angleInDegrees = 0;

	var mouseDown = false;
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mouseup', onMouseUp, false);
	document.addEventListener('mousemove', onMouseMove, false);

	function onMouseDown(evt) {
		if (!mouseDown) {
			var pos = getMousePos(canvas, evt)
			if (pos.x >= 0 && pos.x <= canvas.width && pos.y >= 0 && pos.y <= canvas.height)
				mouseDown = true;
		}
	}

	function onMouseUp(evt) {
		mouseDown = false;
	}

	function onMouseMove(evt) {
		if (mouseDown) {
			var pos = getMousePos(canvas, evt)
			context.beginPath();
			context.arc(pos.x, pos.y, 7.5, 0, Math.PI * 2, false);
			context.lineWidth = 5;
			context.strokeStyle = '#FFFFFF';
			context.stroke();
		}
	}

	var image = new Image();
	image.onload = function() {
		drawImage(canvas, image);
	}
	image.src = 'img/test_2.jpg';

	$('#clockwise').click(function() {
		angleInDegrees += 0.1;
		drawRotated(canvas, image, angleInDegrees);
	})
	
	$('#counterclockwise').click(function() {
		angleInDegrees -= 0.1;
		drawRotated(canvas, image, angleInDegrees);
	})
}
