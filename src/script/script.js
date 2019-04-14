'use strict';

/** @type {HTMLCanvasElement} */
var canvas;
var image = new Image();
var context;

var angleInDegrees = 0;
var initPos = {
	x: 0,
	y: 0
}
var currPos = {
	x: 0,
	y: 0
}
var mouseDown = false;

var currTool = 'none';

function init() {
	// @ts-ignore
	canvas = document.getElementById('image');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	$('#tools').css('top', canvas.height + (canvas.height / 20));

	context = canvas.getContext('2d');

	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	context.fillStyle = '#262626'; // background color
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background

	image.src = 'test_images/test_2.jpg';

	window.addEventListener('resize', onResize);
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mouseup', onMouseUp);
	document.addEventListener('mousemove', onMouseMove);

	$('.icon').click(function() {
		if ($(this).prop('id') == 'upload') { // TODO: good string check?
			requestAnimationFrame(draw); // TODO: needed?
			return;
		}

		// deselecting tool
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			currTool = 'none';
			requestAnimationFrame(draw);
			return;
		}

		var icon = document.getElementsByClassName('icon');
		for (var i = 0; i < icon.length; i++) {
			if (icon[i].classList.contains('active')) {
				icon[i].classList.remove('active');
				break;
			}
		}
		
		$(this).addClass('active');
		currTool = $(this).attr('id');
		requestAnimationFrame(draw);
	})

	requestAnimationFrame(draw);
}

function onMouseDown(evt) {
	if (!mouseDown) {
		currPos = getMousePos(evt);
		if (currPos.x >= 0 && currPos.x <= canvas.width && currPos.y >= 0 && currPos.y <= canvas.height) {
			initPos.x = currPos.x;
			initPos.y = currPos.y;
			mouseDown = true;
		}
	}
}

function onMouseUp(evt) {
	mouseDown = false;
	currPos = getMousePos(evt);
	requestAnimationFrame(draw);
}

function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		requestAnimationFrame(draw);
	}
}

function draw() {
	switch (currTool) {
		case "none":
		drawRotated(angleInDegrees);
		break;

		case "crop":
		if (mouseDown) {
			drawRotated(angleInDegrees);
	
			// filler
			context.globalAlpha = 0.75;
			if (currPos.y < initPos.y) {
				context.fillRect(0, 0, canvas.width, currPos.y);
				context.fillRect(0, initPos.y, canvas.width, canvas.height - currPos.y);
			} else {
				context.fillRect(0, 0, canvas.width, initPos.y);
				context.fillRect(0, currPos.y, canvas.width, canvas.height - currPos.y);
			}
			if (currPos.x < initPos.x) {
				context.fillRect(0, currPos.y, currPos.x, initPos.y - currPos.y);
				context.fillRect(initPos.x, initPos.y, canvas.width - initPos.x, currPos.y - initPos.y);
			} else {
				context.fillRect(0, currPos.y, initPos.x, initPos.y - currPos.y);
				context.fillRect(currPos.x, currPos.y, canvas.width - initPos.x, initPos.y - currPos.y);
			}
			context.globalAlpha = 1;
	
			// border
			context.strokeStyle = '#FFFFFF';
			context.lineWidth = 1;
			context.strokeRect(initPos.x, initPos.y, currPos.x - initPos.x, currPos.y - initPos.y);
	
			// lines
			context.lineWidth = 0.75;
			context.beginPath();
			context.moveTo(initPos.x + ((currPos.x - initPos.x) / 3), initPos.y);
			context.lineTo(initPos.x + ((currPos.x - initPos.x) / 3), currPos.y);
			context.moveTo(initPos.x + ((currPos.x - initPos.x) * 2 / 3), initPos.y);
			context.lineTo(initPos.x + ((currPos.x - initPos.x) * 2 / 3), currPos.y);
			context.moveTo(initPos.x, initPos.y + ((currPos.y - initPos.y) / 3));
			context.lineTo(currPos.x, initPos.y + ((currPos.y - initPos.y) / 3));
			context.moveTo(initPos.x, initPos.y + ((currPos.y - initPos.y) * 2 / 3));
			context.lineTo(currPos.x, initPos.y + ((currPos.y - initPos.y) * 2 / 3));
			context.stroke();
		} else {
			if (currPos.x == initPos.x && currPos.y == initPos.y) // click without drag
				drawRotated(angleInDegrees);
		}
		break;

		case "rotate":
		drawRotated(angleInDegrees);
		break;
	}
}
