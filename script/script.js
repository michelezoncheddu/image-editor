'use strict';

$(function() {
	var canvas = document.getElementById('editor');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	$('#main').css('width', canvas.width);
	var context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'High';
	context.mozImageSmoothingEnabled = true;
	context.webkitImageSmoothingEnabled = true;
	context.msImageSmoothingEnabled = true;
	context.imageSmoothingEnabled = true;

	var angleInDegrees = 0;

	var mouseDown = false;
	var mouseReleased = true;
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mousemove', onMouseMove, false);

	function onMouseDown(evt) {
		if (!mouseDown) {
			var pos = getMousePos(canvas, evt)
			if (pos.x >= 0 && pos.x <= canvas.width && pos.y >= 0 && pos.y <= canvas.height)
				mouseDown = true;
		}
	}

	function onMouseMove(evt) {
		if (mouseClicked) {
			var pos = getMousePos(canvas, evt)
			context.beginPath();
			context.arc(pos.x, pos.y, 7.5, 0, Math.PI * 2, false);
			context.lineWidth = 5;
			context.strokeStyle = '#fff';
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
})
