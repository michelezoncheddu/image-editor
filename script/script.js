'use strict';

function run() {
	/** @type {HTMLCanvasElement} */
	// @ts-ignore
	const canvas = document.getElementById('editor');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	$('#main').css('width', canvas.width);
	var context = canvas.getContext('2d');

	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;
	
	context.fillStyle = '#262626'; // background color
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background

	var angleInDegrees = 0;
	var initialPos = {
		x: 0,
		y: 0
	}
	var currPos = {
		x: 0,
		y: 0
	}

	var mouseDown = false;
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mouseup', onMouseUp);
	document.addEventListener('mousemove', onMouseMove);

	function onMouseDown(evt) {
		if (!mouseDown) {
			currPos = getMousePos(canvas, evt);
			if (currPos.x >= 0 && currPos.x <= canvas.width && currPos.y >= 0 && currPos.y <= canvas.height) {
				initialPos.x = currPos.x;
				initialPos.y = currPos.y;
				mouseDown = true;
			}
		}
	}

	function onMouseUp(evt) {
		mouseDown = false;
		currPos = getMousePos(canvas, evt);
	}

	function onMouseMove(evt) {
		if (mouseDown)
			currPos = getMousePos(canvas, evt);
	}

	var image = new Image();
	image.src = 'img/test_2.jpg';

	$('#clockwise').click(function() {
		angleInDegrees += 0.1;
	})
	
	$('#counterclockwise').click(function() {
		angleInDegrees -= 0.1;
	})

	function draw() {
		drawRotated(canvas, image, angleInDegrees);

		if (mouseDown) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawRotated(canvas, image, angleInDegrees);

			// filler
			context.globalAlpha = 0.4;
			context.fillRect(initialPos.x, initialPos.y, currPos.x - initialPos.x, currPos.y - initialPos.y);
			context.globalAlpha = 1;

			// border
			context.strokeStyle = '#FFFFFF';
			context.lineWidth = 1.5;
			context.strokeRect(initialPos.x, initialPos.y, currPos.x - initialPos.x, currPos.y - initialPos.y);

			// lines
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(initialPos.x + ((currPos.x - initialPos.x) / 3), initialPos.y);
			context.lineTo(initialPos.x + ((currPos.x - initialPos.x) / 3), currPos.y);
			context.moveTo(initialPos.x + ((currPos.x - initialPos.x) * 2 / 3), initialPos.y);
			context.lineTo(initialPos.x + ((currPos.x - initialPos.x) * 2 / 3), currPos.y);
			context.moveTo(initialPos.x, initialPos.y + ((currPos.y - initialPos.y) / 3));
			context.lineTo(currPos.x, initialPos.y + ((currPos.y - initialPos.y) / 3));
			context.moveTo(initialPos.x, initialPos.y + ((currPos.y - initialPos.y) * 2 / 3));
			context.lineTo(currPos.x, initialPos.y + ((currPos.y - initialPos.y) * 2 / 3));
			context.stroke();
		} else {
			if (currPos.x == initialPos.x && currPos.y == initialPos.y) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				drawRotated(canvas, image, angleInDegrees);
			}
		}

		requestAnimationFrame(draw);
	}

	draw();
}
