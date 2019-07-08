'use strict';

/**
 * Initializes the editor state
 */
function init() {
	canvas = $('#editor')[0];
	canvas.height = window.innerHeight * 0.7;
	canvas.width = window.innerWidth * 0.7;
	canvasBorder = canvas.getBoundingClientRect();

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	context.fillStyle = '#262626'; // background color

	// event handlers
	document.onmousedown = onMouseDown;
	document.onmousemove = onMouseMove;
	document.onmouseup = onMouseUp;
	
	document.onkeydown = onKeyDown;

	document.ontouchstart = onTouchStart;
	document.ontouchmove = onMouseMove;
	document.ontouchend = onMouseUp;

	canvas.onmouseenter = () => inside = true;
	canvas.onmouseleave = () => inside = false;

	$('.tool-button').click(toolSelector);

	// sliders handlers
	$('#zoomSlider').on('input', onZoomChange);
	$('#rotateSlider').on('input', onRotateChange);
	$('#brightnessSlider').on('input', onBrightnessChange);
	$('#saturationSlider').on('input', onSaturationChange);

	// slider color progress
	$('.slider').on('input', onSliderChange);

	// TEST
	image.onload = () => (setScaledSize(), update());
	image.src = 'test_images/test_2.jpg';

	// first draw
	update();
}

/**
 * Detects the selected tool and enables its related button
 */
function toolSelector() {
	var lastTool = currTool;
	var tools = $('.tool-button');
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

	// save rotated image
	if (lastTool == 'rotate') {
		saveImage();
		angleInDegrees = 0;
		$('#degreesValue').html(angleInDegrees.toString() + '°');
		$('#rotateSlider').val(angleInDegrees);
		$('#rotateSlider').trigger('input');
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
