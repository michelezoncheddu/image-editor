'use strict';

function init() {
	// @ts-ignore
	canvas = document.getElementById('editor');
	canvas.height = window.innerHeight * 0.7;
	canvas.width = window.innerWidth * 0.7;
	canvasBorder = canvas.getBoundingClientRect();

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	context.fillStyle = '#262626'; // background color

	// event handlers
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	document.addEventListener('touchstart', onTouchStart);
	document.addEventListener('touchmove', onMouseMove);
	document.addEventListener('touchend', onMouseUp);

	canvas.onmouseenter = () => inside = true;
	canvas.onmouseleave = () => inside = false;

	$('.tool-button').click(toolSelector);

	// sliders handlers
	document.getElementById('zoomSlider').oninput = onZoomChange;
	document.getElementById('rotateSlider').oninput = onRotateChange;
	document.getElementById('brightnessSlider').oninput = onBrightnessChange;
	document.getElementById('saturationSlider').oninput = onSaturationChange;

	// slider color progress
	$('.slider').on('input', function(e) {
		// @ts-ignore
		var min = e.target.min, max = e.target.max, val = e.target.value;
		$(e.target).css('background-size', (val - min) * 100 / (max - min) + '% 100%');
	});

	// TEST
	image.onload = () => (setImageSize(), update());
	image.src = 'test_images/merda.jpg';

	// first draw
	update();
}

function toolSelector() {
	var lastTool = currTool;
	var tools = document.getElementsByClassName('tool-button');
	if ($(this).prop('id') == 'upload' || $(this).prop('id') == 'download') {
		// deselect other tools
		for (var i = 0; i < tools.length; i++)
			if (tools[i].classList.contains('active'))
				tools[i].classList.remove('active');
		currTool = 'none';
	}
	else if ($(this).hasClass('active')) { // user deselected the current tool
		$(this).removeClass('active');
		currTool = 'none';
	}
	else { // user selected an another tool
		for (var i = 0; i < tools.length; i++) { // disable the current tool
			if (tools[i].classList.contains('active')) {
				tools[i].classList.remove('active');
				break;
			}
		}
		$(this).addClass('active');
		currTool = $(this).attr('id');
	}
	selection = null;
	drawImage();
	updateWindow(lastTool);
}

function updateWindow(lastTool) {
	if (lastTool != 'none') { // there's something to hide
		var tool = document.getElementById(lastTool + 'Div');
		if (tool != null)
			tool.classList.add('hidden');
	}
	if (currTool != 'none') { // there's something to show
		var tool = document.getElementById(currTool + 'Div');
		if (tool != null)
			tool.classList.remove('hidden');
	}
}
