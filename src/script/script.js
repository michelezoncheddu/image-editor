'use strict';

function init() {
	image.src = "test_images/test_2.jpg";

	// @ts-ignore
	canvas = document.getElementById('image');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	$('#tools').css('top', canvas.height + (canvas.height / 20));

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	// background color
	context.fillStyle = '#262626';

	window.addEventListener('resize', onResize);
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	$('.icon').click(function() {
		if ($(this).prop('id') == 'upload') { // TODO: good string check?
			// deselect other icons
			var icons = document.getElementsByClassName('icon');
			for (var i = 0; i < icons.length; i++)
				if (icons[i].classList.contains('active'))
					icons[i].classList.remove('active');
			currTool = 'none';
			return;
		}

		// user clicked on the active tool
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			currTool = 'none';
			return;
		}

		// user clicked on another tool
		var icons = document.getElementsByClassName('icon');
		for (var i = 0; i < icons.length; i++) { // disable the current tool
			if (icons[i].classList.contains('active')) {
				icons[i].classList.remove('active');
				break;
			}
		}
		$(this).addClass('active');
		currTool = $(this).attr('id');
	})

	update();
}

function onMouseDown(evt) {
	currPos = getMousePos(evt);
	if (currPos.x >= 0 && currPos.x <= canvas.width && currPos.y >= 0 && currPos.y <= canvas.height) {
		clickPos.x = currPos.x;
		clickPos.y = currPos.y;
		mouseDown = true;
		update();
	}
}

function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		update();
	}
}

function onMouseUp(evt) {
	mouseDown = false;
	releasePos = getMousePos(evt);
	update();
}
