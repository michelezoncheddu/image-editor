'use strict';

/**
 * Initializes the editor state
 */
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
	image.onload = () => (setScaledSize(), update());
	image.src = 'test_images/merda.jpg';

	// first draw
	update();
}

/**
 * Detects the selected tool and enables its related button
 */
function toolSelector() {
	var lastTool = currTool;
	var tools = document.getElementsByClassName('tool-button');
	if ($(this).prop('id') == 'upload' || $(this).prop('id') == 'download') {
		// deselect other tools
		for (var i = 0; i < tools.length; i++)
			if (tools[i].classList.contains('selected'))
				tools[i].classList.remove('selected');
		currTool = 'none';
	}
	else if ($(this).hasClass('selected')) { // user deselected the current tool
		$(this).removeClass('selected');
		currTool = 'none';
	}
	else { // user selected an other tool
		for (var i = 0; i < tools.length; i++) { // disable the current tool
			if (tools[i].classList.contains('selected')) {
				tools[i].classList.remove('selected');
				break;
			}
		}
		$(this).addClass('selected');
		currTool = $(this).attr('id');
	}
	updateWindow(lastTool);
	update();
}

/**
 * Shows the correct tool controls in the web page
 */
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
